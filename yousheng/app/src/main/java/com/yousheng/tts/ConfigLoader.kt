package com.yousheng.tts

import android.content.Context
import java.util.Properties

object ConfigLoader {

    private var properties: Properties? = null

    fun init(context: Context) {
        if (properties == null) {
            properties = Properties()
            try {
                val inputStream = context.assets.open("config.properties")
                properties!!.load(inputStream)
                inputStream.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun getDashScopeApiKey(): String {
        return properties?.getProperty("dashscope_api_key", "") ?: ""
    }

    fun getMaxInputLength(): Int {
        return properties?.getProperty("max_input_length", "100")?.toIntOrNull() ?: 100
    }

    fun isApiKeyConfigured(): Boolean {
        val apiKey = getDashScopeApiKey()
        return apiKey.isNotEmpty() && apiKey != "YOUR_API_KEY_HERE"
    }
}