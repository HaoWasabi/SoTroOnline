package com.so_tro_online.quan_ly_phieu_thu.entity;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class PhieuThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maPhieuThu;
    @ManyToOne
    @JoinColumn(name = "maHoaDon")
    private HoaDon hoaDon;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    private BigDecimal soTienNo;
    private BigDecimal soTienDaTra;
    private String ghiChu;
    private Date hanThanhToan;
    private Date capNhatLanCuoi;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
