package com.so_tro_online.chatbot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.logging.Logger;

@Configuration
public class OpenAiServiceConfig {

    private static final Logger logger = Logger.getLogger(OpenAiServiceConfig.class.getName());

    @Bean
    public WebClient openAiWebClient(@Value("${openai.api-key:${OPENAI_API_KEY:}}") String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warning("OpenAI API key not found! WebClient will be created without authorization.");
            return WebClient.builder()
                    .baseUrl("https://api.openai.com")
                    .build();
        }

        try {
            WebClient client = WebClient.builder()
                    .baseUrl("https://api.openai.com")
                    .defaultHeader("Authorization", "Bearer " + apiKey)
                    .defaultHeader("Content-Type", "application/json")
                    .build();
                    
            logger.info("OpenAI WebClient initialized successfully");
            return client;
            
        } catch (Exception e) {
            logger.severe("Failed to initialize OpenAI WebClient: " + e.getMessage());
            return WebClient.builder().baseUrl("https://api.openai.com").build();
        }
    }

    @Bean
    public String openAiApiKey(@Value("${openai.api-key:${OPENAI_API_KEY:}}") String apiKey) {
        return apiKey;
    }
}