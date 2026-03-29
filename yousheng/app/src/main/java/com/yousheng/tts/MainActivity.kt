package com.yousheng.tts

import android.app.AlertDialog
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.TextToSpeech.Engine
import android.speech.tts.UtteranceProgressListener
import android.view.LayoutInflater
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var textToSpeech: TextToSpeech
    private lateinit var etTextInput: EditText
    private lateinit var btnRead: Button
    private lateinit var btnStop: Button
    private lateinit var btnClear: Button
    private lateinit var btnShowPhrases: Button
    private lateinit var btnShowHistory: Button
    private lateinit var btnSettings: Button

    private var isSpeaking = false
    private var currentText = ""

    // 最近输入历史（最多10条）
    private val inputHistory = mutableListOf<String>()
    private lateinit var sharedPreferences: SharedPreferences

    // 语音设置
    private var speechRate: Float = 1.0f  // 语速默认值1.0
    private var speechPitch: Float = 0.5f  // 语调默认值0.5
    private var useDefaultSettings: Boolean = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 初始化视图
        etTextInput = findViewById(R.id.etTextInput)
        btnRead = findViewById(R.id.btnRead)
        btnStop = findViewById(R.id.btnStop)
        btnClear = findViewById(R.id.btnClear)
        btnShowPhrases = findViewById(R.id.btnShowPhrases)
        btnShowHistory = findViewById(R.id.btnShowHistory)
        btnSettings = findViewById(R.id.btnSettings)

        // 初始化 SharedPreferences
        sharedPreferences = getSharedPreferences("yousheng_history", MODE_PRIVATE)

        // 加载历史记录
        loadHistory()

        // 加载语音设置
        loadSpeechSettings()

        // 初始化 TTS 引擎
        textToSpeech = TextToSpeech(this, this)

        // 设置按钮点击事件
        setupButtonClickListeners()

        // 显示欢迎消息
        Toast.makeText(this, "欢迎使用有声文字转语音", Toast.LENGTH_SHORT).show()
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            // 设置中文语音（优先尝试简体中文）
            val result = textToSpeech.setLanguage(Locale.CHINA)

            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // 如果中文不支持，尝试使用默认语言
                textToSpeech.language = Locale.getDefault()
            } else {
                // 应用语音设置
                applySpeechSettings()

                // 尝试设置男性声音
                try {
                    // 获取可用的语音列表
                    val voices = textToSpeech.voices

                    // 查找中文男性声音
                    var maleVoice = voices.find { voice ->
                        voice.locale == Locale.CHINA &&
                        voice.name.contains("male", ignoreCase = true)
                    }

                    // 如果没有找到中文男性声音，尝试查找任何男性声音
                    if (maleVoice == null) {
                        maleVoice = voices.find { voice ->
                            voice.name.contains("male", ignoreCase = true)
                        }
                    }

                    // 如果找到男性声音，设置为默认
                    if (maleVoice != null) {
                        textToSpeech.voice = maleVoice
                    } else {
                        // 如果没有男性声音，尝试设置较低音调的声音
                        val lowPitchVoice = voices.find { voice ->
                            voice.locale == Locale.CHINA
                        }
                        if (lowPitchVoice != null) {
                            textToSpeech.voice = lowPitchVoice
                        }
                    }
                } catch (e: Exception) {
                    // 如果设置失败，使用默认声音
                    e.printStackTrace()
                }
            }

            // 设置语音完成监听
            textToSpeech.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {
                    runOnUiThread {
                        btnRead.isEnabled = false
                        btnStop.isEnabled = true
                        isSpeaking = true
                    }
                }

                override fun onDone(utteranceId: String?) {
                    runOnUiThread {
                        btnRead.isEnabled = true
                        btnStop.isEnabled = false
                        isSpeaking = false
                    }
                }

                override fun onError(utteranceId: String?) {
                    runOnUiThread {
                        btnRead.isEnabled = true
                        btnStop.isEnabled = false
                        isSpeaking = false
                    }
                }
            })

            btnRead.isEnabled = true
        } else {
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

        btnClear.setOnClickListener {
            clearText()
        }

        btnShowPhrases.setOnClickListener {
            showCommonPhrasesDialog()
        }

        btnShowHistory.setOnClickListener {
            showInputHistoryDialog()
        }

        btnSettings.setOnClickListener {
            showSettingsDialog()
        }
    }

    private fun showCommonPhrasesDialog() {
        // 加载弹框布局
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_common_phrases, null)

        // 创建弹框
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        // 设置弹框按钮点击事件
        val dialogBtnPhrase1: Button = dialogView.findViewById(R.id.dialogBtnPhrase1)
        val dialogBtnPhrase2: Button = dialogView.findViewById(R.id.dialogBtnPhrase2)
        val dialogBtnPhrase3: Button = dialogView.findViewById(R.id.dialogBtnPhrase3)
        val dialogBtnPhrase4: Button = dialogView.findViewById(R.id.dialogBtnPhrase4)
        val dialogBtnPhrase5: Button = dialogView.findViewById(R.id.dialogBtnPhrase5)
        val dialogBtnPhrase6: Button = dialogView.findViewById(R.id.dialogBtnPhrase6)
        val dialogBtnPhrase7: Button = dialogView.findViewById(R.id.dialogBtnPhrase7)
        val dialogBtnPhrase8: Button = dialogView.findViewById(R.id.dialogBtnPhrase8)
        val dialogBtnPhrase9: Button = dialogView.findViewById(R.id.dialogBtnPhrase9)
        val dialogBtnPhrase10: Button = dialogView.findViewById(R.id.dialogBtnPhrase10)
        val dialogBtnClose: Button = dialogView.findViewById(R.id.dialogBtnClose)

        // 为每个按钮的文本添加序号前缀
        dialogBtnPhrase1.text = "1. ${getString(R.string.phrase_hello)}"
        dialogBtnPhrase2.text = "2. ${getString(R.string.phrase_where_bathroom)}"
        dialogBtnPhrase3.text = "3. ${getString(R.string.phrase_im_cold)}"
        dialogBtnPhrase4.text = "4. ${getString(R.string.phrase_im_hot)}"
        dialogBtnPhrase5.text = "5. ${getString(R.string.phrase_im_hungry)}"
        dialogBtnPhrase6.text = "6. ${getString(R.string.phrase_im_thirsty)}"
        dialogBtnPhrase7.text = "7. ${getString(R.string.phrase_im_tired)}"
        dialogBtnPhrase8.text = "8. ${getString(R.string.phrase_need_help)}"
        dialogBtnPhrase9.text = "9. ${getString(R.string.phrase_wait_moment)}"
        dialogBtnPhrase10.text = "10. ${getString(R.string.phrase_thank_you)}"

        dialogBtnPhrase1.setOnClickListener {
            speakPhrase(getString(R.string.phrase_hello))
            dialog.dismiss()
        }

        dialogBtnPhrase2.setOnClickListener {
            speakPhrase(getString(R.string.phrase_where_bathroom))
            dialog.dismiss()
        }

        dialogBtnPhrase3.setOnClickListener {
            speakPhrase(getString(R.string.phrase_im_cold))
            dialog.dismiss()
        }

        dialogBtnPhrase4.setOnClickListener {
            speakPhrase(getString(R.string.phrase_im_hot))
            dialog.dismiss()
        }

        dialogBtnPhrase5.setOnClickListener {
            speakPhrase(getString(R.string.phrase_im_hungry))
            dialog.dismiss()
        }

        dialogBtnPhrase6.setOnClickListener {
            speakPhrase(getString(R.string.phrase_im_thirsty))
            dialog.dismiss()
        }

        dialogBtnPhrase7.setOnClickListener {
            speakPhrase(getString(R.string.phrase_im_tired))
            dialog.dismiss()
        }

        dialogBtnPhrase8.setOnClickListener {
            speakPhrase(getString(R.string.phrase_need_help))
            dialog.dismiss()
        }

        dialogBtnPhrase9.setOnClickListener {
            speakPhrase(getString(R.string.phrase_wait_moment))
            dialog.dismiss()
        }

        dialogBtnPhrase10.setOnClickListener {
            speakPhrase(getString(R.string.phrase_thank_you))
            dialog.dismiss()
        }

        dialogBtnClose.setOnClickListener {
            dialog.dismiss()
        }

        // 显示弹框
        dialog.show()
    }

    private fun speakPhrase(phrase: String) {
        // 停止当前朗读
        if (isSpeaking) {
            textToSpeech.stop()
        }

        // 移除序号前缀（如"1. "），只朗读实际内容
        val actualText = phrase.replaceFirst("^\\d+\\.\\s*".toRegex(), "")

        // 更新当前文本
        currentText = actualText

        // 使用 Bundle 传递参数
        val utteranceId = "phrase_${System.currentTimeMillis()}"
        val params = Bundle()
        params.putString(Engine.KEY_PARAM_UTTERANCE_ID, utteranceId)

        // 朗读短语
        textToSpeech.speak(actualText, TextToSpeech.QUEUE_FLUSH, params, utteranceId)

        // 更新状态
        btnRead.isEnabled = false
        btnStop.isEnabled = true
        isSpeaking = true
    }

    private fun showInputHistoryDialog() {
        // 加载弹框布局
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_input_history, null)

        // 创建弹框
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        // 获取容器
        val historyListContainer = dialogView.findViewById<android.widget.LinearLayout>(R.id.historyListContainer)
        val dialogBtnCloseHistory = dialogView.findViewById<Button>(R.id.dialogBtnCloseHistory)

        // 关闭按钮点击事件
        dialogBtnCloseHistory.setOnClickListener {
            dialog.dismiss()
        }

        // 更新历史列表
        updateHistoryDialog(historyListContainer, dialog)

        // 显示弹框
        dialog.show()
    }

    private fun updateHistoryDialog(container: android.widget.LinearLayout, dialog: AlertDialog) {
        // 清空容器
        container.removeAllViews()

        if (inputHistory.isEmpty()) {
            // 显示空状态
            val emptyText = TextView(this)
            emptyText.text = "暂无历史记录"
            emptyText.gravity = android.view.Gravity.CENTER
            emptyText.textSize = 18f
            emptyText.setTextColor(resources.getColor(android.R.color.darker_gray))
            emptyText.setPadding(0, 32, 0, 32)
            container.addView(emptyText)
        } else {
            // 每两行一个水平布局
            var currentRow: android.widget.LinearLayout? = null

            for ((index, text) in inputHistory.withIndex()) {
                // 每两个项目创建一行
                if (index % 2 == 0) {
                    currentRow = android.widget.LinearLayout(this)
                    currentRow.layoutParams = android.widget.LinearLayout.LayoutParams(
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                        android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                    currentRow.orientation = android.widget.LinearLayout.HORIZONTAL
                    currentRow.weightSum = 2f

                    // 设置行间距（与常用语保持一致）
                    val rowParams = android.widget.LinearLayout.LayoutParams(
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                        android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                    rowParams.setMargins(0, 0, 0, 8)
                    currentRow.layoutParams = rowParams

                    container.addView(currentRow)
                }

                // 创建历史项
                val historyItem = createHistoryItem(text, dialog)

                // 设置布局参数（每行两个项目，各占一半宽度）
                val itemParams = android.widget.LinearLayout.LayoutParams(
                    0,
                    android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
                )
                itemParams.weight = 1f

                // 设置项目间距
                if (index % 2 == 0) {
                    // 第一个项目：右边距（与常用语保持一致）
                    itemParams.setMargins(0, 0, 4, 0)
                } else {
                    // 第二个项目：左边距（与常用语保持一致）
                    itemParams.setMargins(4, 0, 0, 0)
                }

                historyItem.layoutParams = itemParams
                currentRow?.addView(historyItem)
            }
        }
    }

    private fun createHistoryItem(text: String, dialog: AlertDialog): Button {
        val button = Button(this, null, 0, R.style.ButtonStyle_Small)
        button.text = text
        button.maxLines = 2
        button.ellipsize = android.text.TextUtils.TruncateAt.END

        // 点击事件：直接朗读文本并关闭弹框（不添加到历史）
        button.setOnClickListener {
            speakPhrase(text)
            dialog.dismiss()
        }

        return button
    }

    private fun addToHistory(text: String) {
        if (text.isNotEmpty()) {
            // 移除重复项（如果存在）
            inputHistory.remove(text)

            // 添加到列表开头（最新的在前面）
            inputHistory.add(0, text)

            // 限制最多10条
            if (inputHistory.size > 10) {
                inputHistory.removeAt(inputHistory.size - 1)
            }

            // 保存到 SharedPreferences
            saveHistory()
        }
    }

    private fun loadHistory() {
        val historyString = sharedPreferences.getString("input_history", "")
        if (!historyString.isNullOrEmpty()) {
            // 使用特殊分隔符"|||"分割历史记录
            inputHistory.clear()
            inputHistory.addAll(historyString.split("|||").filter { it.isNotEmpty() })
        }
    }

    private fun saveHistory() {
        val editor = sharedPreferences.edit()
        // 将历史记录保存为逗号分隔的字符串
        val historyString = inputHistory.joinToString("|||")  // 使用特殊分隔符
        editor.putString("input_history", historyString)
        editor.apply()
    }

    private fun loadSpeechSettings() {
        val settingsPrefs = getSharedPreferences("yousheng_settings", MODE_PRIVATE)
        useDefaultSettings = settingsPrefs.getBoolean("use_default", true)
        speechRate = settingsPrefs.getFloat("speech_rate", 1.0f)  // 语速默认值1.0
        speechPitch = settingsPrefs.getFloat("speech_pitch", 0.5f)  // 语调默认值0.5
    }

    private fun saveSpeechSettings() {
        val editor = getSharedPreferences("yousheng_settings", MODE_PRIVATE).edit()
        editor.putBoolean("use_default", useDefaultSettings)
        editor.putFloat("speech_rate", speechRate)
        editor.putFloat("speech_pitch", speechPitch)
        editor.apply()
    }

    private fun applySpeechSettings() {
        if (::textToSpeech.isInitialized) {
            if (useDefaultSettings) {
                // 使用默认值：语速1.0，音调0.5
                textToSpeech.setSpeechRate(1.0f)
                textToSpeech.setPitch(0.5f)
            } else {
                // 使用用户设置
                textToSpeech.setSpeechRate(speechRate)
                textToSpeech.setPitch(speechPitch)
            }
        }
    }

    private fun startReading() {
        currentText = etTextInput.text.toString().trim()

        if (currentText.isEmpty()) {
            Toast.makeText(this, getString(R.string.no_text), Toast.LENGTH_SHORT).show()
            return
        }

        // 添加到历史记录
        addToHistory(currentText)

        // 使用 Bundle 传递参数
        val utteranceId = this.javaClass.canonicalName
        val params = Bundle()
        params.putString(Engine.KEY_PARAM_UTTERANCE_ID, utteranceId)

        textToSpeech.speak(currentText, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
    }

    private fun stopReading() {
        textToSpeech.stop()
        btnRead.isEnabled = true
        btnStop.isEnabled = false
        isSpeaking = false
    }

    private fun clearText() {
        etTextInput.setText("")
        if (isSpeaking) {
            stopReading()
        }
    }

    private fun showSettingsDialog() {
        // 加载弹框布局
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_settings, null)

        // 创建弹框
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        // 获取控件
        val dialogBtnCloseSettings: Button = dialogView.findViewById(R.id.dialogBtnCloseSettings)
        val cbUseDefault: android.widget.CheckBox = dialogView.findViewById(R.id.cbUseDefault)
        val sbSpeechRate: android.widget.SeekBar = dialogView.findViewById(R.id.sbSpeechRate)
        val tvSpeechRateValue: TextView = dialogView.findViewById(R.id.tvSpeechRateValue)
        val sbSpeechPitch: android.widget.SeekBar = dialogView.findViewById(R.id.sbSpeechPitch)
        val tvSpeechPitchValue: TextView = dialogView.findViewById(R.id.tvSpeechPitchValue)
        val btnSaveSettings: Button = dialogView.findViewById(R.id.btnSaveSettings)

        // 初始化控件状态
        cbUseDefault.isChecked = useDefaultSettings
        updateSeekBarState(cbUseDefault.isChecked, sbSpeechRate, sbSpeechPitch)

        // 设置语速SeekBar初始值（0.1-2.0范围，步长0.1）
        val rateProgress = ((speechRate - 0.1f) * 10).toInt()
        sbSpeechRate.progress = rateProgress.coerceIn(0, 19)  // 最大值19对应2.0
        tvSpeechRateValue.text = String.format("%.1f", speechRate)

        // 设置音调SeekBar初始值（0.1-1.0范围，步长0.1）
        val pitchProgress = ((speechPitch - 0.1f) * 10).toInt()
        sbSpeechPitch.progress = pitchProgress.coerceIn(0, 9)  // 最大值改为9（对应1.0）
        tvSpeechPitchValue.text = String.format("%.1f", speechPitch)

        // 关闭按钮点击事件
        dialogBtnCloseSettings.setOnClickListener {
            dialog.dismiss()
        }

        // 使用默认值复选框变化事件
        cbUseDefault.setOnCheckedChangeListener { _, isChecked ->
            updateSeekBarState(isChecked, sbSpeechRate, sbSpeechPitch)

            // 如果勾选使用默认值，自动恢复默认值
            if (isChecked) {
                sbSpeechRate.progress = 9  // 对应1.0 (0.1 + 9*0.1 = 1.0)
                sbSpeechPitch.progress = 4  // 对应0.5 (0.1 + 4*0.1 = 0.5)
                tvSpeechRateValue.text = "1.0"
                tvSpeechPitchValue.text = "0.5"
            }
        }

        // 语速SeekBar变化事件
        sbSpeechRate.setOnSeekBarChangeListener(object : android.widget.SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: android.widget.SeekBar?, progress: Int, fromUser: Boolean) {
                val rate = 0.1f + progress * 0.1f
                tvSpeechRateValue.text = String.format("%.1f", rate)
            }

            override fun onStartTrackingTouch(seekBar: android.widget.SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: android.widget.SeekBar?) {}
        })

        // 音调SeekBar变化事件
        sbSpeechPitch.setOnSeekBarChangeListener(object : android.widget.SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: android.widget.SeekBar?, progress: Int, fromUser: Boolean) {
                val pitch = 0.1f + progress * 0.1f
                tvSpeechPitchValue.text = String.format("%.1f", pitch)
            }

            override fun onStartTrackingTouch(seekBar: android.widget.SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: android.widget.SeekBar?) {}
        })

        // 保存设置按钮点击事件
        btnSaveSettings.setOnClickListener {
            useDefaultSettings = cbUseDefault.isChecked

            if (!useDefaultSettings) {
                // 计算语速值（0.1-2.0）
                speechRate = 0.1f + sbSpeechRate.progress * 0.1f
                // 计算音调值（0.1-1.0）
                speechPitch = 0.1f + sbSpeechPitch.progress * 0.1f
            } else {
                // 使用默认值
                speechRate = 1.0f
                speechPitch = 0.5f
            }

            // 保存设置
            saveSpeechSettings()
            // 应用设置
            applySpeechSettings()

            Toast.makeText(this, "设置已保存", Toast.LENGTH_SHORT).show()
            dialog.dismiss()
        }

        // 显示弹框
        dialog.show()
    }

    private fun updateSeekBarState(useDefault: Boolean, sbSpeechRate: android.widget.SeekBar, sbSpeechPitch: android.widget.SeekBar) {
        sbSpeechRate.isEnabled = !useDefault
        sbSpeechPitch.isEnabled = !useDefault

        // 更新SeekBar的alpha值（禁用时变灰）
        sbSpeechRate.alpha = if (useDefault) 0.5f else 1.0f
        sbSpeechPitch.alpha = if (useDefault) 0.5f else 1.0f
    }

    override fun onDestroy() {
        if (::textToSpeech.isInitialized) {
            textToSpeech.stop()
            textToSpeech.shutdown()
        }
        super.onDestroy()
    }
}
