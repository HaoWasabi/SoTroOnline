package com.so_tro_online.quan_ly_dich_vu_phong.entity;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class DichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDichVu;
    @ManyToOne
    @JoinColumn(name = "maQuanLy")
    private TaiKhoan taiKhoan;
    private String tenDichVu;
    private BigDecimal donGiaCoBan;
    private String donViCoBan;
    private String moTa;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
