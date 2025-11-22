package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;

import java.math.BigDecimal;
import java.time.LocalDate;

public class HopDongPhongRequest {
    private Integer maTaiKhoan;
    private Integer maKhachThue;
    private Integer maPhong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private Boolean dvRac;
    private Boolean dvWifi;
    private Boolean dvCap;
    private Boolean dvKhac;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private LocalDate ngayTao;
    private TrangThai trangThai;

    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public Integer getMaQuanLy() {
        return this.maTaiKhoan;
    }

    public void setMaQuanLy(Integer maQuanLy) {
        this.maTaiKhoan = maQuanLy; // Map maQuanLy to maTaiKhoan for backward compatibility
    }

    public Integer getMaKhachThue() {
        return maKhachThue;
    }

    public void setMaKhachThue(Integer maKhachThue) {
        this.maKhachThue = maKhachThue;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public void setTienPhong(BigDecimal tienPhong) {
        this.tienPhong = tienPhong;
    }

    public void setTienCoc(BigDecimal tienCoc) {
        this.tienCoc = tienCoc;
    }

    public void setDvRac(Boolean dvRac) { this.dvRac = dvRac; }

    public void setDvWifi(Boolean dvWifi) { this.dvWifi = dvWifi; }

    public void setDvCap(Boolean dvCap) { this.dvCap = dvCap; }

    public void setDvKhac(Boolean dvKhac) { this.dvKhac = dvKhac; }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
    
    public void setTrangThai(String trangThaiString) {
        // Handle string input from frontend (e.g., "hoatDong")
        if (trangThaiString != null) {
            this.trangThai = TrangThai.valueOf(trangThaiString);
        }
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public BigDecimal getTienCoc() {
        return tienCoc;
    }

    public Boolean getDvRac() { return dvRac; }

    public Boolean getDvWifi() { return dvWifi; }

    public Boolean getDvCap() { return dvCap; }

    public Boolean getDvKhac() { return dvKhac; }

    public LocalDate getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDate ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public LocalDate getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDate ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }
}