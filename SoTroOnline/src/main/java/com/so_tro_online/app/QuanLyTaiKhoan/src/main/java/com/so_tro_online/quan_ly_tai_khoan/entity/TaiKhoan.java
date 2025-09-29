package com.so_tro_online.quan_ly_tai_khoan.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Date;


@Entity
@Table(name = "TaiKhoan")
public class TaiKhoan {

    @Column(name = "maTaiKhoan", updatable = false)
    @Id
    private Integer maTaiKhoan;

    @Column(name = "maCanCuoc", nullable = false, unique = true)
    private String maCanCuoc;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "hoTen", nullable = false)
    private String hoTen;

    @Column(name = "dienThoai", nullable = false)
    private String dienThoai;

    @Column(name = "thuongTru", nullable = false)
    private String thuongTru;

    @Column(name = "ngaySinh", nullable = false)
    private Date ngaySinh;

    @Column(name = "matKhau", nullable = false)
    private String matKhau;

    @Column(name = "ngayTao")
    private Instant ngayTao;

    @Column(name = "trangThai")
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public TaiKhoan() {}

    public TaiKhoan(Integer maTaiKhoan, String maCanCuoc, String email, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, String matKhau, TrangThai trangThai) {
        this.maTaiKhoan = maTaiKhoan;
        this.maCanCuoc = maCanCuoc;
        this.email = email;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.matKhau = matKhau;
        this.trangThai = trangThai;
    }

    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getMaCanCuoc() {
        return maCanCuoc;
    }

    public void setMaCanCuoc(String maCanCuoc) {
        this.maCanCuoc = maCanCuoc;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
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

}


