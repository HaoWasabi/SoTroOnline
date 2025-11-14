package com.so_tro_online.quan_ly_khach_thue.exception;

public class KhachThueNotFoundException extends RuntimeException {
    public KhachThueNotFoundException(String message) {
        super(message);
    }

    public KhachThueNotFoundException(int maKhach) {
        super("Tenant with id: " + maKhach + " is not found.");
    }
}