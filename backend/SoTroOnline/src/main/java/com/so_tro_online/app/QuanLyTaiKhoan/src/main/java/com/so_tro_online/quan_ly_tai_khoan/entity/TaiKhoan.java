package com.so_tro_online.quan_ly_tai_khoan.entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maTaiKhoan;
    private String maCanCuoc;
    private String hoTen;
    private String dienThoai;
    private String thuongTru;
    private String ngaySinh;
    private String matKhau;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
