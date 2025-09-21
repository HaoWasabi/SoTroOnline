package com.so_tro_online.quan_ly_khach_thue.entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
public class KhachThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maKhach;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    private String maCanCuoc;
    private String hoTen;
    private String dienThoai;
    private String ngaySinh;
    private String thuongTru;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public Integer getMaKhach() {
        return maKhach;
    }

    public void setMaKhach(Integer maKhach) {
        this.maKhach = maKhach;
    }

    public KhachThue getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(KhachThue khachThue) {
        this.khachThue = khachThue;
    }

    public String getMaCanCuoc() {
        return maCanCuoc;
    }

    public void setMaCanCuoc(String maCanCuoc) {
        this.maCanCuoc = maCanCuoc;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getDienThoai() {
        return dienThoai;
    }

    public void setDienThoai(String dienThoai) {
        this.dienThoai = dienThoai;
    }

    public String getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(String ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getThuongTru() {
        return thuongTru;
    }

    public void setThuongTru(String thuongTru) {
        this.thuongTru = thuongTru;
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
}
