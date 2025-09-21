package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

public class HopDongPhongResponse {
    private Integer maHopDongPhong;
    private Integer maTaiKhoan;
    private String tenTaiKhoan;
    private Integer maKhachThue;
    private String tenKhachThue;
  private Integer maPhong;
  private String tenPhong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    private TrangThai trangThai;

    public HopDongPhongResponse(Integer maHopDongPhong, Integer maTaiKhoan, String tenTaiKhoan, Integer maKhachThue, String tenKhachThue, Integer maPhong, String tenPhong, BigDecimal tienPhong, BigDecimal tienCoc, Date ngayBatDau, Date ngayKetThuc, Date ngayTao, TrangThai trangThai) {
        this.maHopDongPhong = maHopDongPhong;
        this.maTaiKhoan = maTaiKhoan;
        this.tenTaiKhoan = tenTaiKhoan;
        this.maKhachThue = maKhachThue;
        this.tenKhachThue = tenKhachThue;
        this.maPhong = maPhong;
        this.tenPhong = tenPhong;
        this.tienPhong = tienPhong;
        this.tienCoc = tienCoc;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }

    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getTenTaiKhoan() {
        return tenTaiKhoan;
    }

    public Integer getMaKhachThue() {
        return maKhachThue;
    }

    public String getTenKhachThue() {
        return tenKhachThue;
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public BigDecimal getTienCoc() {
        return tienCoc;
    }

    public Date getNgayBatDau() {
        return ngayBatDau;
    }

    public Date getNgayKetThuc() {
        return ngayKetThuc;
    }

    public Date getNgayTao() {
        return ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

}
