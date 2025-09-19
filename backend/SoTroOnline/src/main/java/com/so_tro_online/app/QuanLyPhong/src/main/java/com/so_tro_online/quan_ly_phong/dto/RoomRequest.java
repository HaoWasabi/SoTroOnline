package com.so_tro_online.quan_ly_phong.dto;

import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.persistence.*;

import java.math.BigDecimal;

public class RoomRequest {
    private Integer maQuanLy;
    private String tenPhong;
    private String loaiPhong;
    private String diaChi;
    private BigDecimal chieuDai;
    private BigDecimal chieuRong;
    private String vatDung;
    private Float giaThueCoBan;
    private TrangThai trangThai;
}
