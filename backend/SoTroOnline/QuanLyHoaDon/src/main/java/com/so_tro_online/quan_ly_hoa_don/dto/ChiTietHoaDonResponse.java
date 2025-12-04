package com.so_tro_online.quan_ly_hoa_don.dto;


import java.math.BigDecimal;

public class ChiTietHoaDonResponse {
    private Integer id;
    private Integer maHoaDon;
    private String tenDichVu;
    private BigDecimal donGia;
    private Integer soLuong;
    private BigDecimal thanhTien;
    private BigDecimal heSo;
    private BigDecimal tienThucTe;
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }


    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public Integer getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }

    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public void setThanhTien(BigDecimal thanhTien) {
        this.thanhTien = thanhTien;
    }

    public BigDecimal getHeSo() {
        return heSo;
    }

    public void setHeSo(BigDecimal heSo) {
        this.heSo = heSo;
    }

    public BigDecimal getTienThucTe() {
        return tienThucTe;
    }

    public void setTienThucTe(BigDecimal tienThucTe) {
        this.tienThucTe = tienThucTe;
    }
}