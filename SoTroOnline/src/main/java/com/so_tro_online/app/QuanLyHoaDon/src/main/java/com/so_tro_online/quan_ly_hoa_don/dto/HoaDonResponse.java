package com.so_tro_online.quan_ly_hoa_don.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.ChiTietHoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class HoaDonResponse {
    private Integer maHoaDon;
    private BigDecimal tienPhong;
    private BigDecimal tienDichVu;
    private BigDecimal tongTien;
    private BigDecimal tienConNo;
    private LocalDate ngayTao;
    private LocalDate capNhatLanCuoi;
    private TrangThai trangThai;
    private String noiDung;
    private Integer maHopDongPhong;
    private Integer maPhong;
    private String tenPhong;
    private List<ChiTietHoaDonResponse> chiTietHoaDons = new ArrayList<>();

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public void setTienPhong(BigDecimal tienPhong) {
        this.tienPhong = tienPhong;
    }

    public BigDecimal getTienDichVu() {
        return tienDichVu;
    }

    public void setTienDichVu(BigDecimal tienDichVu) {
        this.tienDichVu = tienDichVu;
    }

    public BigDecimal getTongTien() {
        return tongTien;
    }

    public void setTongTien(BigDecimal tongTien) {
        this.tongTien = tongTien;
    }

    public BigDecimal getTienConNo() {
        return tienConNo;
    }

    public void setTienConNo(BigDecimal tienConNo) {
        this.tienConNo = tienConNo;
    }

    public LocalDate getNgayTao() {
        return ngayTao;
    }
    public void setNgayTao(LocalDate ngayTao) {
        this.ngayTao = ngayTao;
    }
    public LocalDate getCapNhatLanCuoi() {
        return capNhatLanCuoi;
    }
    public void setCapNhatLanCuoi(LocalDate capNhatLanCuoi) {
        this.capNhatLanCuoi = capNhatLanCuoi;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public void setMaHopDongPhong(Integer maHopDongPhong) {
        this.maHopDongPhong = maHopDongPhong;
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public void setTenPhong(String tenPhong) {
        this.tenPhong = tenPhong;
    }

    public List<ChiTietHoaDonResponse> getChiTietHoaDons() {
        return chiTietHoaDons;
    }

    public void setChiTietHoaDons(List<ChiTietHoaDonResponse> chiTietHoaDons) {
        this.chiTietHoaDons = chiTietHoaDons;
    }
}
