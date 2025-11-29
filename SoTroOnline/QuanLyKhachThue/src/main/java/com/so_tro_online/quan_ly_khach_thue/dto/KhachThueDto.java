package com.so_tro_online.quan_ly_khach_thue.dto;

import com.so_tro_online.quan_ly_khach_thue.entity.TrangThai;

import java.io.Serial;
import java.io.Serializable;

public class KhachThueDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private int maKhach;
    private String maCanCuoc;
    private String hoTen;
    private String dienThoai;
    private String thuongTru;
    private String ngaySinh;
    private String ngayTao;
    private TrangThai trangThai;
    private Integer maNguoiQuanLy; // Add manager ID field for SAAS support
    private String email;

    public KhachThueDto() {}

    public KhachThueDto(int maKhach, String maCanCuoc, String hoTen, String dienThoai,
                       String thuongTru, String ngaySinh, String ngayTao, TrangThai trangThai, Integer maNguoiQuanLy, String email) {
        this.maKhach = maKhach;
        this.maCanCuoc = maCanCuoc;
        this.hoTen = hoTen;
        this.dienThoai = dienThoai;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
        this.maNguoiQuanLy = maNguoiQuanLy;
        this.email = email;
    }

    // Backward compatibility constructor without manager ID and email
    public KhachThueDto(int maKhach, String maCanCuoc, String hoTen, String dienThoai,
                       String thuongTru, String ngaySinh, String ngayTao, TrangThai trangThai) {
        this(maKhach, maCanCuoc, hoTen, dienThoai, thuongTru, ngaySinh, ngayTao, trangThai, null, null);
    }

    // Getters and Setters
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

    public String getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(String ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public String getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(String ngayTao) {
        this.ngayTao = ngayTao;
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
