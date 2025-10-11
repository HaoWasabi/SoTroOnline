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
    private BigDecimal soTienThu;
    private BigDecimal conNo;
    private String noiDungThu;
    private String ghiChu;

    public BigDecimal getConNo() {
        return conNo;
    }

    public void setConNo(BigDecimal conNo) {
        this.conNo = conNo;
    }

    public String getNoiDungThu() {
        return noiDungThu;
    }

    public void setNoiDungThu(String noiDungThu) {
        this.noiDungThu = noiDungThu;
    }

    private Date ngayThu;
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

    public Date getNgayThu() {
        return ngayThu;
    }

    public void setNgayThu(Date ngayThu) {
        this.ngayThu = ngayThu;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public BigDecimal getSoTienThu() {
        return soTienThu;
    }
    public void setSoTienThu(BigDecimal soTienThu) {
        this.soTienThu = soTienThu;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
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
