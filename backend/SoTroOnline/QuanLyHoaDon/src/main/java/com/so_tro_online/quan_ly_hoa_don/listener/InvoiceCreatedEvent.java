package com.so_tro_online.quan_ly_hoa_don.listener;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;

public class InvoiceCreatedEvent {

    private HoaDon hoaDon;

    public InvoiceCreatedEvent(HoaDon hoaDon) {
        this.hoaDon = hoaDon;
    }

    public HoaDon getInvoice() {
        return hoaDon;
    }
}

