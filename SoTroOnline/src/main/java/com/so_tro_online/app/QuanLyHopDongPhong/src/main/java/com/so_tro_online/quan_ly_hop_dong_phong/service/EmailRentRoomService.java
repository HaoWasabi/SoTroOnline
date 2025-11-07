package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
@Slf4j
@Service
public class EmailRentRoomService {

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
            messageHelper.setFrom("contact@minhhuu.com");
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        final String templateName = "confirm-hdphong.html";
        Map<String, Object> variables = new HashMap<>();
        variables.put("maHopDongPhong", rentRoomMessage.getMaHopDongPhong());
        variables.put("taiKhoan", rentRoomMessage.getTaiKhoan().getHoTen());
        variables.put("khachThue", rentRoomMessage.getKhachThue().getHoTen());
        variables.put("phong", rentRoomMessage.getPhong().getTenPhong());
        variables.put("loaiPhong", rentRoomMessage.getPhong().getLoaiPhong());
        variables.put("diaChi", rentRoomMessage.getPhong().getDiaChi());
        variables.put("chieuDai", rentRoomMessage.getPhong().getChieuDai());
        variables.put("chieuRong", rentRoomMessage.getPhong().getChieuRong());
        variables.put("vatDung", rentRoomMessage.getPhong().getVatDung());
        variables.put("tienPhong", rentRoomMessage.getTienPhong());
        variables.put("tienCoc", rentRoomMessage.getTienCoc());
        variables.put("ngayBatDau", rentRoomMessage.getNgayBatDau());
        variables.put("ngayKetThuc",    rentRoomMessage.getNgayKetThuc());
        Context context = new Context();
        context.setVariables(variables);
        messageHelper.setSubject("Xác nhận hợp đồng thuê phòng #" + rentRoomMessage.getMaHopDongPhong());

        try {
            String htmlTemplate = templateEngine.process(templateName, context);
            messageHelper.setText(htmlTemplate, true);

            messageHelper.setTo(rentRoomMessage.getTaiKhoan().getEmail());
            mailSender.send(mimeMessage);
            log.info(String.format("INFO - Email successfully sent to %s with template %s ",rentRoomMessage.getKhachThue().getHoTen(), templateName));
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            log.warn("WARNING - Cannot send Email to {} ", rentRoomMessage.getKhachThue().getHoTen(), e);
        }
    }
}
