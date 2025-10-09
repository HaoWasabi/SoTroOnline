package com.so_tro_online.quan_ly_phieu_thu.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

public class PhieuThuResponse {

    private Integer maPhieuThu;

    private Integer maHoaDon;
    private Integer maKhachThue;
    private BigDecimal soTienThu;
    private String ghiChu;
    private Date capNhatLanCuoi;
    private TrangThai trangThai;
    private Date ngayThu;

    public Date getNgayThu() {
        return ngayThu;
    }

    public void setNgayThu(Date ngayThu) {
        this.ngayThu = ngayThu;
    }

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

    public Date getCapNhatLanCuoi() {
        return capNhatLanCuoi;
    }

    public void setCapNhatLanCuoi(Date capNhatLanCuoi) {
        this.capNhatLanCuoi = capNhatLanCuoi;
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
