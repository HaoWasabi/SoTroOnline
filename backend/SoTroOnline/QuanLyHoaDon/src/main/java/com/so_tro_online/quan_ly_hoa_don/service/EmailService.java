package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_khach_thue.repository.HopDongKhachThueRepository;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Service("invoiceEmailService")
public class EmailService {

    private JavaMailSender mailSender;

    private SpringTemplateEngine templateEngine;

    private HopDongKhachThueRepository hopDongKhachThueRepository;

    private HopDongPhongRepository hopDongPhongRepository;

    public EmailService(
            JavaMailSender mailSender,
            SpringTemplateEngine templateEngine,
            HopDongKhachThueRepository hopDongKhachThueRepository,
            HopDongPhongRepository hopDongPhongRepository
    ) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.hopDongKhachThueRepository = hopDongKhachThueRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }

    public void sendInvoiceEmail(HoaDon hoaDon) {

        String name = "";

        List<KhachThue> listOfKhachThue = hopDongKhachThueRepository.getAllKhachThueByMaHopDongPhong(hoaDon.getMaHopDongPhong());

        HopDongPhong hopDong = hopDongPhongRepository.findById(hoaDon.getMaHopDongPhong()).orElse(null);

        if(hopDong != null) {
            name = hopDong.getTaiKhoan().getHoTen();
        }

        Context context = new Context();

        context.setVariable("managerName", name);
        context.setVariable("invoiceCode", hoaDon.getMaHoaDon());
        context.setVariable("roomCode", hoaDon.getHopDongPhong().getMaHopDongPhong());
        context.setVariable("roomFee", hoaDon.getTienPhong());
        context.setVariable("serviceFee", hoaDon.getTienDichVu());
        context.setVariable("totalFee", hoaDon.getTongTien());
        context.setVariable("createdDate", hoaDon.getNgayTao());

        for (KhachThue khachThue : listOfKhachThue) {
            context.setVariable("tenantName", khachThue.getHoTen());
            String body = templateEngine.process("invoice-notification-email", context);
            sendEmail(khachThue.getEmail(), body);
        }
    }

    private void sendEmail(String to, String body) {
        MimeMessage mail = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("New Invoice Created");
            helper.setText(body, true);
            mailSender.send(mail);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}

