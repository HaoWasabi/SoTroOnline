package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class EmailRentRoomService {

    private static final Logger logger = LoggerFactory.getLogger(EmailRentRoomService.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailRentRoomService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendConfirmRentRoom(RentRoomMessage rentRoomMessage) throws MessagingException, jakarta.mail.MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());
        try {
            messageHelper.setFrom("theanonymoustester123@gmail.com"); // Use configured email from application.yml
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        final String templateName = "confirm-hdphong.html";
        Map<String, Object> variables = new HashMap<>();
        variables.put("maHopDongPhong", rentRoomMessage.getMaHopDongPhong());
        variables.put("taiKhoan", rentRoomMessage.getTaiKhoan().getHoTen());
        // Handle list of tenants
        List<String> tenantNames = rentRoomMessage.getKhachThue().stream()
                .map(com.so_tro_online.quan_ly_khach_thue.entity.KhachThue::getHoTen)
                .collect(Collectors.toList());
        variables.put("khachThueList", tenantNames);
        variables.put("khachThue", String.join(", ", tenantNames)); // For backward compatibility
        variables.put("phong", rentRoomMessage.getPhong().getTenPhong());
        variables.put("loaiPhong", rentRoomMessage.getPhong().getLoaiPhong());
        variables.put("diaChi", rentRoomMessage.getPhong().getDiaChi());
        variables.put("chieuDai", rentRoomMessage.getPhong().getChieuDai());
        variables.put("chieuRong", rentRoomMessage.getPhong().getChieuRong());
        variables.put("vatDung", rentRoomMessage.getPhong().getVatDung());
        variables.put("tienPhong", rentRoomMessage.getTienPhong());
        variables.put("tienCoc", rentRoomMessage.getTienCoc());
        variables.put("ngayBatDau", rentRoomMessage.getNgayBatDau());
        variables.put("ngayKetThuc", rentRoomMessage.getNgayKetThuc());
        Context context = new Context();
        context.setVariables(variables);
        messageHelper.setSubject("Xác nhận hợp đồng thuê phòng #" + rentRoomMessage.getMaHopDongPhong());

        try {
            String htmlTemplate = templateEngine.process(templateName, context);
            messageHelper.setText(htmlTemplate, true);

            // Send email to all tenants with valid email addresses
            List<String> tenantEmails = rentRoomMessage.getKhachThue().stream()
                .filter(tenant -> tenant.getEmail() != null && !tenant.getEmail().trim().isEmpty())
                .map(tenant -> tenant.getEmail().trim())
                .distinct()
                .collect(Collectors.toList());
                
            logger.info("Attempting to send email for contract {} to {} tenant(s): {}", 
                rentRoomMessage.getMaHopDongPhong(), tenantEmails.size(), tenantEmails);
                
            if (tenantEmails.isEmpty()) {
                logger.warn("No valid tenant emails found for contract {}", rentRoomMessage.getMaHopDongPhong());
                return;
            }
            
            // Send individual emails to each tenant
            for (String email : tenantEmails) {
                try {
                    MimeMessage individualMessage = mailSender.createMimeMessage();
                    MimeMessageHelper individualHelper = new MimeMessageHelper(individualMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());
                    individualHelper.setFrom("theanonymoustester123@gmail.com");
                    individualHelper.setTo(email);
                    individualHelper.setSubject("Xác nhận hợp đồng thuê phòng #" + rentRoomMessage.getMaHopDongPhong());
                    individualHelper.setText(htmlTemplate, true);
                    
                    mailSender.send(individualMessage);
                    logger.info("Email successfully sent to tenant: {} for contract: {}", email, rentRoomMessage.getMaHopDongPhong());
                } catch (Exception individualError) {
                    logger.error("Failed to send email to tenant: {} for contract: {}. Error: {}", 
                        email, rentRoomMessage.getMaHopDongPhong(), individualError.getMessage());
                }
            }
            
            logger.info("Email sending process completed for contract {} - sent to {} addresses", 
                rentRoomMessage.getMaHopDongPhong(), tenantEmails.size());
                
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            logger.error("Error in email template processing for contract {}: {}", 
                rentRoomMessage.getMaHopDongPhong(), e.getMessage(), e);
        }
    }
}
