package com.lgfei.ai.example.langchain4jollama;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ResponseFormat;
import dev.langchain4j.model.chat.request.ResponseFormatType;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import dev.langchain4j.model.chat.request.json.JsonSchema;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.service.AiServices;

import java.util.Map;

import static dev.langchain4j.model.chat.Capability.RESPONSE_FORMAT_JSON_SCHEMA;
import static dev.langchain4j.model.chat.request.ResponseFormat.JSON;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author lgfei
 * @date 2025/6/7 11:26
 */
public class OllamaChatModelTest {
    private final static String MODEL_QWEN25 = "qwen2.5-coder:7b"; // try other local ollama model names
    private final static String MODEL_DSR1 = "deepseek-r1:1.5b-qwen-distill-q4_K_M";
    private final static String BASE_URL = "http://localhost:11434"; // local ollama base url

    public static void main(String[] args) {
        simpleExample(MODEL_DSR1);
        jsonSchemaWithAIServiceExample(MODEL_QWEN25);
        jsonSchemaWithLowLevelModelBuilderExample(MODEL_QWEN25);
    }

    public static void simpleExample(String modelName){
        ChatModel model = OllamaChatModel.builder()
                .baseUrl(BASE_URL)
                .modelName(modelName)
                .build();
        String answer = model.chat("List top 10 cites in China");
        System.out.println(answer);

        model = OllamaChatModel.builder()
                .baseUrl(BASE_URL)
                .modelName(modelName)
                .responseFormat(JSON)
                .build();

        String json = model.chat("List top 10 cites in US");
        System.out.println(json);
    }

    public static void jsonSchemaWithAIServiceExample(String modelName){
        record Person(String name, int age) {
        }
        interface PersonExtractor {

            Person extractPersonFrom(String text);
        }

        ChatModel chatModel = OllamaChatModel.builder()
                .baseUrl(BASE_URL)
                .modelName(modelName)
                .temperature(0.0)
                .supportedCapabilities(RESPONSE_FORMAT_JSON_SCHEMA)
                .logRequests(true)
                .build();

        PersonExtractor personExtractor = AiServices.create(PersonExtractor.class, chatModel);

        Person person = personExtractor.extractPersonFrom("John Doe is 42 years old");
        System.out.println(person);

        assertThat(person).isEqualTo(new Person("John Doe", 42));
    }

    public static void jsonSchemaWithLowLevelModelBuilderExample(String modelName){
        ChatModel chatModel = OllamaChatModel.builder()
                .baseUrl(BASE_URL)
                .modelName(modelName)
                .temperature(0.0)
                .responseFormat(ResponseFormat.builder()
                        .type(ResponseFormatType.JSON)
                        .jsonSchema(JsonSchema.builder()
                                .rootElement(JsonObjectSchema.builder()
                                        .addStringProperty("name")
                                        .addIntegerProperty("age")
                                        .build())
                                .build())
                        .build())
                .logRequests(true)
                .build();

        String json = chatModel.chat("Extract: John Doe is 42 years old");
        System.out.println(json);

        assertThat(toMap(json)).isEqualTo(Map.of("name", "John Doe", "age", 42));
    }

    private static Map<String, Object> toMap(String json) {
        try {
            return new ObjectMapper().readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
