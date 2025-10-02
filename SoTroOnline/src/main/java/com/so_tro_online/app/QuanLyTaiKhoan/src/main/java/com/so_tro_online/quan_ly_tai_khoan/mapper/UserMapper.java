package com.so_tro_online.quan_ly_tai_khoan.mapper;

import com.so_tro_online.quan_ly_tai_khoan.dto.TaiKhoanDTO;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;

import java.time.LocalDateTime;
import java.util.Date;

public class UserMapper {

    public static TaiKhoanDTO toDto(TaiKhoan taiKhoan) {
        return new TaiKhoanDTO(
                taiKhoan.getMaTaiKhoan(),
                taiKhoan.getMaCanCuoc(),
                taiKhoan.getEmail(),
                taiKhoan.getHoTen(),
                taiKhoan.getDienThoai(),
                taiKhoan.getThuongTru(),
                taiKhoan.getNgaySinh().toString(),
                taiKhoan.getNgayTao().toString(),
                taiKhoan.getTrangThai()
        );
    }

    public static TaiKhoan toEntity (
            String email,
            String cccdCode,
            String hoTen,
            String dienThoai,
            String thuongTru,
            Date ngaySinh,
            String matKhau,
            LocalDateTime ngayTao,
            TrangThai trangThai
    ) {
        TaiKhoan taiKhoan = new TaiKhoan();

        taiKhoan.setEmail(email);
        taiKhoan.setMaCanCuoc(cccdCode);
        taiKhoan.setMatKhau(matKhau);
        taiKhoan.setDienThoai(dienThoai);
        taiKhoan.setHoTen(hoTen);
        taiKhoan.setNgaySinh(ngaySinh);
        taiKhoan.setThuongTru(thuongTru);
        taiKhoan.setNgayTao(ngayTao);
        taiKhoan.setTrangThai(trangThai);

        return taiKhoan;
    }
}
