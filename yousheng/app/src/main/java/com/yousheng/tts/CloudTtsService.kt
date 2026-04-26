package com.yousheng.tts

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.media.MediaPlayer
import android.util.Base64
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

/**
 * DashScope 云端TTS服务
 * 支持模型：
 * 1. qwen3-tts-flash（PCM流式）
 * 2. qwen3-tts-vd-2026-01-26（WAV/MP3高质量语音）
 */
class CloudTtsService(
    private val apiKey: String,
    private val model: String = "qwen3-tts-flash"
) {

    companion object {
        private const val TAG = "CloudTtsService"

        private const val API_URL =
            "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation"

        private const val VOICE = "Kai"
        private const val DEFAULT_SAMPLE_RATE = 24000
    }

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(0, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private var audioTrack: AudioTrack? = null
    private var mediaPlayer: MediaPlayer? = null
    private var currentJob: Job? = null

    private var isPlaying = false
    private var isPaused = false
    private var hasReceivedAudio = false

    // 回调
    var onStart: (() -> Unit)? = null
    var onComplete: (() -> Unit)? = null
    var onError: ((String) -> Unit)? = null

    /**
     * 开始朗读
     */
    fun speak(text: String) {
        val sanitizedText = text.replace(Regex("[\\p{Cntrl}]"), "").trim()
        if (sanitizedText.isEmpty()) {
            onError?.invoke("文本不能为空")
            return
        }

        stop()
        hasReceivedAudio = false

        currentJob = serviceScope.launch {
            try {
                callDashScopeApi(sanitizedText)
            } catch (e: Exception) {
                Log.e(TAG, "TTS错误", e)
                withContext(Dispatchers.Main) {
                    onError?.invoke(e.message ?: "TTS调用失败")
                }
            }
        }
    }

    /**
     * 调用DashScope API
     */
    private suspend fun callDashScopeApi(text: String) {
        val inputJson = JSONObject().apply {
            put("text", text)
        }

        val parametersJson = JSONObject().apply {
            put("voice", VOICE)
            put("format", "pcm") // 若模型支持，将直接返回PCM
            put("sample_rate", DEFAULT_SAMPLE_RATE)
        }

        val requestJson = JSONObject().apply {
            put("model", model)
            put("input", inputJson)
            put("parameters", parametersJson)
        }

        val requestBody = requestJson.toString()
            .toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(API_URL)
            .addHeader("Authorization", "Bearer $apiKey")
            .addHeader("Content-Type", "application/json")
            .addHeader("X-DashScope-SSE", "enable")
            .post(requestBody)
            .build()

        Log.d(TAG, "请求: $requestJson")

        val response = client.newCall(request).execute()

        if (!response.isSuccessful) {
            val error = response.body?.string()
            withContext(Dispatchers.Main) {
                onError?.invoke("API错误: ${response.code} $error")
            }
            return
        }

        // 检查响应体是否有效
        if (response.body == null) {
            withContext(Dispatchers.Main) {
                onError?.invoke("云端TTS无响应数据")
            }
            return
        }

        isPlaying = true
        withContext(Dispatchers.Main) { onStart?.invoke() }

        val reader = BufferedReader(InputStreamReader(response.body!!.byteStream()))
        var line: String?

        while (reader.readLine().also { line = it } != null && isPlaying) {
            val trimmed = line?.trim() ?: continue

            if (trimmed.isEmpty()) continue
            if (trimmed == "data: [DONE]") break

            if (trimmed.startsWith("data:")) {
                val jsonStr = trimmed.removePrefix("data:").trim()
                handleAudioChunk(jsonStr)
            }

            while (isPaused && isPlaying) {
                delay(100)
            }
        }

        reader.close()
        response.close()

        // 如果没有收到任何音频数据，触发错误回调以降级到本地TTS
        if (!hasReceivedAudio) {
            Log.w(TAG, "云端TTS未返回音频数据，降级到本地TTS")
            withContext(Dispatchers.Main) {
                isPlaying = false
                onError?.invoke("云端TTS未返回音频数据")
            }
            return
        }

        delay(300)
        withContext(Dispatchers.Main) {
            isPlaying = false
            onComplete?.invoke()
        }
    }

    /**
     * 处理音频数据
     */
    private fun handleAudioChunk(jsonStr: String) {
        Log.d(TAG, "DashScope响应: $jsonStr")
        try {
            val json = JSONObject(jsonStr)
            val output = json.optJSONObject("output") ?: return
            val audio = output.optJSONObject("audio") ?: return

            val base64Data = audio.optString("data")
            val format = audio.optString("format", "pcm").lowercase()
            val sampleRate = audio.optInt("sample_rate", DEFAULT_SAMPLE_RATE)

            if (base64Data.isEmpty()) return

            hasReceivedAudio = true

            val audioBytes = Base64.decode(base64Data, Base64.DEFAULT)

            when (format) {
                "pcm" -> playPcm(audioBytes, sampleRate)
                "wav" -> playPcm(extractPcmFromWav(audioBytes), sampleRate)
                "mp3" -> playCompressedAudio(audioBytes, "mp3")
                else -> Log.w(TAG, "未知音频格式: $format")
            }
        } catch (e: Exception) {
            Log.e(TAG, "解析音频失败:", e)
        }
    }

    /**
     * 播放PCM音频
     */
    private fun playPcm(pcmData: ByteArray, sampleRate: Int) {
        if (audioTrack == null) {
            val bufferSize = AudioTrack.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            )

            val attributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build()

            val format = AudioFormat.Builder()
                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                .setSampleRate(sampleRate)
                .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                .build()

            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(attributes)
                .setAudioFormat(format)
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            audioTrack?.play()
        }

        audioTrack?.write(pcmData, 0, pcmData.size)
    }

    /**
     * 从WAV中提取PCM数据
     */
    private fun extractPcmFromWav(wavBytes: ByteArray): ByteArray {
        return if (wavBytes.size > 44) {
            wavBytes.copyOfRange(44, wavBytes.size)
        } else {
            wavBytes
        }
    }

    /**
     * 播放MP3/WAV压缩音频
     */
    private fun playCompressedAudio(data: ByteArray, extension: String) {
        try {
            val file = kotlin.io.path.createTempFile("tts_audio", ".$extension").toFile()
            file.writeBytes(data)

            mediaPlayer?.release()
            mediaPlayer = MediaPlayer().apply {
                setDataSource(file.absolutePath)
                prepare()
                start()
            }
        } catch (e: Exception) {
            Log.e(TAG, "播放压缩音频失败", e)
        }
    }

    /**
     * 暂停播放
     */
    fun pause() {
        isPaused = true
        audioTrack?.pause()
        mediaPlayer?.pause()
    }

    /**
     * 恢复播放
     */
    fun resume() {
        isPaused = false
        audioTrack?.play()
        mediaPlayer?.start()
    }

    /**
     * 停止播放
     */
    fun stop() {
        isPlaying = false
        isPaused = false
        hasReceivedAudio = false

        currentJob?.cancel()
        currentJob = null

        audioTrack?.release()
        audioTrack = null

        mediaPlayer?.release()
        mediaPlayer = null
    }

    fun isSpeaking(): Boolean = isPlaying
    fun isPaused(): Boolean = isPaused

    /**
     * 释放资源
     */
    fun shutdown() {
        stop()
        serviceScope.cancel()
        client.dispatcher.executorService.shutdown()
        client.connectionPool.evictAll()
    }
}