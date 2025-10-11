package com.so_tro_online.quan_ly_phong.dto;


import com.so_tro_online.quan_ly_phong.entity.TrangThai;



import java.math.BigDecimal;
import java.util.List;


public class RoomResponse {
    private Integer maPhong;
    private String tenQuanLy;
    private Integer maQuanLy;
    private String tenPhong;
    private String loaiPhong;
    private String diaChi;
    private BigDecimal chieuDai;
    private BigDecimal chieuRong;
    private String vatDung;
    private BigDecimal giaThueCoBan;
    private TrangThai trangThai;


    public RoomResponse(Integer maPhong, String tenQuanLy, Integer maQuanLy, String tenPhong, String loaiPhong, String diaChi, BigDecimal chieuDai, BigDecimal chieuRong, String vatDung, BigDecimal giaThueCoBan, TrangThai trangThai) {
        this.maPhong = maPhong;
        this.tenQuanLy = tenQuanLy;
        this.maQuanLy = maQuanLy;
        this.tenPhong = tenPhong;
        this.loaiPhong = loaiPhong;
        this.diaChi = diaChi;
        this.chieuDai = chieuDai;
        this.chieuRong = chieuRong;
        this.vatDung = vatDung;
        this.giaThueCoBan = giaThueCoBan;
        this.trangThai = trangThai;

    }



    public Integer getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public String getTenQuanLy() {
        return tenQuanLy;
    }

    public void setTenQuanLy(String tenQuanLy) {
        this.tenQuanLy = tenQuanLy;
    }

    public Integer getMaQuanLy() {
        return maQuanLy;
    }

    public void setMaQuanLy(Integer maQuanLy) {
        this.maQuanLy = maQuanLy;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public void setTenPhong(String tenPhong) {
        this.tenPhong = tenPhong;
    }

    public String getLoaiPhong() {
        return loaiPhong;
    }

    public void setLoaiPhong(String loaiPhong) {
        this.loaiPhong = loaiPhong;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public BigDecimal getChieuDai() {
        return chieuDai;
    }

    public void setChieuDai(BigDecimal chieuDai) {
        this.chieuDai = chieuDai;
    }

    public BigDecimal getChieuRong() {
        return chieuRong;
    }

    public void setChieuRong(BigDecimal chieuRong) {
        this.chieuRong = chieuRong;
    }

    public String getVatDung() {
        return vatDung;
    }

    public void setVatDung(String vatDung) {
        this.vatDung = vatDung;
    }

    public BigDecimal getGiaThueCoBan() {
        return giaThueCoBan;
    }

    public void setGiaThueCoBan(BigDecimal giaThueCoBan) {
        this.giaThueCoBan = giaThueCoBan;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public RoomResponse() {
    }

}
