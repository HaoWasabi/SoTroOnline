package com.so_tro_online.quan_ly_hoa_don.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHoaDon;
    private BigDecimal tienPhong;
    private BigDecimal tienNoCu;
    private BigDecimal tongTien;
    private Date ngayTao;
    private Date capNhatLanCuoi;
    private TrangThai trangThai;
}
