package com.so_tro_online.quan_ly_tai_khoan.dto;

import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;

import java.io.Serial;
import java.io.Serializable;


public class TaiKhoanDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private int maTaiKhoan;

    private String maCanCuoc;

    private String email;

    private String hoTen;

    private String dienThoai;

    private String thuongTru;

    private String ngaySinh;

    private String ngayTao;

    private TrangThai trangThai;

    public TaiKhoanDTO () {}

    public TaiKhoanDTO(int maTaiKhoan, String maCanCuoc, String email, String hoTen, String dienThoai, String thuongTru, String ngaySinh, String ngayTao, TrangThai trangThai) {
        this.maTaiKhoan = maTaiKhoan;
        this.maCanCuoc = maCanCuoc;
        this.email = email;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
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

    public String getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(String ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(String ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
