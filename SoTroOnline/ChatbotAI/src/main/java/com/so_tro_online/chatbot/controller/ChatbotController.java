package com.so_tro_online.chatbot.controller;

import com.so_tro_online.chatbot.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ChatbotController {

    private static final Logger logger = Logger.getLogger(ChatbotController.class.getName());
    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    /**
     * Streaming chat endpoint - returns Server-Sent Events
     *
     */
    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestParam(value = "message") String message) {
        logger.info("Controller: Received chat request: " + message);
        Flux<String> response = chatbotService.getChatResponseStream(message);
        logger.info("Controller: Returning Flux from service");
        return response.doOnNext(item -> logger.info("Controller: Flux emitting: " + item.replace("\\n", "[LF]")))
                      .doOnComplete(() -> logger.info("Controller: Flux completed"))
                      .doOnError(error -> logger.warning("Controller: Flux error: " + error.getMessage()));
    }

    /**
     * Non-streaming fallback endpoint
     */
    @PostMapping(value = "/chat-fallback")
    public Map<String, Object> chatFallback(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return Map.of(
                "success", false,
                "error", "Message is required"
            );
        }

        try {
            String response = chatbotService.getChatResponse(message);
            return Map.of(
                "success", true,
                "data", Map.of("response", response),
                "timestamp", System.currentTimeMillis()
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "error", "Failed to get response from chatbot",
                "message", e.getMessage()
            );
        }
    }

    /**
     * Legacy streaming endpoint for compatibility
     */
    @GetMapping(value = "/ai/chat/string", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateString(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        return chatbotService.getChatResponseStream(message);
    }

    /**
     * Test endpoint that simulates ChatBot response without calling OpenAI API
     * Useful for testing streaming functionality and avoiding rate limits
     */
    @GetMapping(value = "/test-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> testStream(@RequestParam(value = "message", defaultValue = "Hello") String message) {
        String testResponse = "Hello! This is a test response from the ChatBot service. Your message was: " + message + ". The streaming functionality is working correctly!";
        String[] words = testResponse.split(" ");
        
        return Flux.fromArray(words)
                .map(word -> "data: {\"response\": \"" + escapeJson(word + " ") + "\"}\\n\\n")
                .concatWith(Flux.just("data: [DONE]\\n\\n"))
                .delayElements(Duration.ofMillis(100)); // Slower for testing
    }

    /**
     * Test endpoint for rate limit simulation
     */
    @GetMapping(value = "/test-rate-limit", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> testRateLimit() {
        return Flux.just(
            "data: {\"response\": \"⚠️ API rate limit reached. Please wait a moment and try again.\"}\\n\\n",
            "data: [DONE]\\n\\n"
        ).delayElements(Duration.ofMillis(100));
    }

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
