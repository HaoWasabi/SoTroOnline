package com.so_tro_online.quan_ly_tai_khoan.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendTemporaryPassword(String to, String temporaryPassword) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Your temporary password");
        msg.setText("This is your temporary password:\n\n"
                + temporaryPassword + "\n\n"
                + "Use this to log in and then change your password in settings.");
        javaMailSender.send(msg);
    }

    public void sendPasswordResetLink(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Password Reset Request");
        msg.setText("Dear User,\n\n"
                + "You have requested to reset your password. Please click the link below to reset your password:\n\n"
                + resetLink + "\n\n"
                + "This link will expire in 1 hour.\n\n"
                + "If you did not request this password reset, please ignore this email.\n\n"
                + "Best regards,\n"
                + "SoTroOnline Team");
        javaMailSender.send(msg);
    }

}
