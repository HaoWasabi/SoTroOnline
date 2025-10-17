package com.so_tro_online.quan_ly_hoa_don.entity;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHoaDon;
    private BigDecimal tienPhong;
    private BigDecimal tienDichVu;
    private BigDecimal tongTien;
    private BigDecimal tienConNo;
    private LocalDate ngayTao;
    private LocalDate capNhatLanCuoi;
    private Integer thang;
    private Integer nam;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
    private String noiDung;
    @ManyToOne
    @JoinColumn(name = "ma_hop_dong_phong", nullable = false)
    private HopDongPhong hopDongPhong;
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL)
    private List<ChiTietHoaDon> chiTietHoaDons = new ArrayList<>();

    public Integer getMaHoaDon() {
        return maHoaDon;
    }

    public HopDongPhong getHopDongPhong() {
        return hopDongPhong;
    }

    public void setHopDongPhong(HopDongPhong hopDongPhong) {
        this.hopDongPhong = hopDongPhong;
    }

    public void setMaHoaDon(Integer maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public BigDecimal getTienConNo() {
        return tienConNo;
    }

    public void setTienConNo(BigDecimal tienConNo) {
        this.tienConNo = tienConNo;
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

    public Integer getThang() {
        return thang;
    }

    public void setThang(Integer thang) {
        this.thang = thang;
    }

    public Integer getNam() {
        return nam;
    }

    public void setNam(Integer nam) {
        this.nam = nam;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public List<ChiTietHoaDon> getChiTietHoaDons() {
        return chiTietHoaDons;
    }

    public void setChiTietHoaDons(List<ChiTietHoaDon> chiTietHoaDons) {
        this.chiTietHoaDons = chiTietHoaDons;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }
}
