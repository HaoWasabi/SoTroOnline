package com.so_tro_online.quan_ly_hop_dong_khach_thue.entity;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hop_dong_khach_thue")
public class HopDongKhachThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hop_dong_khach_thue")
    private Integer maHopDongKhachThue;

    @Column(name = "ma_hop_dong_phong", nullable = false)
    private Integer maHopDongPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khach", nullable = false)
    private KhachThue khachThue;

    @Column(name = "ngay_vao_o")
    private LocalDate ngayVaoO;

    @Column(name = "ngay_ra_o")
    private LocalDate ngayRaO;

    @Column(name = "la_khach_dai_dien", nullable = false)
    private Boolean laKhachDaiDien = false;

    @Column(name = "trang_thai", nullable = false)
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai = TrangThai.hoatDong;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat = LocalDateTime.now();

    // Constructors
    public HopDongKhachThue() {}

    public HopDongKhachThue(Integer maHopDongPhong, KhachThue khachThue, Boolean laKhachDaiDien) {
        this.maHopDongPhong = maHopDongPhong;
        this.khachThue = khachThue;
        this.laKhachDaiDien = laKhachDaiDien;
        this.ngayVaoO = LocalDate.now();
        this.trangThai = TrangThai.hoatDong;
        this.ngayTao = LocalDateTime.now();
        this.ngayCapNhat = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getMaHopDongKhachThue() {
        return maHopDongKhachThue;
    }

    public void setMaHopDongKhachThue(Integer maHopDongKhachThue) {
        this.maHopDongKhachThue = maHopDongKhachThue;
    }

    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public void setMaHopDongPhong(Integer maHopDongPhong) {
        this.maHopDongPhong = maHopDongPhong;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public LocalDate getNgayVaoO() {
        return ngayVaoO;
    }

    public void setNgayVaoO(LocalDate ngayVaoO) {
        this.ngayVaoO = ngayVaoO;
    }

    public LocalDate getNgayRaO() {
        return ngayRaO;
    }

    public void setNgayRaO(LocalDate ngayRaO) {
        this.ngayRaO = ngayRaO;
    }

    public Boolean getLaKhachDaiDien() {
        return laKhachDaiDien;
    }

    public void setLaKhachDaiDien(Boolean laKhachDaiDien) {
        this.laKhachDaiDien = laKhachDaiDien;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public LocalDateTime getNgayCapNhat() {
        return ngayCapNhat;
    }

    public void setNgayCapNhat(LocalDateTime ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }

    public enum TrangThai {
        hoatDong, daRa, tamNghi
    }
}
