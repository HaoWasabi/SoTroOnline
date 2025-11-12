package com.so_tro_online.quan_ly_phong.dto;

import com.so_tro_online.quan_ly_phong.entity.Phong;

import java.math.BigDecimal;


public class PhongReportDTO {
    private Integer maPhong;
    private String tenPhong;
    private String loaiPhong;
    private String diaChi;
    private BigDecimal chieuDai;
    private BigDecimal chieuRong;
    private String vatDung;
    private BigDecimal giaThueCoBan;
    private String hoTenQuanLy;

    public PhongReportDTO(Phong phong) {
        this.maPhong = phong.getMaPhong();
        this.tenPhong = phong.getTenPhong();
        this.loaiPhong = phong.getLoaiPhong();
        this.diaChi = phong.getDiaChi();
        this.chieuDai = phong.getChieuDai();
        this.chieuRong = phong.getChieuRong();
        this.vatDung = phong.getVatDung();
        this.giaThueCoBan = phong.getGiaThueCoBan();
        this.hoTenQuanLy = phong.getTaiKhoan() != null ? phong.getTaiKhoan().getHoTen() : "";
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public void setTenPhong(String tenPhong) {
        this.tenPhong = tenPhong;
    }

    public String getLoaiPhong() {
        return loaiPhong;
    }

    public void setLoaiPhong(String loaiPhong) {
        this.loaiPhong = loaiPhong;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public BigDecimal getChieuDai() {
        return chieuDai;
    }

    public void setChieuDai(BigDecimal chieuDai) {
        this.chieuDai = chieuDai;
    }

    public BigDecimal getChieuRong() {
        return chieuRong;
    }

    public void setChieuRong(BigDecimal chieuRong) {
        this.chieuRong = chieuRong;
    }

    public String getVatDung() {
        return vatDung;
    }

    public void setVatDung(String vatDung) {
        this.vatDung = vatDung;
    }

    public BigDecimal getGiaThueCoBan() {
        return giaThueCoBan;
    }

    public void setGiaThueCoBan(BigDecimal giaThueCoBan) {
        this.giaThueCoBan = giaThueCoBan;
    }

    public String getHoTenQuanLy() {
        return hoTenQuanLy;
    }

    public void setHoTenQuanLy(String hoTenQuanLy) {
        this.hoTenQuanLy = hoTenQuanLy;
    }
}
