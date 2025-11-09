package com.so_tro_online.quan_ly_dich_vu_phong.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "dich_vu")
public class DichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_dich_vu")
    private Integer maDichVu;
    
    @Column(name = "don_gia_dien")
    private BigDecimal donGiaDien;
    
    @Column(name = "don_gia_nuoc")
    private BigDecimal donGiaNuoc;
    
    @Column(name = "don_gia_rac")
    private BigDecimal donGiaRac;

    public Integer getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(Integer maDichVu) {
        this.maDichVu = maDichVu;
    }

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