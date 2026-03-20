package com.yousheng.tts

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.TextToSpeech.Engine
import android.speech.tts.UtteranceProgressListener
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var textToSpeech: TextToSpeech
    private lateinit var etTextInput: EditText
    private lateinit var tvStatus: TextView
    private lateinit var btnRead: Button
    private lateinit var btnStop: Button
    private lateinit var btnPauseResume: Button
    private lateinit var btnClear: Button

    private var isSpeaking = false
    private var isPaused = false
    private var currentText = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 初始化视图
        etTextInput = findViewById(R.id.etTextInput)
        tvStatus = findViewById(R.id.tvStatus)
        btnRead = findViewById(R.id.btnRead)
        btnStop = findViewById(R.id.btnStop)
        btnPauseResume = findViewById(R.id.btnPauseResume)
        btnClear = findViewById(R.id.btnClear)

        // 初始化 TTS 引擎
        textToSpeech = TextToSpeech(this, this)

        // 设置按钮点击事件
        setupButtonClickListeners()

        // 显示欢迎消息
        Toast.makeText(this, "欢迎使用优声文字转语音", Toast.LENGTH_SHORT).show()
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            // 设置中文语音（优先尝试简体中文）
            val result = textToSpeech.setLanguage(Locale.CHINA)

            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // 如果中文不支持，尝试使用默认语言
                textToSpeech.language = Locale.getDefault()
                tvStatus.text = "已使用系统默认语音"
            } else {
                // 配置语音参数 - 适合老年人
                textToSpeech.setSpeechRate(0.8f)  // 语速稍慢
                textToSpeech.setPitch(1.0f)       // 音调适中
            }

            // 设置语音完成监听
            textToSpeech.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {
                    runOnUiThread {
                        tvStatus.text = getString(R.string.reading)
                        btnRead.isEnabled = false
                        btnStop.isEnabled = true
                        btnPauseResume.isEnabled = true
                        btnPauseResume.text = getString(R.string.button_pause)
                        isSpeaking = true
                        isPaused = false
                    }
                }

                override fun onDone(utteranceId: String?) {
                    runOnUiThread {
                        tvStatus.text = getString(R.string.stopped)
                        btnRead.isEnabled = true
                        btnStop.isEnabled = false
                        btnPauseResume.isEnabled = false
                        btnPauseResume.text = getString(R.string.button_pause)
                        isSpeaking = false
                        isPaused = false
                    }
                }

                override fun onError(utteranceId: String?) {
                    runOnUiThread {
                        tvStatus.text = "朗读出错"
                        btnRead.isEnabled = true
                        btnStop.isEnabled = false
                        btnPauseResume.isEnabled = false
                        isSpeaking = false
                        isPaused = false
                    }
                }
            })

            tvStatus.text = getString(R.string.voice_ready)
            btnRead.isEnabled = true
        } else {
            tvStatus.text = getString(R.string.voice_error)
            Toast.makeText(this, "TTS 初始化失败", Toast.LENGTH_LONG).show()
        }
    }

    private fun setupButtonClickListeners() {
        btnRead.setOnClickListener {
            startReading()
        }

        btnStop.setOnClickListener {
            stopReading()
        }

        btnPauseResume.setOnClickListener {
            if (isPaused) {
                resumeReading()
            } else {
                pauseReading()
            }
        }

        btnClear.setOnClickListener {
            clearText()
        }
    }

    private fun startReading() {
        currentText = etTextInput.text.toString().trim()

        if (currentText.isEmpty()) {
            Toast.makeText(this, getString(R.string.no_text), Toast.LENGTH_SHORT).show()
            return
        }

        // 使用 HashMap 传递参数
        val utteranceId = this.javaClass.canonicalName
        val params = HashMap<String, String>()
        params[Engine.KEY_PARAM_UTTERANCE_ID] = utteranceId

        textToSpeech.speak(currentText, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
    }

    private fun pauseReading() {
        if (isSpeaking && !isPaused) {
            textToSpeech.stop()
            isPaused = true
            btnPauseResume.text = getString(R.string.button_resume)
            tvStatus.text = getString(R.string.paused)
        }
    }

    private fun resumeReading() {
        if (isPaused) {
            val utteranceId = this.javaClass.canonicalName
            val params = HashMap<String, String>()
            params[Engine.KEY_PARAM_UTTERANCE_ID] = utteranceId

            textToSpeech.speak(currentText, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
        }
    }

    private fun stopReading() {
        textToSpeech.stop()
        tvStatus.text = getString(R.string.stopped)
        btnRead.isEnabled = true
        btnStop.isEnabled = false
        btnPauseResume.isEnabled = false
        btnPauseResume.text = getString(R.string.button_pause)
        isSpeaking = false
        isPaused = false
    }

    private fun clearText() {
        etTextInput.setText("")
        if (isSpeaking) {
            stopReading()
        }
    }

    override fun onDestroy() {
        if (::textToSpeech.isInitialized) {
            textToSpeech.stop()
            textToSpeech.shutdown()
        }
        super.onDestroy()
    }
}
