package com.so_tro_online.quan_ly_phieu_thu.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

public class PhieuThuRequest {
    private Integer maHoaDon;
    private Integer maKhachHang;
    private BigDecimal soTienThu;
    private String ghiChu;
    private TrangThai trangThai;

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public Integer getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(Integer maKhachHang) {
        this.maKhachHang = maKhachHang;
    }


    public BigDecimal getSoTienThu() {
        return soTienThu;
    }
    public void setSoTienThu(BigDecimal soTienThu) {
        this.soTienThu = soTienThu;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }



    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
