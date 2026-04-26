package com.yousheng.tts

import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

class TtsManager(private val context: Context) {

    companion object {
        private const val TAG = "TtsManager"
    }

    @Volatile
    private var tts: TextToSpeech? = null

    @Volatile
    private var isReady = false

    @Volatile
    private var isLocalTtsInitializing = true

    private var cloudTts: CloudTtsService? = null

    private val handler = Handler(Looper.getMainLooper())

    var onStart: (() -> Unit)? = null
    var onComplete: (() -> Unit)? = null
    var onError: ((String) -> Unit)? = null

    private var speechRate = 1.0f
    private var pitch = 0.5f
    private var lastText = ""
    private var useCloudTts = true

    fun init(callback: () -> Unit) {
        ConfigLoader.init(context)

        // 1. 云端优先初始化
        if (ConfigLoader.isApiKeyConfigured()) {
            cloudTts = CloudTtsService(ConfigLoader.getDashScopeApiKey())

            cloudTts?.onStart = { onStart?.invoke() }
            cloudTts?.onComplete = {
                onComplete?.invoke()
            }
            cloudTts?.onError = { errorMsg ->
                Log.w(TAG, "云端失败($errorMsg)，切本地")
                // 云端失败时降级到本地TTS
                fallbackToLocal()
            }
        }

        // 2. 延迟初始化本地 TTS（关键：避免 MIUI binder 问题）
        handler.postDelayed({
            initLocalTts(callback)
        }, 1000)
    }

    private fun initLocalTts(callback: () -> Unit) {
        isLocalTtsInitializing = true

        try {
            tts = TextToSpeech(context) { status ->
                Log.d(TAG, "TTS init status = $status")

                if (status == TextToSpeech.SUCCESS) {
                    val engine = tts?.defaultEngine
                    Log.d(TAG, "default engine = $engine")

                    var lang = tts?.setLanguage(Locale.CHINA)
                    Log.d(TAG, "setLanguage(Locale.CHINA) result = $lang")

                    if (lang == TextToSpeech.LANG_NOT_SUPPORTED) {
                        lang = tts?.setLanguage(Locale.SIMPLIFIED_CHINESE)
                        Log.d(TAG, "setLanguage(Locale.SIMPLIFIED_CHINESE) result = $lang")
                    }
                    if (lang == TextToSpeech.LANG_NOT_SUPPORTED) {
                        lang = tts?.setLanguage(Locale.CHINESE)
                        Log.d(TAG, "setLanguage(Locale.CHINESE) result = $lang")
                    }
                    if (lang == TextToSpeech.LANG_NOT_SUPPORTED) {
                        lang = tts?.setLanguage(Locale.US)
                        Log.d(TAG, "setLanguage(Locale.US) fallback result = $lang")
                    }

                    isReady = lang != TextToSpeech.LANG_NOT_SUPPORTED
                    Log.d(TAG, "isReady = $isReady")

                    if (!isReady) {
                        onError?.invoke("TTS语言包不可用")
                    } else {
                        setupTts()
                    }
                } else {
                    isReady = false
                    Log.e(TAG, "TTS初始化失败, status=$status")
                    onError?.invoke("TTS初始化失败(status=$status)")
                }

                isLocalTtsInitializing = false
                callback()
            }
        } catch (e: Exception) {
            Log.e(TAG, "init error", e)
            isReady = false
            isLocalTtsInitializing = false
            callback()
        }
    }

    private fun fallbackToLocal() {
        if (isLocalTtsInitializing) {
            Log.w(TAG, "本地TTS还在初始化中，等待完成后自动朗读")
            // 本地TTS初始化完成后会自动处理，暂不操作
            return
        }
        speakLocal(lastText)
    }

    private fun setupTts() {
        tts?.apply {
            setSpeechRate(speechRate)
            setPitch(pitch)

            setOnUtteranceProgressListener(object : UtteranceProgressListener() {

                override fun onStart(utteranceId: String?) {
                    onStart?.invoke()
                }

                override fun onDone(utteranceId: String?) {
                    onComplete?.invoke()
                }

                override fun onError(utteranceId: String?) {
                    onError?.invoke("TTS播放失败")
                }
            })
        }
    }

    fun speak(text: String) {
        if (text.isBlank()) return

        lastText = text

        // 云端优先（仅在开关开启时），失败后自动降级到本地
        if (useCloudTts) {
            cloudTts?.let {
                it.speak(text)
                return
            }
        }

        // 本地 fallback
        speakLocal(text)
    }

    fun setUseCloudTts(enabled: Boolean) {
        useCloudTts = enabled
        Log.d(TAG, "云端TTS开关: $enabled")
    }

    private fun speakLocal(text: String) {
        if (text.isBlank()) return

        if (isLocalTtsInitializing) {
            Log.w(TAG, "本地TTS还在初始化，延迟重试")
            handler.postDelayed({
                speakLocal(text)
            }, 500)
            return
        }

        if (!isReady || tts == null) {
            Log.e(TAG, "本地TTS不可用: isReady=$isReady, tts=$tts")
            onError?.invoke("TTS未初始化或不可用")
            return
        }

        val params = Bundle().apply {
            putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "tts_${System.currentTimeMillis()}")
        }

        handler.post {
            tts?.setSpeechRate(speechRate)
            tts?.setPitch(pitch)
            val result = tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, "id_${System.currentTimeMillis()}")
            Log.d(TAG, "speak result = $result")
        }
    }

    fun stop() {
        try {
            cloudTts?.stop()
            tts?.stop()
        } catch (e: Exception) {
            Log.e(TAG, "stop error", e)
        }
    }

    fun pause() {
        cloudTts?.pause()
    }

    fun resume() {
        cloudTts?.resume()
    }

    fun setSpeechRate(rate: Float) {
        speechRate = rate
        tts?.setSpeechRate(rate)
    }

    fun setPitch(p: Float) {
        pitch = p
        tts?.setPitch(p)
    }

    fun shutdown() {
        try {
            stop()
            cloudTts?.shutdown()
            tts?.shutdown()
            tts = null
            isReady = false
        } catch (e: Exception) {
            Log.e(TAG, "shutdown error", e)
        }
    }
}