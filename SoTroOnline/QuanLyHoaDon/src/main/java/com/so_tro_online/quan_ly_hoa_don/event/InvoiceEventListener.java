package com.so_tro_online.quan_ly_hoa_don.event;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.listener.InvoiceCreatedEvent;
import com.so_tro_online.quan_ly_hoa_don.service.EmailService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class InvoiceEventListener {

    private final EmailService emailService;

    public InvoiceEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @EventListener
    public void handleInvoiceCreated(InvoiceCreatedEvent event) {
        HoaDon hoaDon = event.getInvoice();
        emailService.sendInvoiceEmail(hoaDon);
    }
}

