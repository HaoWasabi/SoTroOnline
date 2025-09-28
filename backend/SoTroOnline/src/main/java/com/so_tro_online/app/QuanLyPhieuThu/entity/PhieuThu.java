package com.so_tro_online.quan_ly_phieu_thu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data  
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PhieuThu")
public class PhieuThu {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "maPhieuThu", updatable = false, nullable = false)
    private int maPhieuThu;

    @Column(name = "maHoaDon", nullable = false)
    private int maHoaDon;   // FK -> HoaDon

    @Column(name = "maKhachDaiDien", nullable = false)
    private int maKhachDaiDien;   // FK -> KhachDaiDien

    @Column(name = "tienNo", nullable = false, precision = 15, scale = 2)
    private BigDecimal tienNo;

    @Column(name = "tienDaThu", nullable = false, precision = 15, scale = 2)
    private BigDecimal tienDaThu;

    @Column(name = "ghiChu")
    private String ghiChu;

    // Dùng LocalDate thay cho Date
    @Column(name = "ngayTao", nullable = false)
    private Instant ngayTao;

    @Enumerated(EnumType.STRING) 
    @Column(name = "trangThai", nullable = false)
    private TrangThaiPhieuThu trangThai;
}
