package com.so_tro_online.quan_ly_dich_vu_phong.dto;



import com.so_tro_online.quan_ly_dich_vu_phong.entity.LoaiTinh;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai;

import java.math.BigDecimal;

public class DichVuRequest {
    private Integer maQuanLy; // để biết dịch vụ thuộc tài khoản nào
    private String tenDichVu;
    private BigDecimal donGiaCoBan;
    private String donViCoBan;
    private String moTa;
    private TrangThai trangThai;
    private LoaiTinh loaiTinh;
    public LoaiTinh getLoaiTinh() {
        return loaiTinh;
    }
    public void setLoaiTinh(LoaiTinh loaiTinh) {
        this.loaiTinh = loaiTinh;
    }
    public DichVuRequest(String tenDichVu, BigDecimal donGiaCoBan, String donViCoBan, String moTa, TrangThai trangThai, Integer maQuanLy) {
        this.maQuanLy = maQuanLy;
        this.tenDichVu = tenDichVu;
        this.donGiaCoBan = donGiaCoBan;
        this.donViCoBan = donViCoBan;
        this.moTa = moTa;
        this.trangThai = trangThai;

    }
    public DichVuRequest(){

    }
    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public BigDecimal getDonGiaCoBan() {
        return donGiaCoBan;
    }

    public void setDonGiaCoBan(BigDecimal donGiaCoBan) {
        this.donGiaCoBan = donGiaCoBan;
    }

    public String getDonViCoBan() {
        return donViCoBan;
    }

    public void setDonViCoBan(String donViCoBan) {
        this.donViCoBan = donViCoBan;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getMaQuanLy() {
        return maQuanLy;
    }

    public void setMaQuanLy(Integer maTaiKhoan) {
        this.maQuanLy = maTaiKhoan;
    }

    @Override
    public String toString() {
        return "DichVuRequest{" +
                "tenDichVu='" + tenDichVu + '\'' +
                ", donGiaCoBan=" + donGiaCoBan +
                ", donViCoBan='" + donViCoBan + '\'' +
                ", moTa='" + moTa + '\'' +
                ", trangThai=" + trangThai +
                ", maQuanLy='" + maQuanLy + '\'' +
                '}';
    }
}
