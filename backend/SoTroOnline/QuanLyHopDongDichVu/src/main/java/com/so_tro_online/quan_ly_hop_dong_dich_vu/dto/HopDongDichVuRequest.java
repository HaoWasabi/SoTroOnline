package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;

import java.math.BigDecimal;
import java.util.Date;
public class HopDongDichVuRequest {

    private Integer maQuanLy;       // ID của Tài Khoản (quản lý)
    private Integer maKhachDaiDien; // ID của Khách Thuê
    private Integer maDichVu;       // ID của Dịch Vụ
    private BigDecimal donGia;
    private String donVi;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private TrangThai trangThai;

    public HopDongDichVuRequest(Integer maQuanLy, Integer maKhachDaiDien, Integer maDichVu, BigDecimal donGia, String donVi, Date ngayBatDau, Date ngayKetThuc, TrangThai trangThai) {
        this.maQuanLy = maQuanLy;
        this.maKhachDaiDien = maKhachDaiDien;
        this.maDichVu = maDichVu;
        this.donGia = donGia;
        this.donVi = donVi;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.trangThai = trangThai;
    }
    public HopDongDichVuRequest(){}

    public Integer getMaQuanLy() {
        return maQuanLy;
    }

    public void setMaQuanLy(Integer maQuanLy) {
        this.maQuanLy = maQuanLy;
    }

    public Integer getMaKhachDaiDien() {
        return maKhachDaiDien;
    }

    public void setMaKhachDaiDien(Integer maKhachDaiDien) {
        this.maKhachDaiDien = maKhachDaiDien;
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

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    @Override
    public String toString() {
        return "HopDongDichVuRequest{" +
                "maQuanLy=" + maQuanLy +
                ", maKhachDaiDien=" + maKhachDaiDien +
                ", maDichVu=" + maDichVu +
                ", donGia=" + donGia +
                ", donVi='" + donVi + '\'' +
                ", ngayBatDau=" + ngayBatDau +
                ", ngayKetThuc=" + ngayKetThuc +
                ", trangThai=" + trangThai +
                '}';
    }
}

