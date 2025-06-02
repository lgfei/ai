package com.lgfei.ai.example.mcpclient.api;

import com.lgfei.ai.example.mcpclient.config.ChatModelFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * @author lgfei
 * @date 2025/6/2 11:53
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatModelFactory chatModelFactory;

    public ChatController(ChatModelFactory chatModelFactory) {
        this.chatModelFactory = chatModelFactory;
    }

    @GetMapping(value = "/stream/{model_key}", produces = "text/html;charset=UTF-8")
    public Flux<String> streamChat(@PathVariable("model_key") String modelKey,
                                   @RequestParam(value = "input", defaultValue = "今天纽约的天气") String input)
    {
        ChatClient chatClient = chatModelFactory.getClient(modelKey);
        Flux<String> output = chatClient.prompt(input).stream().content();
        return output;
    }
}

