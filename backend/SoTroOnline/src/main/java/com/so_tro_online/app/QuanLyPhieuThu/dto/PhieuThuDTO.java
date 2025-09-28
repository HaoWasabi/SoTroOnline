package com.so_tro_online.quan_ly_phieu_thu.dto;

import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data   // sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThuDTO {
    private Integer maPhieuThu;
    private Integer maHoaDon;
    private Integer maKhachDaiDien;
    private BigDecimal tienNo;
    private BigDecimal tienDaThu;
    private String ghiChu;
    private Instant ngayTao;
    private TrangThaiPhieuThu trangThai;
}
