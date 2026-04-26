package com.lgfei.ai.example.chatbot;

import io.agentscope.core.ReActAgent;
import io.agentscope.core.message.Msg;
import io.agentscope.core.model.DashScopeChatModel;
import io.agentscope.core.model.OpenAIChatModel;

/**
 * @author lgfei
 * @date 2026/2/24 10:10
 */
public class AgentScopeExample {
    public static void main(String[] args) {
        String text = "你是什么模型?";
        //dashscopeExample(text);
        openaiExample(text);
    }

    private static void dashscopeExample(String text){
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
                .textContent(text)
                .build()).block();
        System.out.println(response.getTextContent());
    }

    private static void openaiExample(String text){
        System.setProperty("OPENAI_API_KEY", "sk-ZjwcMyiYjGfom9NsweMhILduRdMklphGOyK0m32dwmHsjIkW");
        ReActAgent agent = ReActAgent.builder()
                .name("Assistant")
                .sysPrompt("You are a helpful AI assistant.")
                .model(OpenAIChatModel.builder()
                        .apiKey(System.getProperty("OPENAI_API_KEY")) // 👉 new-api 的 key
                        .baseUrl("http://localhost:3000/v1") // 👉 new-api 地址（必须带 /v1）
                        .modelName("qwen3.5-plus-2026-02-15") // 👉 和 new-api 后台配置一致
                        .build())
                .build();

        Msg response = agent.call(Msg.builder()
                .textContent(text)
                .build()).block();

        System.out.println(response.getTextContent());
    }
}
