package com.lgfei.ai.example.chatbot.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * @author lgfei
 * @date 2025/5/24 17:23
 */
@Component
public class ChatModelFactory {
    private final Map<String, ChatModel> modelMap;

    public ChatModelFactory(
            @Qualifier("openAiChatModel") ChatModel openAi,
            @Qualifier("ollamaChatModel") ChatModel ollama,
            @Qualifier("deepSeekChatModel") ChatModel deepSeek
    ) {
        this.modelMap = Map.of(
                "openai", openAi,
                "ollama", ollama,
                "deepseek", deepSeek
        );
    }

    public ChatModel getModel(String modelKey) {
        ChatModel model = modelMap.getOrDefault(modelKey.toLowerCase(), modelMap.get("ollama"));
        return model;
    }

    public ChatClient getClient(String modelKey) {
        ChatModel model = this.getModel(modelKey);
        return ChatClient.create(model);
    }
}
