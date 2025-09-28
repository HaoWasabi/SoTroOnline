package com.so_tro_online.quan_ly_hoa_don.dto;

import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;

import java.math.BigDecimal; // dùng BigDecimal để tránh sai số khi tính toán tiền. 
import java.io.Serializable;
import java.util.LocalDate;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // Tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // constructor rỗng
@AllArgsConstructor // constructor đầy đủ tham số
public class HoaDonDTO implements Serializable {
    private int maHoaDon;
    private int maHopDongPhong;
    private int maKhachDaiDien;
    private BigDecimal tienPhong;
    private BigDecimal tienNo;
    private BigDecimal tongTien;
    private LocalDate thangNam;
    private Instant ngayTao;
    private TrangThaiHoaDon trangThai;

    // Quan hệ 1-n
    private List<ChiTietHoaDonDichVuDTO> chiTietHoaDonDichVuList;
    private List<PhieuThuDTO> phieuThuList;

    public HoaDonDTO(int maHoaDon, int maHopDongPhong, int maKhachDaiDien, BigDecimal tienPhong,
            BigDecimal tienNo, BigDecimal tongTien, LocalDate thangNam, Instant ngayTao, TrangThaiHoaDon trangThai) {
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