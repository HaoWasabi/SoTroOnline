package com.so_tro_online.quan_ly_hop_dong_phong.util;

import java.time.LocalDate;
import java.util.Date;

/**
 * Dữ liệu hợp đồng thuê nhà.
 * Chứa thông tin Bên A (chủ nhà) và Bên B (khách thuê).
 */
public class HopDongData {

    public PersonInfo benA; // chủ thuê / chủ nhà
    public PersonInfo benB; // khách thuê

    public String diaChiPhong;
    public long giaThue;
    public long donGiaDien;
    public long donGiaNuoc;

    public boolean dvRac;
    public boolean dvWifi;
    public boolean dvCap;
    public boolean dvKhac;

    public long tienRac;
    public long tienWifi;
    public long tienCap;
    public long tienKhac;

    public long tienCoc;

    public LocalDate ngayBatDau;
    public LocalDate ngayKetThuc;
    public LocalDate ngayKy;

    // Constructor đầy đủ
    public HopDongData(PersonInfo benA, PersonInfo benB, String diaChiPhong, long giaThue, long donGiaDien,
            long donGiaNuoc, boolean dvRac, boolean dvWifi, boolean dvCap, boolean dvKhac, long tienRac,
            long tienWifi, long tienCap, long tienKhac, long tienCoc, LocalDate ngayBatDau, LocalDate ngayKetThuc,
            LocalDate ngayKy) {
        this.benA = benA;
        this.benB = benB;
        this.diaChiPhong = diaChiPhong;
        this.giaThue = giaThue;
        this.donGiaDien = donGiaDien;
        this.donGiaNuoc = donGiaNuoc;
        this.dvRac = dvRac;
        this.dvWifi = dvWifi;
        this.dvCap = dvCap;
        this.dvKhac = dvKhac;
        this.tienRac = tienRac;
        this.tienWifi = tienWifi;
        this.tienCap = tienCap;
        this.tienKhac = tienKhac;
        this.tienCoc = tienCoc;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.ngayKy = ngayKy;
    }

    // ================= Helper class =================
    public static class PersonInfo {
        public Integer id;
        public String cccd;
        public String email;
        public String hoTen;
        public String dienThoai;
        public String thuongTru;
        public Date ngaySinh;

        public PersonInfo(Integer id, String cccd, String email, String hoTen, String dienThoai,
                String thuongTru, Date ngaySinh) {
            this.id = id;
            this.cccd = cccd;
            this.email = email;
            this.hoTen = hoTen;
            this.dienThoai = dienThoai;
            this.thuongTru = thuongTru;
            this.ngaySinh = ngaySinh;
        }
    }
}