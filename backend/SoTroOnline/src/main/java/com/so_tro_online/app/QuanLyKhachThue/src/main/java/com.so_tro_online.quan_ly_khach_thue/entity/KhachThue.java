package com.so_tro_online.quan_ly_khach_thue.entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
public class KhachThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maKhach;
    @ManyToOne
    @JoinColumn(name = "maKhachDaiDien")
    private KhachThue khachThue;
    private String maCanCuoc;
    private String hoTen;
    private String dienThoai;
    private String ngaySinh;
    private String thuongTru;
    private Date ngayTao;
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;
}
