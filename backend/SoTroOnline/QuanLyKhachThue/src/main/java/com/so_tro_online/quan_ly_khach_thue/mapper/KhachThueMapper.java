package com.so_tro_online.quan_ly_khach_thue.mapper;

import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueDto;
import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueRequest;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.entity.TrangThai;
import com.so_tro_online.quan_ly_khach_thue.exception.InvalidKhachThueDataException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class KhachThueMapper {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public static KhachThueDto toDto(KhachThue khachThue) {
        return new KhachThueDto(
                khachThue.getMaKhach(),
                khachThue.getMaCanCuoc(),
                khachThue.getHoTen(),
                khachThue.getDienThoai(),
                khachThue.getThuongTru(),
                khachThue.getNgaySinh() != null ? DATE_FORMAT.format(khachThue.getNgaySinh()) : null,
                khachThue.getNgayTao() != null ? khachThue.getNgayTao().toString() : null,
                khachThue.getTrangThai(),
                khachThue.getMaNguoiQuanLy(), // Include manager ID
                khachThue.getEmail() // Include email
        );
    }

    public static KhachThue toEntity(KhachThueDto dto) {
        KhachThue khachThue = new KhachThue();
        khachThue.setMaKhach(dto.getMaKhach());
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
        if (dto.getMaCanCuoc() != null && !dto.getMaCanCuoc().equals(khachThue.getMaCanCuoc())) {
            khachThue.setMaCanCuoc(dto.getMaCanCuoc());
        }
        if (dto.getHoTen() != null && !dto.getHoTen().equals(khachThue.getHoTen())) {
            khachThue.setHoTen(dto.getHoTen());
        }
        if (dto.getThuongTru() != null && !dto.getThuongTru().equals(khachThue.getThuongTru())) {
            khachThue.setThuongTru(dto.getThuongTru());
        }
        if (dto.getNgaySinh() != null && !dto.getNgaySinh().isEmpty() && !dto.getNgaySinh().equals(khachThue.getNgaySinh().toString())) {
            try {
                khachThue.setNgaySinh(DATE_FORMAT.parse(dto.getNgaySinh()));
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid date format. Expected yyyy-MM-dd");
            }
        }
    }

    /**
     * Create entity from KhachThueRequest for tenant creation
     */
    public static KhachThue createEntityFromRequest(KhachThueRequest request) {
        KhachThue khachThue = new KhachThue();
        khachThue.setMaCanCuoc(request.getMaCanCuoc().trim());
        khachThue.setHoTen(request.getHoTen().trim());
        khachThue.setDienThoai(request.getDienThoai() != null ? request.getDienThoai().trim() : null);
        khachThue.setThuongTru(request.getThuongTru() != null ? request.getThuongTru().trim() : null);
        khachThue.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        khachThue.setTrangThai(TrangThai.hoatDong);
        khachThue.setNgayTao(Instant.now());

        // Handle date parsing properly
        if (request.getNgaySinh() != null && !request.getNgaySinh().trim().isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(request.getNgaySinh().trim());
                Date ngaySinh = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                khachThue.setNgaySinh(ngaySinh);
            } catch (Exception dateException) {
                throw new InvalidKhachThueDataException("Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD");
            }
        }

        // Set manager ID for SAAS multi-tenant support
        if (request.getMaNguoiQuanLy() != null) {
            khachThue.setMaNguoiQuanLy(request.getMaNguoiQuanLy());
        }

        return khachThue;
    }
}
