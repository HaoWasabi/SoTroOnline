package com.so_tro_online.quan_ly_khach_thue.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Date;

@Entity
@Table(name = "KhachThue")
public class KhachThue {

    @Id
    @Column(name = "maKhach", updatable = false)
    private int maKhach;

    @Column(name = "maKhachDaiDien")
    private String maKhachDaiDien;

    @Column(name = "maCanCuoc")
    private String maCanCuoc;

    @Column(name = "hoTen")
    private String hoTen;

    @Column(name = "dienThoai")
    private String dienThoai;

    @Column(name = "thuongTru")
    private String thuongTru;

    @Column(name = "ngaySinh")
    private Date ngaySinh;

    @Column(name = "ngayTao")
    private Instant ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai")
    private TrangThai trangThai;


    public KhachThue() {

    }

    public KhachThue(int maKhach, String maKhachDaiDien, String maCanCuoc, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, Instant ngayTao) {
        this.maKhach = maKhach;
        this.maKhachDaiDien = maKhachDaiDien;
        this.maCanCuoc = maCanCuoc;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.ngayTao = ngayTao;
    }

    public int getMaKhach() {
        return maKhach;
    }

    public void setMaKhach(int maKhach) {
        this.maKhach = maKhach;
    }

    public String getMaKhachDaiDien() {
        return maKhachDaiDien;
    }

    public void setMaKhachDaiDien(String maKhachDaiDien) {
        this.maKhachDaiDien = maKhachDaiDien;
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

    public String getThuongTru() {
        return thuongTru;
    }

    public void setThuongTru(String thuongTru) {
        this.thuongTru = thuongTru;
    }

    public Date getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(Date ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public Instant getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(Instant ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public String getDienThoai() {
        return dienThoai;
    }

    public void setDienThoai(String dienThoai) {
        this.dienThoai = dienThoai;
    }
}
