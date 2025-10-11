package com.so_tro_online.quan_ly_hoa_don.entity;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class ChiTietHoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private HoaDon hoaDon;
    private String tenDichVu;

    private BigDecimal donGia;

    private BigDecimal thanhTien;
    private BigDecimal heSo;
    private BigDecimal tienThucTe;
    private BigDecimal soLuong;

    public BigDecimal getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(BigDecimal soLuong) {
        this.soLuong = soLuong;
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

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public HoaDon getHoaDon() {
        return hoaDon;
    }

    public void setHoaDon(HoaDon hoaDon) {
        this.hoaDon = hoaDon;
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



    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public void setThanhTien(BigDecimal thanhTien) {
        this.thanhTien = thanhTien;
    }
}
