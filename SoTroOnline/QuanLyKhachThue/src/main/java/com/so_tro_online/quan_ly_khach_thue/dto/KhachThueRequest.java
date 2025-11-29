package com.so_tro_online.quan_ly_khach_thue.dto;

public class KhachThueRequest {
    private String maCanCuoc;
    private String hoTen;
    private String thuongTru;
    private String ngaySinh;
    private String dienThoai;
    private Integer maNguoiQuanLy; // Add manager ID field for SAAS support
    private String email;

    public KhachThueRequest() {}

    public KhachThueRequest(String maCanCuoc, String hoTen,
                           String thuongTru, String ngaySinh, String dienThoai) {
        this.maCanCuoc = maCanCuoc;
        this.hoTen = hoTen;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.dienThoai = dienThoai;
    }

    public String getMaCanCuoc() {
        return maCanCuoc;
    }

    public void setMaCanCuoc(String maCanCuoc) {
        this.maCanCuoc = maCanCuoc;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getThuongTru() {
        return thuongTru;
    }

    public void setThuongTru(String thuongTru) {
        this.thuongTru = thuongTru;
    }

    public String getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(String ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getDienThoai() {
        return dienThoai;
    }

    public void setDienThoai(String dienThoai) {
        this.dienThoai = dienThoai;
    }

    public Integer getMaNguoiQuanLy() {
        return maNguoiQuanLy;
    }

    public void setMaNguoiQuanLy(Integer maNguoiQuanLy) {
        this.maNguoiQuanLy = maNguoiQuanLy;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
