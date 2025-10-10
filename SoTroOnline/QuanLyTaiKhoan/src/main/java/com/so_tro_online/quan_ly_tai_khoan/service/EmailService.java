package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.quan_ly_tai_khoan.exception.EmailSendFailedException;
import org.springframework.mail.MailException;
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

}
