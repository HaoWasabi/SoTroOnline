package com.so_tro_online.quan_ly_tai_khoan.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;

import java.time.LocalDate;
import java.util.Date;

public class SignUpRequest {
    private String email;
    private String cccdCode;
    private String password;
    private String hoTen;
    private String dienThoai;
    private String thuongTru;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date ngaySinh;
    
    private TrangThai trangThai;

    // Default constructor for JSON deserialization
    public SignUpRequest() {}

    public SignUpRequest(String email, String cccdCode, String password, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, TrangThai trangThai, LocalDate ngayTao) {
        this.email = email;
        this.cccdCode = cccdCode;
        this.password = password;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.trangThai = trangThai;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getDienThoai() {
        return dienThoai;
    }

    public void setDienThoai(String dienThoai) {
        this.dienThoai = dienThoai;
    }

    public String getThuongTru() {
        return thuongTru;
    }

    public void setThuongTru(String thuongTru) {
        this.thuongTru = thuongTru;
    }

    public Date getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(Date ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCccdCode() {
        return cccdCode;
    }

    public void setCccdCode(String cccdCode) {
        this.cccdCode = cccdCode;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isValid() {
        return email != null && !email.trim().isEmpty() &&
               password != null && !password.trim().isEmpty() &&
               hoTen != null && !hoTen.trim().isEmpty() &&
               dienThoai != null && !dienThoai.trim().isEmpty() &&
               ngaySinh != null &&
               trangThai != null;
    }

    public String getValidationErrors() {
        StringBuilder errors = new StringBuilder();
        
        if (email == null || email.trim().isEmpty()) {
            errors.append("email is required; ");
        }
        if (password == null || password.trim().isEmpty()) {
            errors.append("password is required; ");
        }
        if (hoTen == null || hoTen.trim().isEmpty()) {
            errors.append("hoTen is required; ");
        }
        if (dienThoai == null || dienThoai.trim().isEmpty()) {
            errors.append("dienThoai is required; ");
        }
        if (ngaySinh == null) {
            errors.append("ngaySinh is required; ");
        }
        if (trangThai == null) {
            errors.append("trangThai is required; ");
        }
        
        return errors.toString();
    }

}
