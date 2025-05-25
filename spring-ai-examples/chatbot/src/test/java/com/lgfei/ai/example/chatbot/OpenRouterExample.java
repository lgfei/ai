package com.lgfei.ai.example.chatbot;

import okhttp3.*;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.Collections;

/**
 * @author lgfei
 * @date 2025/5/25 10:29
 */
public class OpenRouterExample {
    public static void main(String[] args) {
        Proxy proxy = new Proxy(
                Proxy.Type.HTTP,
                new InetSocketAddress(
                        "127.0.0.1",
                        7890
                )
        );
        OkHttpClient client = new OkHttpClient.Builder()
                .proxy(proxy)
                .protocols(Collections.singletonList(Protocol.HTTP_1_1))
                .build();
        MediaType JSON = MediaType.get("application/json; charset=utf-8");

        //"model": "deepseek/deepseek-r1",
        String json = """
        {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": "Hello, how are you?"}
            ],
            "temperature": 0.7
        }
        """;

        String apiKey = System.getenv("OPENROUTER_API_KEY");

        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url("https://openrouter.ai/api/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .header("HTTP-Referer", "https://baidu.com")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            System.out.println(response.body().string());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
