package com.so_tro_online.chatbot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.logging.Logger;

@Configuration
public class EnvironmentConfig {

    private static final Logger logger = Logger.getLogger(EnvironmentConfig.class.getName());

    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            ClassPathResource resource = new ClassPathResource(".env");
            if (resource.exists()) {
                loadEnvFile(resource.getInputStream());
                logger.info("Successfully loaded .env file for Spring AI configuration");
            } else {
                logger.warning(".env file not found in ChatbotAI module resources");
            }
        } catch (IOException e) {
            logger.warning("Error loading .env file: " + e.getMessage());
        }
    }

    private void loadEnvFile(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                // Skip empty lines and comments
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                
                // Parse key=value pairs
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    String value = parts[1].trim();
                    
                    // Only set if not already set (don't override existing env vars)
                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, value);
                        logger.info("Loaded environment variable for Spring AI: " + key);
                    }
                }
            }
        }
    }
}