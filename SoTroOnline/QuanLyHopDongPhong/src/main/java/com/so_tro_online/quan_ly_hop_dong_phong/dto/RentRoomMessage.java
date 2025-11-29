package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class RentRoomMessage {
    private Integer maHopDongPhong;
    private TaiKhoan taiKhoan;
    private List<KhachThue> khachThue;
    private Phong phong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private LocalDate ngayTao;

    // Default constructor (replaces @NoArgsConstructor)
    public RentRoomMessage() {
    }

    // All-args constructor (replaces @AllArgsConstructor)
    public RentRoomMessage(Integer maHopDongPhong, TaiKhoan taiKhoan, List<KhachThue> khachThue, 
                          Phong phong, BigDecimal tienPhong, BigDecimal tienCoc, 
                          LocalDate ngayBatDau, LocalDate ngayKetThuc, LocalDate ngayTao) {
        this.maHopDongPhong = maHopDongPhong;
        this.taiKhoan = taiKhoan;
        this.khachThue = khachThue;
        this.phong = phong;
        this.tienPhong = tienPhong;
        this.tienCoc = tienCoc;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.ngayTao = ngayTao;
    }

    // Manual getters and setters as backup for Lombok
    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public void setMaHopDongPhong(Integer maHopDongPhong) {
        this.maHopDongPhong = maHopDongPhong;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public List<KhachThue> getKhachThue() {
        return khachThue;
    }

    public void setKhachThue(List<KhachThue> khachThue) {
        this.khachThue = khachThue;
    }

    public Phong getPhong() {
        return phong;
    }

    public void setPhong(Phong phong) {
        this.phong = phong;
    }

    public BigDecimal getTienPhong() {
        return tienPhong;
    }

    public void setTienPhong(BigDecimal tienPhong) {
        this.tienPhong = tienPhong;
    }

    public BigDecimal getTienCoc() {
        return tienCoc;
    }

    public void setTienCoc(BigDecimal tienCoc) {
        this.tienCoc = tienCoc;
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
}

