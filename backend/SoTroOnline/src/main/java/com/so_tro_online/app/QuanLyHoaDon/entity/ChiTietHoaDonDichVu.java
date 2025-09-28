package com.so_tro_online.quan_ly_hoa_don.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data   // Tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor      // constructor rỗng 
@AllArgsConstructor     // constructor đầy đủ tham số
@Entity
@Table(name = "ChiTietHoaDonDichVu")
public class ChiTietHoaDonDichVu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "maChiTietHoaDonDichVu", updatable = false)
    private Integer maChiTietHoaDonDichVu;

    // Nhiều chi tiết dịch vụ -> 1 Hóa đơn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoaDon", nullable = false)
    private HoaDon hoaDon;

    // Nhiều chi tiết dịch vụ -> 1 Hợp đồng dịch vụ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHopDongDichVu", nullable = false)
    private HopDongDichVu hopDongDichVu;

    @Column(name = "donGia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "donVi", nullable = false)
    private String donVi;

    @Column(name = "chiSoCu", nullable = false)
    private Integer chiSoCu;

    @Column(name = "chiSoMoi", nullable = false)
    private Integer chiSoMoi;

    @Column(name = "soLuong", nullable = false)
    private Integer soLuong;

    @Column(name = "thanhTien", nullable = false)
    private BigDecimal thanhTien;

    @Column(name = "ngayTao", nullable = false)
    private Instant ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangThai", nullable = false)
    private TrangThaiChiTietHoaDonDichVu trangThai;
}
