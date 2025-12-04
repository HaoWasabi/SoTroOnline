package com.so_tro_online.quan_ly_hop_dong_phong.notification;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentConfirmationEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final KafkaTemplate<String,Object> kafkaTemplate;

    @Autowired
    public NotificationService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    public void sentRentConfirm(RentRoomMessage rentRoomMessage) {
        try {
            // Extract tenant email information for logging
            java.util.List<String> tenantEmails = new java.util.ArrayList<>();
            java.util.List<String> tenantNames = new java.util.ArrayList<>();
            
            if (rentRoomMessage.getKhachThue() != null) {
                for (var tenant : rentRoomMessage.getKhachThue()) {
                    tenantNames.add(tenant.getHoTen());
                    if (tenant.getEmail() != null && !tenant.getEmail().trim().isEmpty()) {
                        tenantEmails.add(tenant.getEmail().trim());
                    }
                }
            }
            
            // Send general rent confirmation message to 'rent' topic
            Message<RentRoomMessage> message = MessageBuilder
                    .withPayload(rentRoomMessage)
                    .setHeader(KafkaHeaders.TOPIC, "rent")
                    .setHeader("__TypeId__", "rent")
                    .setHeader("contract-id", rentRoomMessage.getMaHopDongPhong().toString())
                    .setHeader("tenant-emails", String.join(",", tenantEmails))
                    .setHeader("room-name", rentRoomMessage.getPhong().getTenPhong())
                    .build();
            
            kafkaTemplate.send(message);
            
            // Send dedicated email notification message to 'email-notifications' topic if we have tenant emails
            if (!tenantEmails.isEmpty()) {
                sendEmailNotification(rentRoomMessage, tenantEmails, tenantNames);
            }
            
            log.info("Successfully sent rent confirmation message for contract: {} to Kafka topic 'rent'", 
                    rentRoomMessage.getMaHopDongPhong());
            log.info("Message contains {} tenant emails: {}", tenantEmails.size(), tenantEmails);
            log.info("Room: {}, Rental amount: {}, Deposit: {}", 
                    rentRoomMessage.getPhong().getTenPhong(), 
                    rentRoomMessage.getTienPhong(), 
                    rentRoomMessage.getTienCoc());
            
        } catch (Exception e) {
            log.error("Failed to send rent confirmation message for contract: {}. Error: {}", 
                    rentRoomMessage.getMaHopDongPhong(), e.getMessage());
            log.warn("Kafka messaging failed, but contract creation succeeded. Please check Kafka connection.");
            // Don't throw exception to avoid blocking contract creation
        }
    }
    
    /**
     * Send dedicated email notification message to email service
     */
    private void sendEmailNotification(RentRoomMessage rentRoomMessage, 
                                     java.util.List<String> tenantEmails, 
                                     java.util.List<String> tenantNames) {
        try {
            // Create email notification DTO
            RentConfirmationEmail emailNotification = new RentConfirmationEmail(
                rentRoomMessage.getMaHopDongPhong(),
                rentRoomMessage.getPhong().getTenPhong(),
                rentRoomMessage.getTaiKhoan().getHoTen(),
                rentRoomMessage.getTaiKhoan().getEmail(), // Manager email
                tenantEmails,
                tenantNames,
                rentRoomMessage.getTienPhong(),
                rentRoomMessage.getTienCoc(),
                rentRoomMessage.getNgayBatDau(),
                rentRoomMessage.getNgayKetThuc()
            );
            
            Message<RentConfirmationEmail> emailMessage = MessageBuilder
                    .withPayload(emailNotification)
                    .setHeader(KafkaHeaders.TOPIC, "email-notifications")
                    .setHeader("__TypeId__", "email")
                    .setHeader("email-type", "rent-confirmation")
                    .setHeader("contract-id", rentRoomMessage.getMaHopDongPhong().toString())
                    .setHeader("recipient-count", tenantEmails.size())
                    .build();
            
            kafkaTemplate.send(emailMessage);
            
            log.info("Successfully sent email notification message for contract: {} to topic 'email-notifications'", 
                    rentRoomMessage.getMaHopDongPhong());
            log.info("Email will be sent to: {}", tenantEmails);
            
        } catch (Exception e) {
            log.error("Failed to send email notification for contract: {}. Error: {}", 
                    rentRoomMessage.getMaHopDongPhong(), e.getMessage());
        }
    }
}
