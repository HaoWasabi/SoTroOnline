package com.so_tro_online.quan_ly_tai_khoan.dto;

import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;

import java.util.Date;

public class SignUpRequest {
    private String email;
    private String cccdCode;
    private String password;
    private String hoTen;
    private String dienThoai;
    private String thuongTru;
    private Date ngaySinh;
    private String matKhau;
    private TrangThai trangThai;

    public SignUpRequest(String email, String cccdCode, String password, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, String matKhau, TrangThai trangThai) {
        this.email = email;
        this.cccdCode = cccdCode;
        this.password = password;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.matKhau = matKhau;
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

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
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

}
