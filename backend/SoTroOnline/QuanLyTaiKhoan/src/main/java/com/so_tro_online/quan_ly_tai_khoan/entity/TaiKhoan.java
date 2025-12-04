package com.so_tro_online.quan_ly_tai_khoan.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {

    @Column(name = "ma_tai_khoan", updatable = false)
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int maTaiKhoan;

    @Column(name = "ma_can_cuoc")
    private String maCanCuoc;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "ho_ten")
    private String hoTen;

    @Column(name = "dien_thoai")
    private String dienThoai;

    @Column(name = "thuong_tru")
    private String thuongTru;

    @Column(name = "ngay_sinh")
    private Date ngaySinh;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThai trangThai;

    public TaiKhoan() {}

    public TaiKhoan(int maTaiKhoan, String maCanCuoc, String email, String hoTen, String dienThoai, String thuongTru, Date ngaySinh, String matKhau, LocalDateTime ngayTao, TrangThai trangThai) {
        this.maTaiKhoan = maTaiKhoan;
        this.maCanCuoc = maCanCuoc;
        this.email = email;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.matKhau = matKhau;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }

    public int getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(int maTaiKhoan) {
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

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

}


