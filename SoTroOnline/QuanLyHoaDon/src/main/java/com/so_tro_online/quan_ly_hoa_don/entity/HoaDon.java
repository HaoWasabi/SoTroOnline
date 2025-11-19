package com.so_tro_online.quan_ly_hoa_don.entity;


import com.so_tro_online.quan_ly_hop_dong_phong.enity.HopDongPhong;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hoa_don")
    private Integer maHoaDon;

    @Column(name = "tien_phong")
    private BigDecimal tienPhong;

    @Column(name = "tien_dich_vu")
    private BigDecimal tienDichVu;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "tien_con_no")
    private BigDecimal tienConNo;

    @Column(name = "ngay_tao")
    private LocalDate ngayTao;

    @Column(name = "cap_nhat_lan_cuoi")
    private LocalDate capNhatLanCuoi;

    @Column(name = "thang")
    private Integer thang;

    @Column(name = "nam")
    private Integer nam;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThai trangThai;

    @Column(name = "noi_dung")
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
