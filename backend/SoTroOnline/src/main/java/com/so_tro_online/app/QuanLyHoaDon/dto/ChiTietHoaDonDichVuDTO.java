package com.so_tro_online.quan_ly_hoa_don.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiChiTietHoaDonDichVu;

import java.math.BigDecimal; // dùng BigDecimal để tránh sai số khi tính toán tiền. 
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data   // Tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor      // constructor rỗng
@AllArgsConstructor     // constructor đầy đủ tham số
public class ChiTietHoaDonDichVuDTO implements Serializable {
    private int maChiTietHoaDonDichVu;
    private int maHoaDon;    // FK -> HoaDon
    private int maHopDongDichVu;    // FK -> DichVu
    private BigDecimal donGia;
    private String donVi;
    private int chiSoCu;
    private int chiSoMoi;
    private int soLuong;
    private BigDecimal thanhTien;
    private Instant ngayTao;
    private TrangThaiChiTietHoaDonDichVu trangThai;
}