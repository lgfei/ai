package com.lgfei.ai.example.chatbot.api;

import com.lgfei.ai.example.chatbot.config.ChatModelFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * @author lgfei
 * @date 2025/5/24 16:07
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatModelFactory chatModelFactory;

    public ChatController(ChatModelFactory chatModelFactory) {
        this.chatModelFactory = chatModelFactory;
    }

    @GetMapping("/{model_provider}")
    public ResponseEntity<String> chat(@PathVariable("model_provider") String modelProvider,
                                       @RequestParam(value = "input", defaultValue = "你是谁") String input)
    {
        ChatClient chatClient = chatModelFactory.getClient(modelProvider);
        String output = chatClient.prompt(input).call().content();
        return ResponseEntity.ok(output);
    }

    @GetMapping(value = "/stream/{modelProvider}", produces = "text/html;charset=UTF-8")
    public Flux<String> streamChat(@PathVariable("c") String modelProvider,
                                   @RequestParam(value = "input", defaultValue = "你是谁") String input)
    {
        ChatClient chatClient = chatModelFactory.getClient(modelProvider);
        Flux<String> output = chatClient.prompt(input).stream().content();
        return output;
    }
}
