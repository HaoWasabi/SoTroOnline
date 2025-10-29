package com.so_tro_online.quan_ly_khach_thue.mapper;

import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueDto;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class KhachThueMapper {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public static KhachThueDto toDto(KhachThue khachThue) {
        return new KhachThueDto(
                khachThue.getMaKhach(),
                khachThue.getMaKhachDaiDien(),
                khachThue.getMaCanCuoc(),
                khachThue.getHoTen(),
                khachThue.getDienThoai(),
                khachThue.getThuongTru(),
                khachThue.getNgaySinh() != null ? DATE_FORMAT.format(khachThue.getNgaySinh()) : null,
                khachThue.getNgayTao() != null ? khachThue.getNgayTao().toString() : null,
                khachThue.getTrangThai()
        );
    }

    public static KhachThue toEntity(KhachThueDto dto) {
        KhachThue khachThue = new KhachThue();
        khachThue.setMaKhach(dto.getMaKhach());
        khachThue.setMaKhachDaiDien(dto.getMaKhachDaiDien());
        khachThue.setMaCanCuoc(dto.getMaCanCuoc());
        khachThue.setHoTen(dto.getHoTen());
        khachThue.setThuongTru(dto.getThuongTru());

        // Convert string date to Date
        if (dto.getNgaySinh() != null && !dto.getNgaySinh().isEmpty()) {
            try {
                khachThue.setNgaySinh(DATE_FORMAT.parse(dto.getNgaySinh()));
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid date format. Expected yyyy-MM-dd");
            }
        }

        return khachThue;
    }

    public static void updateEntityFromDto(KhachThue khachThue, KhachThueDto dto) {
        if (dto.getMaKhachDaiDien() != null) {
            khachThue.setMaKhachDaiDien(dto.getMaKhachDaiDien());
        }
        if (dto.getMaCanCuoc() != null) {
            khachThue.setMaCanCuoc(dto.getMaCanCuoc());
        }
        if (dto.getHoTen() != null) {
            khachThue.setHoTen(dto.getHoTen());
        }
        if (dto.getThuongTru() != null) {
            khachThue.setThuongTru(dto.getThuongTru());
        }
        if (dto.getNgaySinh() != null && !dto.getNgaySinh().isEmpty()) {
            try {
                khachThue.setNgaySinh(DATE_FORMAT.parse(dto.getNgaySinh()));
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid date format. Expected yyyy-MM-dd");
            }
        }
    }
}
