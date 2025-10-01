package com.so_tro_online.quan_ly_hop_dong_dich_vu.entity;


import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class HopDongDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHopDongDichVu;
    @ManyToOne
    @JoinColumn(name = "maQuanLy")
    private TaiKhoan taiKhoan;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    @ManyToOne
    @JoinColumn(name = "maDichVu")
    private DichVu dichVu;
    private BigDecimal donGia;
    private String donVi;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public HopDongDichVu(Integer maHopDongDichVu, TaiKhoan taiKhoan, KhachThue khachThue, DichVu dichVu, BigDecimal donGia, String donVi, Date ngayBatDau, Date ngayKetThuc, Date ngayTao, TrangThai trangThai) {
        this.maHopDongDichVu = maHopDongDichVu;
        this.taiKhoan = taiKhoan;
        this.khachThue = khachThue;
        this.dichVu = dichVu;
        this.donGia = donGia;
        this.donVi = donVi;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }
    public HopDongDichVu(){}
    public Integer getMaHopDongDichVu() {
        return maHopDongDichVu;
    }

    public void setMaHopDongDichVu(Integer maHopDongDichVu) {
        this.maHopDongDichVu = maHopDongDichVu;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
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
        return "HopDongDichVu{" +
                "maHopDongDichVu=" + maHopDongDichVu +
                ", taiKhoan=" + taiKhoan +
                ", khachThue=" + khachThue +
                ", dichVu=" + dichVu +
                ", donGia=" + donGia +
                ", donVi='" + donVi + '\'' +
                ", ngayBatDau=" + ngayBatDau +
                ", ngayKetThuc=" + ngayKetThuc +
                ", ngayTao=" + ngayTao +
                ", trangThai=" + trangThai +
                '}';
    }
}
