package com.so_tro_online.chatbot.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ChatbotStreamingTestApp {

    public static void main(String[] args) {
        System.out.println("🚀 Starting ChatBot Streaming Test Application...");
        System.out.println("📡 Test endpoints available:");
        System.out.println("   - GET /api/chatbot/test-stream?message=hello");
        System.out.println("   - GET /api/chatbot/test-rate-limit");
        System.out.println("   - GET /api/chatbot/chat?message=hello (requires API key)");
        System.out.println("🔑 Set OPENAI_API_KEY environment variable for real API calls");
        
        SpringApplication.run(ChatbotStreamingTestApp.class, args);
    }

    @GetMapping("/health")
    public String health() {
        return "✅ ChatBot Streaming Test Service is healthy and ready!";
    }
}