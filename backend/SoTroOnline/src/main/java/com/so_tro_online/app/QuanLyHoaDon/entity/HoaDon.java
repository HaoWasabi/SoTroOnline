package com.so_tro_online.quan_ly_hoa_don.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "HoaDon")
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "maHoaDon", updatable = false)
    private Integer maHoaDon;

    @Column(name = "maHopDongPhong", nullable = false)
    private Integer maHopDongPhong;

    @Column(name = "maKhachDaiDien", nullable = false)
    private Integer maKhachDaiDien;

    @Column(name = "tienPhong", nullable = false)
    private BigDecimal tienPhong;

    @Column(name = "tienNo", nullable = false)
    private BigDecimal tienNo;

    @Column(name = "tongTien", nullable = false)
    private BigDecimal tongTien;

    @Column(name = "thangNam", nullable = false)
    private LocalDate thangNam;

    @Column(name = "ngayTao", nullable = false)
    private Instant ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", nullable = false)
    private TrangThaiHoaDon trangThai;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChiTietHoaDonDichVu> chiTietHoaDonDichVuList;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PhieuThu> phieuThuList;

    public HoaDon(int maHoaDon, int maHopDongPhong, int maKhachDaiDien, BigDecimal tienPhong,
                  BigDecimal tienNo, BigDecimal tongTien, LocalDate thangNam,
                  Instant ngayTao, TrangThaiHoaDon trangThai) {
        this.maHoaDon = maHoaDon;
        this.maHopDongPhong = maHopDongPhong;
        this.maKhachDaiDien = maKhachDaiDien;
        this.tienPhong = tienPhong;
        this.tienNo = tienNo;
        this.tongTien = tongTien;
        this.thangNam = thangNam;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }
}
