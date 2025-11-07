package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import lombok.Data;


import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RentRoomMessage {
    private Integer maHopDongPhong;
    private TaiKhoan taiKhoan;
    private KhachThue khachThue;
    private Phong phong;
    private BigDecimal tienPhong;
    private BigDecimal tienCoc;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private LocalDate ngayTao;

}
