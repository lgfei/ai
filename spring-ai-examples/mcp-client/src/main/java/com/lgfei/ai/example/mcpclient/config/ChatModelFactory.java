package com.lgfei.ai.example.mcpclient.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallbackProvider;
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
    private final ToolCallbackProvider callbackProvider;

    public ChatModelFactory(
            @Qualifier("openAiChatModel") ChatModel openAi,
            @Qualifier("ollamaChatModel") ChatModel ollama,
            @Qualifier("deepSeekChatModel") ChatModel deepSeek,
            ToolCallbackProvider callbackProvider
    ) {
        this.modelMap = Map.of(
                "openai", openAi,
                "ollama", ollama,
                "deepseek", deepSeek
        );
        this.callbackProvider = callbackProvider;
    }

    public ChatModel getModel(String modelProvider) {
        ChatModel model = modelMap.getOrDefault(modelProvider.toLowerCase(), modelMap.get("ollama"));
        return model;
    }

    public ChatClient getClient(String modelProvider) {
        ChatModel model = this.getModel(modelProvider);
       return ChatClient.create(model)
               .mutate()
               .defaultToolCallbacks(callbackProvider)
               .build();
    }
}
