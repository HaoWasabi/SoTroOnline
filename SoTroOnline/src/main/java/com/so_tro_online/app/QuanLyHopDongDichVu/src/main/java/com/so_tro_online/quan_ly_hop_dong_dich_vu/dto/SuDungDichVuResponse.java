package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;


import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class SuDungDichVuResponse {
    private Integer id;
    private Integer maPhong;
    private String tenPhong;
    private LocalDate thangNam;  // ví dụ: 2025-10-01
    private Integer chiSoDienCu;
    private Integer chiSoDienMoi;
    private Integer chiSoNuocCu;
    private Integer chiSoNuocMoi;
    private TrangThai trangThai;

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public LocalDate getThangNam() {
        return thangNam;
    }

    public void setThangNam(LocalDate thangNam) {
        this.thangNam = thangNam;
    }

    public Integer getChiSoDienCu() {
        return chiSoDienCu;
    }

    public void setChiSoDienCu(Integer chiSoDienCu) {
        this.chiSoDienCu = chiSoDienCu;
    }

    public Integer getChiSoDienMoi() {
        return chiSoDienMoi;
    }

    public void setChiSoDienMoi(Integer chiSoDienMoi) {
        this.chiSoDienMoi = chiSoDienMoi;
    }

    public Integer getChiSoNuocCu() {
        return chiSoNuocCu;
    }

    public void setChiSoNuocCu(Integer chiSoNuocCu) {
        this.chiSoNuocCu = chiSoNuocCu;
    }

    public Integer getChiSoNuocMoi() {
        return chiSoNuocMoi;
    }

    public void setChiSoNuocMoi(Integer chiSoNuocMoi) {
        this.chiSoNuocMoi = chiSoNuocMoi;
    }
}
