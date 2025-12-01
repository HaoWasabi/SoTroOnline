package com.so_tro_online.chatbot.service;

import com.so_tro_online.chatbot.dto.ChatCompletionRequest;
import com.so_tro_online.chatbot.dto.ChatCompletionResponse;
import com.so_tro_online.chatbot.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Arrays;
import java.util.logging.Logger;

@Service
public class ChatbotService {

    private static final Logger logger = Logger.getLogger(ChatbotService.class.getName());
    private final WebClient openAiWebClient;
    private final String apiKey;

    @Autowired
    public ChatbotService(WebClient openAiWebClient, String openAiApiKey) {
        this.openAiWebClient = openAiWebClient;
        this.apiKey = openAiApiKey;
        if (openAiWebClient != null) {
            logger.info("ChatbotService initialized with OpenAI WebClient");
        } else {
            logger.warning("ChatbotService initialized with null WebClient");
        }
    }

    /**
     * Get streaming chat response as Flux using WebClient
     */
    public Flux<String> getChatResponseStream(String userMessage) {
        // Log incoming request for debugging
        logger.info("Processing chat request: " + userMessage);
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warning("OpenAI API key not configured");
            return Flux.just(
                "data: {\"response\": \"OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.\"}\\n\\n",
                "data: [DONE]\\n\\n"
            ).doOnNext(item -> logger.info("Emitting no-API-key response: " + item.replace("\\n", "[LF]")));
        }

        // Get the response and handle streaming with proper error handling
        Flux<String> resultFlux = getChatResponseMono(userMessage)
                .doOnNext(response -> logger.info("Received response from OpenAI: " + response.substring(0, Math.min(50, response.length())) + "..."))
                .doOnError(error -> logger.warning("Error from OpenAI: " + error.getMessage()))
                .flatMapMany(response -> {
                    // Split response into chunks for streaming effect
                    String[] words = response.split(" ");
                    logger.info("Creating streaming response with " + words.length + " words");
                    return Flux.fromArray(words)
                            .map(word -> "data: {\"response\": \"" + escapeJson(word + " ") + "\"}\\n\\n")
                            .doOnNext(chunk -> logger.info("Emitting chunk: " + chunk.replace("\\n", "[LF]")))
                            .concatWith(Flux.just("data: [DONE]\\n\\n")
                                .doOnNext(done -> logger.info("Emitting DONE signal: " + done.replace("\\n", "[LF]"))))
                            .delayElements(Duration.ofMillis(50));
                })
                .onErrorResume(throwable -> {
                    logger.warning("ChatBot API error occurred: " + throwable.getMessage());
                    String errorMessage = throwable.getMessage();
                    
                    Flux<String> errorFlux;
                    if (errorMessage != null && (errorMessage.contains("429") || errorMessage.contains("rate limit"))) {
                        logger.info("Rate limit detected, returning rate limit message");
                        errorFlux = Flux.just(
                            "data: {\"response\": \"API rate limit reached. Please wait a moment and try again.\"}\\n\\n",
                            "data: [DONE]\\n\\n"
                        );
                    } else if (errorMessage != null && (errorMessage.contains("401") || errorMessage.contains("authentication"))) {
                        logger.info("Authentication error detected");
                        errorFlux = Flux.just(
                            "data: {\"response\": \"API authentication failed. Please check your OpenAI API key.\"}\\n\\n",
                            "data: [DONE]\\n\\n"
                        );
                    } else {
                        logger.info("Generic error detected: " + errorMessage);
                        errorFlux = Flux.just(
                            "data: {\"response\": \"ChatBot service temporarily unavailable. Please try again in a few moments.\"}\\n\\n",
                            "data: [DONE]\\n\\n"
                        );
                    }
                    
                    // Add logging to verify flux creation
                    return errorFlux.doOnNext(item -> logger.info("Emitting error response: " + item.replace("\\n", "\\n")));
                })
                .doOnComplete(() -> logger.info("Streaming response completed"))
                .doOnTerminate(() -> logger.info("Streaming response terminated"));
        
        logger.info("Returning Flux from getChatResponseStream");
        return resultFlux;
    }

    /**
     * Get non-streaming chat response using WebClient
     */
    public String getChatResponse(String userMessage) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.";
        }

        try {
            return getChatResponseMono(userMessage)
                    .onErrorResume(throwable -> {
                        String errorMessage = throwable.getMessage();
                        if (errorMessage != null && (errorMessage.contains("429") || errorMessage.contains("rate limit"))) {
                            return Mono.just("API rate limit reached. Please wait a moment and try again.");
                        } else if (errorMessage != null && (errorMessage.contains("401") || errorMessage.contains("authentication"))) {
                            return Mono.just("API authentication failed. Please check your OpenAI API key.");
                        } else {
                            return Mono.just("⚠ChatBot service temporarily unavailable. Please try again in a few moments.");
                        }
                    })
                    .block();
        } catch (Exception e) {
            logger.severe("Error in chat completion: " + e.getMessage());
            return "ChatBot service temporarily unavailable. This could be due to API rate limits or network issues. Please try again in a few moments.";
        }
    }

    private Mono<String> getChatResponseMono(String userMessage) {
        ChatCompletionRequest request = new ChatCompletionRequest(
                "gpt-4o-mini",
                Arrays.asList(new ChatMessage("user", userMessage)),
                1000,
                0.7
        );

        return openAiWebClient.post()
                .uri("/v1/chat/completions")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                    status -> status.value() == 429,
                    response -> {
                        logger.warning("OpenAI API rate limit (429) detected");
                        return Mono.error(new RuntimeException("OpenAI API rate limit exceeded. Please try again later."));
                    }
                )
                .onStatus(
                    status -> status.value() == 401,
                    response -> {
                        logger.warning("OpenAI API authentication (401) failed");
                        return Mono.error(new RuntimeException("OpenAI API authentication failed. Please check your API key."));
                    }
                )
                .onStatus(
                    status -> status.is4xxClientError(),
                    response -> {
                        logger.warning("OpenAI API client error (4xx): " + response.statusCode().value());
                        return Mono.error(new RuntimeException("OpenAI API client error. Please check your request."));
                    }
                )
                .onStatus(
                    status -> status.is5xxServerError(),
                    response -> {
                        logger.warning("OpenAI API server error (5xx): " + response.statusCode().value());
                        return Mono.error(new RuntimeException("OpenAI API server error. Please try again later."));
                    }
                )
                .bodyToMono(ChatCompletionResponse.class)
                .map(response -> {
                    if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                        String content = response.getChoices().get(0).getMessage().getContent();
                        logger.info("Successfully received response from OpenAI");
                        return content;
                    }
                    logger.warning("Empty response from OpenAI");
                    return "I apologize, but I couldn't generate a response at this time.";
                })
                // Don't use onErrorReturn here - let errors bubble up to onErrorResume in streaming method
                .doOnError(error -> logger.warning("Error in getChatResponseMono: " + error.getMessage()));
    }

    /**
     * Utility method to escape JSON strings
     */
    private String escapeJson(String text) {
        if (text == null) return "";
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}