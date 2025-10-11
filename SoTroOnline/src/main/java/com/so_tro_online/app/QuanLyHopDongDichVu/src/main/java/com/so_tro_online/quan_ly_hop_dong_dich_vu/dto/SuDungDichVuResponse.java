package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;


import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;

import java.math.BigDecimal;
import java.util.Date;

public class SuDungDichVuResponse {
    private Integer id;
    private Integer maPhong;
    private String tenPhong;
    private Date thangNam;  // ví dụ: 2025-10-01
    private BigDecimal chiSoDienCu;
    private BigDecimal chiSoDienMoi;
    private BigDecimal chiSoNuocCu;
    private BigDecimal chiSoNuocMoi;
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

    public Date getThangNam() {
        return thangNam;
    }

    public void setThangNam(Date thangNam) {
        this.thangNam = thangNam;
    }

    public BigDecimal getChiSoDienCu() {
        return chiSoDienCu;
    }

    public void setChiSoDienCu(BigDecimal chiSoDienCu) {
        this.chiSoDienCu = chiSoDienCu;
    }

    public BigDecimal getChiSoDienMoi() {
        return chiSoDienMoi;
    }

    public void setChiSoDienMoi(BigDecimal chiSoDienMoi) {
        this.chiSoDienMoi = chiSoDienMoi;
    }

    public BigDecimal getChiSoNuocCu() {
        return chiSoNuocCu;
    }

    public void setChiSoNuocCu(BigDecimal chiSoNuocCu) {
        this.chiSoNuocCu = chiSoNuocCu;
    }

    public BigDecimal getChiSoNuocMoi() {
        return chiSoNuocMoi;
    }

    public void setChiSoNuocMoi(BigDecimal chiSoNuocMoi) {
        this.chiSoNuocMoi = chiSoNuocMoi;
    }
}
