package com.so_tro_online.quan_ly_khach_thue.dto;

import java.io.Serial;
import java.io.Serializable;

public class KhachThueDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private int maKhach;
    private String maKhachDaiDien;
    private String maCanCuoc;
    private String hoTen;
    private String thuongTru;
    private String ngaySinh;
    private String ngayTao;

    public KhachThueDto() {}

    public KhachThueDto(int maKhach, String maKhachDaiDien, String maCanCuoc, String hoTen,
                       String thuongTru, String ngaySinh, String ngayTao) {
        this.maKhach = maKhach;
        this.maKhachDaiDien = maKhachDaiDien;
        this.maCanCuoc = maCanCuoc;
        this.hoTen = hoTen;
        this.thuongTru = thuongTru;
        this.ngaySinh = ngaySinh;
        this.ngayTao = ngayTao;
    }

    // Getters and Setters
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
}
