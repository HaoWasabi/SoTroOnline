package com.so_tro_online.quan_ly_hop_dong_phong.entity;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;


import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hop_dong_phong")
public class HopDongPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hop_dong_phong")
    private Integer maHopDongPhong;

    @ManyToOne
    @JoinColumn(name = "ma_quan_ly", nullable = false)
    private TaiKhoan taiKhoan;

    @ManyToOne
    @JoinColumn(name = "ma_khach_dai_dien")
    private KhachThue khachThue;

    @ManyToOne
    @JoinColumn(name = "ma_phong")
    private Phong phong;

    @Column(name = "tien_phong")
    private BigDecimal tienPhong;

    @Column(name = "tien_coc")
    private BigDecimal tienCoc;

    @Column(name = "dv_rac")
    private Boolean dvRac;

    @Column(name = "dv_wifi")
    private Boolean dvWifi;

    @Column(name = "dv_cap")
    private Boolean dvCap;

    @Column(name = "dv_khac")
    private Boolean dvKhac;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "ngay_tao")
    private LocalDate ngayTao;

    @Column(name = "trang_thai")
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

    public Boolean getDvRac() { return dvRac;}

    public Boolean getDvWifi() { return dvWifi;}

    public Boolean getDvCap() { return dvCap;}

    public Boolean getDvKhac() { return dvKhac;}

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

    public void setDvRac(Boolean dvRac) { this.dvRac = dvRac; }

    public void setDvWifi(Boolean dvWifi) { this.dvWifi = dvWifi; }

    public void setDvCap(Boolean dvCap) { this.dvCap = dvCap; }

    public void setDvKhac(Boolean dvKhac) { this.dvKhac = dvKhac; }

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

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
