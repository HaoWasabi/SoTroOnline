package com.so_tro_online.quan_ly_phieu_thu.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO to hold all data needed for PhieuThu export
 * Updated to ensure proper compilation
 */
public class PhieuThuExportData {
    private Integer maPhieuThu;
    private Integer maHoaDon;
    private Integer maKhachThue;
    private String tenKhachThue;
    private String tenChuTro;
    private String diaChiPhong;
    private LocalDate ngayThu;
    private BigDecimal soTienThu;
    private BigDecimal tongTienHoaDon;
    private Integer thang;
    private Integer nam;

    // Constructors
    public PhieuThuExportData() {}

    public PhieuThuExportData(Integer maPhieuThu, Integer maHoaDon, Integer maKhachThue, 
                             String tenKhachThue, String tenChuTro, String diaChiPhong,
                             LocalDate ngayThu, BigDecimal soTienThu, BigDecimal tongTienHoaDon,
                             Integer thang, Integer nam) {
        this.maPhieuThu = maPhieuThu;
        this.maHoaDon = maHoaDon;
        this.maKhachThue = maKhachThue;
        this.tenKhachThue = tenKhachThue;
        this.tenChuTro = tenChuTro;
        this.diaChiPhong = diaChiPhong;
        this.ngayThu = ngayThu;
        this.soTienThu = soTienThu;
        this.tongTienHoaDon = tongTienHoaDon;
        this.thang = thang;
        this.nam = nam;
    }

    // Getters and Setters
    public Integer getMaPhieuThu() {
        return maPhieuThu;
    }

    public void setMaPhieuThu(Integer maPhieuThu) {
        this.maPhieuThu = maPhieuThu;
    }

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public Integer getMaKhachThue() {
        return maKhachThue;
    }

    public void setMaKhachThue(Integer maKhachThue) {
        this.maKhachThue = maKhachThue;
    }

    public String getTenKhachThue() {
        return tenKhachThue;
    }

    public void setTenKhachThue(String tenKhachThue) {
        this.tenKhachThue = tenKhachThue;
    }

    public String getTenChuTro() {
        return tenChuTro;
    }

    public void setTenChuTro(String tenChuTro) {
        this.tenChuTro = tenChuTro;
    }

    public String getDiaChiPhong() {
        return diaChiPhong;
    }

    public void setDiaChiPhong(String diaChiPhong) {
        this.diaChiPhong = diaChiPhong;
    }

    public LocalDate getNgayThu() {
        return ngayThu;
    }

    public void setNgayThu(LocalDate ngayThu) {
        this.ngayThu = ngayThu;
    }

    public BigDecimal getSoTienThu() {
        return soTienThu;
    }

    public void setSoTienThu(BigDecimal soTienThu) {
        this.soTienThu = soTienThu;
    }

    public BigDecimal getTongTienHoaDon() {
        return tongTienHoaDon;
    }

    public void setTongTienHoaDon(BigDecimal tongTienHoaDon) {
        this.tongTienHoaDon = tongTienHoaDon;
    }

    public Integer getThang() {
        return thang;
    }

    public void setThang(Integer thang) {
        this.thang = thang;
    }

    public Integer getNam() {
        return nam;
    }

    public void setNam(Integer nam) {
        this.nam = nam;
    }
}