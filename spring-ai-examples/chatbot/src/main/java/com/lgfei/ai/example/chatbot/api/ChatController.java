package com.lgfei.ai.example.chatbot.api;

import com.lgfei.ai.example.chatbot.config.ChatModelFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{model_key}")
    public ResponseEntity<String> chat(@PathVariable("model_key") String modelKey,
                                       @RequestParam String prompt)
    {
        ChatClient chatClient = chatModelFactory.getClient(modelKey);
        String reply = chatClient.prompt(prompt).call().content();
        return ResponseEntity.ok(reply);
    }
}
