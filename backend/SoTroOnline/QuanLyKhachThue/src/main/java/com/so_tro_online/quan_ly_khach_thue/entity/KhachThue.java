package com.so_tro_online.quan_ly_khach_thue.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Date;

@Entity
@Table(name = "khach_thue")
public class KhachThue {

    @Id
    @Column(name = "ma_khach", updatable = false)
    private int maKhach;

    @Column(name = "ma_can_cuoc")
    private String maCanCuoc;

    @Column(name = "ho_ten")
    private String hoTen;

    @Column(name = "dien_thoai")
    private String dienThoai;

    @Column(name = "thuong_tru")
    private String thuongTru;

    @Column(name = "ngay_sinh")
    private Date ngaySinh;

    @Column(name = "ngay_tao")
    private Instant ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThai trangThai;

    @Column(name = "ma_nguoi_quan_ly")
    private Integer maNguoiQuanLy;

    @Column(name = "email")
    private String email;


    public KhachThue() {

    }

    public KhachThue(int maKhach, String maCanCuoc, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, Instant ngayTao) {
        this.maKhach = maKhach;
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

    public Integer getMaNguoiQuanLy() {
        return maNguoiQuanLy;
    }

    public void setMaNguoiQuanLy(Integer maNguoiQuanLy) {
        this.maNguoiQuanLy = maNguoiQuanLy;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
