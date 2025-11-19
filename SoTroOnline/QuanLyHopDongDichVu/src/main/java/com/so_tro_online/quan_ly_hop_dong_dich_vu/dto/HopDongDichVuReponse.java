package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;

import java.math.BigDecimal;
import java.util.Date;
public class HopDongDichVuReponse {
    private Integer maHopDongDichVu;
    private String tenQuanLy;       // lấy từ TaiKhoan
    private Integer maQuanLy;
    private String tenKhachDaiDien; // lấy từ KhachThue
    private Integer maKhachDaiDien;
    private String tenDichVu;       // lấy từ DichVu
    private Integer maDichVu;
    private BigDecimal donGia;
    private String donVi;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    private TrangThai trangThai;

    public HopDongDichVuReponse(Integer maHopDongDichVu, String tenQuanLy, Integer maQuanLy, String tenKhachDaiDien, Integer maKhachDaiDien, String tenDichVu, Integer maDichVu, BigDecimal donGia, String donVi, Date ngayBatDau, Date ngayKetThuc, Date ngayTao, TrangThai trangThai) {
        this.maHopDongDichVu = maHopDongDichVu;
        this.tenQuanLy = tenQuanLy;
        this.maQuanLy = maQuanLy;
        this.tenKhachDaiDien = tenKhachDaiDien;
        this.maKhachDaiDien = maKhachDaiDien;
        this.tenDichVu = tenDichVu;
        this.maDichVu = maDichVu;
        this.donGia = donGia;
        this.donVi = donVi;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }
    public HopDongDichVuReponse(){}

    public Integer getMaHopDongDichVu() {
        return maHopDongDichVu;
    }

    public void setMaHopDongDichVu(Integer maHopDongDichVu) {
        this.maHopDongDichVu = maHopDongDichVu;
    }

    public String getTenQuanLy() {
        return tenQuanLy;
    }

    public void setTenQuanLy(String tenQuanLy) {
        this.tenQuanLy = tenQuanLy;
    }

    public Integer getMaQuanLy() {
        return maQuanLy;
    }

    public void setMaQuanLy(Integer maQuanLy) {
        this.maQuanLy = maQuanLy;
    }

    public String getTenKhachDaiDien() {
        return tenKhachDaiDien;
    }

    public void setTenKhachDaiDien(String tenKhachDaiDien) {
        this.tenKhachDaiDien = tenKhachDaiDien;
    }

    public Integer getMaKhachDaiDien() {
        return maKhachDaiDien;
    }

    public void setMaKhachDaiDien(Integer maKhachDaiDien) {
        this.maKhachDaiDien = maKhachDaiDien;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public Integer getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(Integer maDichVu) {
        this.maDichVu = maDichVu;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public String getDonVi() {
        return donVi;
    }

    public void setDonVi(String donVi) {
        this.donVi = donVi;
    }

    public Date getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(Date ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public Date getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(Date ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public Date getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(Date ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    @Override
    public String toString() {
        return "HopDongDichVuReponse{" +
                "maHopDongDichVu=" + maHopDongDichVu +
                ", tenQuanLy='" + tenQuanLy + '\'' +
                ", maQuanLy=" + maQuanLy +
                ", tenKhachDaiDien='" + tenKhachDaiDien + '\'' +
                ", maKhachDaiDien=" + maKhachDaiDien +
                ", tenDichVu='" + tenDichVu + '\'' +
                ", maDichVu=" + maDichVu +
                ", donGia=" + donGia +
                ", donVi='" + donVi + '\'' +
                ", ngayBatDau=" + ngayBatDau +
                ", ngayKetThuc=" + ngayKetThuc +
                ", ngayTao=" + ngayTao +
                ", trangThai=" + trangThai +
                '}';
    }
}

