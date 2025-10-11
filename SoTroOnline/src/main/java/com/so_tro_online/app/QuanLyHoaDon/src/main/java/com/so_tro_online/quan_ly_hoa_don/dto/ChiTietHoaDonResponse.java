package com.so_tro_online.quan_ly_hoa_don.dto;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;

public class ChiTietHoaDonResponse {
    private Integer id;

    private Integer maHoaDon;
    private String tenDichVu;

    private BigDecimal donGia;
    private BigDecimal soLuong;
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

    public BigDecimal getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(BigDecimal soLuong) {
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
