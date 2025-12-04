package com.so_tro_online.quan_ly_hop_dong_phong.consumer;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentConfirmationEmail;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import com.so_tro_online.quan_ly_hop_dong_phong.service.EmailRentRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for processing rental notifications and emails
 * This class consumes messages from Kafka topics and sends actual emails
 */
@Component
public class RentNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(RentNotificationConsumer.class);

    @Autowired
    private EmailRentRoomService emailRentRoomService;
    
    public RentNotificationConsumer() {
        log.info("RentNotificationConsumer instantiated - ready to listen for Kafka messages");
    }

    /**
     * Consumer for general rent confirmation messages
     */
    @KafkaListener(topics = "rent", groupId = "rent-notification-group")
    public void handleRentConfirmation(RentRoomMessage rentRoomMessage) {
        log.info("=== KAFKA CONSUMER ACTIVATED ====");
        log.info("Received rent confirmation message for contract: {}", rentRoomMessage.getMaHopDongPhong());
        try {
            log.info("Room: {}, Manager: {}", 
                    rentRoomMessage.getPhong().getTenPhong(), 
                    rentRoomMessage.getTaiKhoan().getHoTen());
            
            // Extract tenant information
            if (rentRoomMessage.getKhachThue() != null && !rentRoomMessage.getKhachThue().isEmpty()) {
                log.info("Tenants ({} total):", rentRoomMessage.getKhachThue().size());
                for (var tenant : rentRoomMessage.getKhachThue()) {
                    log.info("  - {} (ID: {}, Email: {})", 
                            tenant.getHoTen(), 
                            tenant.getMaKhach(), 
                            tenant.getEmail() != null ? tenant.getEmail() : "No email");
                }
                
                // Send actual email using the existing EmailRentRoomService
                try {
                    log.info("Attempting to send email confirmation for contract: {}", rentRoomMessage.getMaHopDongPhong());
                    emailRentRoomService.sendConfirmRentRoom(rentRoomMessage);
                    log.info("Email successfully sent for contract: {}", rentRoomMessage.getMaHopDongPhong());
                } catch (Exception emailError) {
                    log.error("Failed to send email for contract: {}. Error: {}", 
                            rentRoomMessage.getMaHopDongPhong(), emailError.getMessage(), emailError);
                }
            }
            
        } catch (Exception e) {
            log.error("Error processing rent confirmation message: {}", e.getMessage(), e);
        }
    }

    /**
     * Consumer for email notification messages
     */
    @KafkaListener(topics = "email-notifications", groupId = "email-service-group")
    public void handleEmailNotification(RentConfirmationEmail emailNotification) {
        try {
            log.info("Received email notification for contract: {}", emailNotification.getContractId());
            log.info("Subject: {}", emailNotification.getSubject());
            log.info("Recipients: {}", emailNotification.getTenantEmails());
            
            // Log the email content for debugging
            log.info("Email content preview:\\n{}", 
                    emailNotification.getMessageBody().substring(0, 
                            Math.min(emailNotification.getMessageBody().length(), 200)) + "...");
            
            // Note: This consumer receives the formatted email DTO
            // You could implement a different email service here that uses this formatted content
            // For now, we're using the existing EmailRentRoomService with the rent topic
            
        } catch (Exception e) {
            log.error("Error processing email notification: {}", e.getMessage(), e);
        }
    }
}