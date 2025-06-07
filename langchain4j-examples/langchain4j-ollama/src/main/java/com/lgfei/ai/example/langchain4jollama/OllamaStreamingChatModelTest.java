package com.lgfei.ai.example.langchain4jollama;

import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;

import java.util.concurrent.CompletableFuture;

/**
 * @author lgfei
 * @date 2025/6/7 11:38
 */
public class OllamaStreamingChatModelTest {
    private final static String MODEL_NAME = "qwen2.5-coder:7b"; // try other local ollama model names
    //private final static String MODEL_NAME = "deepseek-r1:1.5b-qwen-distill-q4_K_M";
    private final static String BASE_URL = "http://localhost:11434"; // local ollama base url

    public static void main(String[] args) {
        StreamingChatModel model = OllamaStreamingChatModel.builder()
                .baseUrl(BASE_URL)
                .modelName(MODEL_NAME)
                .build();

        String userMessage = "Write a 100-word poem about Java and AI";

        CompletableFuture<ChatResponse> futureResponse = new CompletableFuture<>();

        model.chat(userMessage, new StreamingChatResponseHandler() {

            @Override
            public void onPartialResponse(String partialResponse) {
                System.out.print(partialResponse);
            }

            @Override
            public void onCompleteResponse(ChatResponse completeResponse) {
                futureResponse.complete(completeResponse);
            }

            @Override
            public void onError(Throwable error) {
                futureResponse.completeExceptionally(error);
            }
        });

        futureResponse.join();
    }
}
