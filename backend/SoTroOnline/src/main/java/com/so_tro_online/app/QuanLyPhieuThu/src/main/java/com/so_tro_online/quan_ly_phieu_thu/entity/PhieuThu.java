package com.so_tro_online.quan_ly_phieu_thu.entity;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class PhieuThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maPhieuThu;
    @ManyToOne
    @JoinColumn(name = "maHoaDon")
    private HoaDon hoaDon;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    private BigDecimal soTienNo;
    private BigDecimal soTienDaTra;
    private String ghiChu;
    private Date hanThanhToan;
    private Date capNhatLanCuoi;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public Integer getMaPhieuThu() {
        return maPhieuThu;
    }

    public void setMaPhieuThu(Integer maPhieuThu) {
        this.maPhieuThu = maPhieuThu;
    }

    public HoaDon getHoaDon() {
        return hoaDon;
    }

    public void setHoaDon(HoaDon hoaDon) {
        this.hoaDon = hoaDon;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public BigDecimal getSoTienNo() {
        return soTienNo;
    }

    public void setSoTienNo(BigDecimal soTienNo) {
        this.soTienNo = soTienNo;
    }

    public BigDecimal getSoTienDaTra() {
        return soTienDaTra;
    }

    public void setSoTienDaTra(BigDecimal soTienDaTra) {
        this.soTienDaTra = soTienDaTra;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Date getHanThanhToan() {
        return hanThanhToan;
    }

    public void setHanThanhToan(Date hanThanhToan) {
        this.hanThanhToan = hanThanhToan;
    }

    public Date getCapNhatLanCuoi() {
        return capNhatLanCuoi;
    }

    public void setCapNhatLanCuoi(Date capNhatLanCuoi) {
        this.capNhatLanCuoi = capNhatLanCuoi;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
