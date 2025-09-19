package com.so_tro_online.quan_ly_hop_dong_phong.entity;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class HopDongPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHopDongPhong;
    @ManyToOne
    @JoinColumn(name="maQuanLy")
    private TaiKhoan taiKhoan;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    @ManyToOne
    @JoinColumn(name="maPhong")
    private Phong phong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
