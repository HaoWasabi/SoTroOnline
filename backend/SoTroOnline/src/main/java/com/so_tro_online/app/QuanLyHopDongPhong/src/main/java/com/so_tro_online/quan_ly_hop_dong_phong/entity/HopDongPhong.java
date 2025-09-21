package com.so_tro_online.quan_ly_hop_dong_phong.entity;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class HopDongPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHopDongPhong;
    @ManyToOne
    @JoinColumn(name="maQuanLy")
    private TaiKhoan taiKhoan;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    @ManyToOne
    @JoinColumn(name="maPhong")
    private Phong phong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public Phong getPhong() {
        return phong;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public BigDecimal getTienCoc() {
        return tienCoc;
    }

    public Date getNgayBatDau() {
        return ngayBatDau;
    }

    public Date getNgayKetThuc() {
        return ngayKetThuc;
    }

    public Date getNgayTao() {
        return ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setMaHopDongPhong(Integer maHopDongPhong) {
        this.maHopDongPhong = maHopDongPhong;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public void setPhong(Phong phong) {
        this.phong = phong;
    }

    public void setTienPhong(BigDecimal tienPhong) {
        this.tienPhong = tienPhong;
    }

    public void setTienCoc(BigDecimal tienCoc) {
        this.tienCoc = tienCoc;
    }

    public void setNgayBatDau(Date ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public void setNgayKetThuc(Date ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public void setNgayTao(Date ngayTao) {
        this.ngayTao = ngayTao;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
