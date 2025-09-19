package com.so_tro_online.quan_ly_hop_dong_dich_vu.entity;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class HopDongDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHopDongDichVu;
    @ManyToOne
    @JoinColumn(name = "maQuanLy")
    private TaiKhoan taiKhoan;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    @ManyToOne
    @JoinColumn(name = "maDichVu")
    private DichVu dichVu;
    private BigDecimal donGia;
    private String donVi;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
