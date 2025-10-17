package com.so_tro_online.quan_ly_phieu_thu.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class PhieuThuResponse {

    private Integer maPhieuThu;

    private Integer maHoaDon;
    private Integer maKhachThue;
    private BigDecimal soTienThu;
    private String ghiChu;
    private LocalDate capNhatLanCuoi;
    private TrangThai trangThai;
    private LocalDate ngayThu;



    public Integer getMaPhieuThu() {
        return maPhieuThu;
    }

    public void setMaPhieuThu(Integer maPhieuThu) {
        this.maPhieuThu = maPhieuThu;
    }

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public Integer getMaKhachThue() {
        return maKhachThue;
    }

    public void setMaKhachThue(Integer maKhachThue) {
        this.maKhachThue = maKhachThue;
    }



    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public LocalDate getCapNhatLanCuoi() {
        return capNhatLanCuoi;
    }

    public void setCapNhatLanCuoi(LocalDate capNhatLanCuoi) {
        this.capNhatLanCuoi = capNhatLanCuoi;
    }

    public LocalDate getNgayThu() {
        return ngayThu;
    }

    public void setNgayThu(LocalDate ngayThu) {
        this.ngayThu = ngayThu;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
    public BigDecimal getSoTienThu() {
        return soTienThu;
    }
    public void setSoTienThu(BigDecimal soTienThu) {
        this.soTienThu = soTienThu;
    }
}
