package com.so_tro_online.quan_ly_tai_khoan.dto;

import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;

public class UserResponse {
    private String email;
    private TrangThai trangThai;

    public UserResponse(String email, TrangThai trangThai) {
        this.email = email;
        this.trangThai = trangThai;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
