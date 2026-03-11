package com.lgfei.ai.example.chatbot;

import io.agentscope.core.ReActAgent;
import io.agentscope.core.message.Msg;
import io.agentscope.core.model.DashScopeChatModel;

/**
 * @author lgfei
 * @date 2026/2/24 10:10
 */
public class AgentScopeExample {
    public static void main(String[] args) {
        System.setProperty("DASHSCOPE_API_KEY", "sk-ab0f0ee595fe4fbdb5c4575a9d3ab54d");
        ReActAgent agent = ReActAgent.builder()
                .name("Assistant")
                .sysPrompt("You are a helpful AI assistant.")
                .model(DashScopeChatModel.builder()
                        .apiKey(System.getProperty("DASHSCOPE_API_KEY"))
                        .modelName("qwen-max")
                        .build())
                .build();

        Msg response = agent.call(Msg.builder()
                .textContent("Who are you?")
                .build()).block();
        System.out.println(response.getTextContent());
    }
}
