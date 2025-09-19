package com.so_tro_online.quan_ly_phong.entity;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Phong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maPhong;
    @ManyToOne
    @JoinColumn(name = "maQuanLy")
    private TaiKhoan maQuanLy;
    private String tenPhong;
    private String loaiPhong;
    private String diaChi;
    private BigDecimal chieuDai;
    private BigDecimal chieuRong;
    private String vatDung;
    private Float giaThueCoBan;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
