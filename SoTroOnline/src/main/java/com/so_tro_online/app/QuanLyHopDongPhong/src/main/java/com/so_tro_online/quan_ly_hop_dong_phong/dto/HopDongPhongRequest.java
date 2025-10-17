package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class HopDongPhongRequest {
    private Integer maTaiKhoan;
    private Integer maKhachThue;
    private Integer maPhong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private LocalDate ngayTao;
    private TrangThai trangThai;


    public Integer getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(Integer maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public Integer getMaKhachThue() {
        return maKhachThue;
    }

    public void setMaKhachThue(Integer maKhachThue) {
        this.maKhachThue = maKhachThue;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public void setTienPhong(BigDecimal tienPhong) {
        this.tienPhong = tienPhong;
    }

    public void setTienCoc(BigDecimal tienCoc) {
        this.tienCoc = tienCoc;
    }


    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }



    public Integer getMaPhong() {
        return maPhong;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public BigDecimal getTienCoc() {
        return tienCoc;
    }

    public LocalDate getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDate ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public LocalDate getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDate ngayTao) {
        this.ngayTao = ngayTao;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }
}
