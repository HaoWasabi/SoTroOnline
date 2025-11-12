package com.so_tro_online.quan_ly_phong.service;

import com.so_tro_online.quan_ly_phong.dto.ReminderElectricityMessage;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;


@Service
public class EmailReminderRoomService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailReminderRoomService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendReminder(ReminderElectricityMessage reminderElectricityMessage) throws MessagingException, jakarta.mail.MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());
        try {
            messageHelper.setFrom("contact@minhhuu.com");
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        final String templateName = "reminder-electricity.html";
        Map<String, Object> variables = new HashMap<>();
        variables.put("month", reminderElectricityMessage.getMonth());
        variables.put("year", reminderElectricityMessage.getYear());
        variables.put("phongList", reminderElectricityMessage.getPhongList());

        Context context = new Context();
        context.setVariables(variables);
        messageHelper.setSubject("Nhắc nhở ghi điện");

        try {
            String htmlTemplate = templateEngine.process(templateName, context);
            messageHelper.setText(htmlTemplate, true);

            messageHelper.setTo("admin@gmail.com");
            mailSender.send(mimeMessage);
            System.out.println("Email sent successfully");
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }
}
