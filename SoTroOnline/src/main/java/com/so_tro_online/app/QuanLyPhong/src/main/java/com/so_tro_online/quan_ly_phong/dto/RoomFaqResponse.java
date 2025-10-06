package com.so_tro_online.quan_ly_phong.dto;

import java.math.BigDecimal;

public class RoomFaqResponse {
    private String tenPhong;
    private String loaiPhong;
    private String diaChi;

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

    private BigDecimal chieuDai;
    private BigDecimal chieuRong;
    private String vatDung;
    private BigDecimal giaThueCoBan;
}
