package com.so_tro_online.quan_ly_dich_vu_phong.entity;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class DichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDichVu;
    @ManyToOne
    @JoinColumn(name = "maQuanLy")
    private TaiKhoan taiKhoan;
    private String tenDichVu;
    private BigDecimal donGiaCoBan;
    private String donViCoBan;
    private String moTa;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
    @Enumerated(EnumType.STRING)
    private LoaiTinh loaiTinh;

    public LoaiTinh getLoaiTinh() {
        return loaiTinh;
    }

    public void setLoaiTinh(LoaiTinh loaiTinh) {
        this.loaiTinh = loaiTinh;
    }

    public DichVu(Integer maDichVu, TaiKhoan taiKhoan, String tenDichVu, BigDecimal donGiaCoBan, String donViCoBan, String moTa, TrangThai trangThai) {
        this.maDichVu = maDichVu;
        this.taiKhoan = taiKhoan;
        this.tenDichVu = tenDichVu;
        this.donGiaCoBan = donGiaCoBan;
        this.donViCoBan = donViCoBan;
        this.moTa = moTa;
        this.trangThai = trangThai;
    }

    public DichVu() {
    }

    public Integer getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(Integer maDichVu) {
        this.maDichVu = maDichVu;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public BigDecimal getDonGiaCoBan() {
        return donGiaCoBan;
    }

    public void setDonGiaCoBan(BigDecimal donGiaCoBan) {
        this.donGiaCoBan = donGiaCoBan;
    }

    public String getDonViCoBan() {
        return donViCoBan;
    }

    public void setDonViCoBan(String donViCoBan) {
        this.donViCoBan = donViCoBan;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    @Override
    public String toString() {
        return "DichVu{" +
                "maDichVu=" + maDichVu +
                ", taiKhoan=" + taiKhoan +
                ", tenDichVu='" + tenDichVu + '\'' +
                ", donGiaCoBan=" + donGiaCoBan +
                ", donViCoBan='" + donViCoBan + '\'' +
                ", moTa='" + moTa + '\'' +
                ", trangThai=" + trangThai +
                '}';
    }
}
