package com.so_tro_online.quan_ly_dich_vu_phong.dto;



import java.math.BigDecimal;

public class DichVuRequest {
    private BigDecimal donGiaDien;
    private BigDecimal donGiaNuoc;
    private BigDecimal donGiaRac;

    public BigDecimal getDonGiaDien() {
        return donGiaDien;
    }

    public void setDonGiaDien(BigDecimal donGiaDien) {
        this.donGiaDien = donGiaDien;
    }

    public BigDecimal getDonGiaNuoc() {
        return donGiaNuoc;
    }

    public void setDonGiaNuoc(BigDecimal donGiaNuoc) {
        this.donGiaNuoc = donGiaNuoc;
    }

    public BigDecimal getDonGiaRac() {
        return donGiaRac;
    }

    public void setDonGiaRac(BigDecimal donGiaRac) {
        this.donGiaRac = donGiaRac;
    }
}
