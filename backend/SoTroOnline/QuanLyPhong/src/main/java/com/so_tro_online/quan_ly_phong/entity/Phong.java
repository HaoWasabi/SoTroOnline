package com.so_tro_online.quan_ly_phong.entity;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;


import java.math.BigDecimal;


@Entity
@Table(name = "phong")
public class Phong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phong")
    private Integer maPhong;
    @ManyToOne
    @JoinColumn(name = "ma_quan_ly", referencedColumnName = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(name = "ten_phong")
    private String tenPhong;

    @Column(name = "loai_phong")
    private String loaiPhong;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "chieu_dai")
    private BigDecimal chieuDai;

    @Column(name = "chieu_rong")
    private BigDecimal chieuRong;

    @Column(name = "vat_dung")
    private String vatDung;

    @Column(name = "gia_thue_co_ban")
    private BigDecimal giaThueCoBan;

    @Column(name = "so_luong_khach_toi_da")
    private Integer soLuongKhachToiDa;

    @Column(name = "trang_thai")
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public Phong() {
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    // Convenience method for SAAS manager access
    public Integer getMaQuanLy() {
        return taiKhoan != null ? taiKhoan.getMaTaiKhoan() : null;
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

    public Integer getSoLuongKhachToiDa() {
        return soLuongKhachToiDa;
    }

    public void setSoLuongKhachToiDa(Integer soLuongKhachToiDa) {
        this.soLuongKhachToiDa = soLuongKhachToiDa;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

}
