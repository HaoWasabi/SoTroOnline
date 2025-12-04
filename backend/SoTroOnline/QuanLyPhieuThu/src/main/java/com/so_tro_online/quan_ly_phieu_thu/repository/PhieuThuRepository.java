package com.so_tro_online.quan_ly_phieu_thu.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhieuThuRepository extends JpaRepository<PhieuThu,Integer> {
    List<PhieuThu> findByHoaDon(HoaDon hoaDon);
    List<PhieuThu> findByKhachThue(KhachThue khachThue);

    @Query("SELECT h FROM PhieuThu h WHERE h.trangThai <> 'daXoa'")
    List<PhieuThu> findAllActive();
    
    // User-based filtering methods for multi-tenant data isolation
    @Query("SELECT p FROM PhieuThu p WHERE p.hoaDon.hopDongPhong.taiKhoan.maTaiKhoan = :maTaiKhoan AND p.trangThai <> 'daXoa'")
    List<PhieuThu> findAllActiveByUser(@Param("maTaiKhoan") Integer maTaiKhoan);

    List<PhieuThu> findByHoaDon_HopDongPhong(HopDongPhong hopDongPhong);

    @Query("SELECT p FROM PhieuThu p WHERE p.hoaDon.hopDongPhong.maHopDongPhong = :hopDongPhongId AND p.trangThai <> 'daXoa'")
    List<PhieuThu> findByHoaDon_HopDongPhong(Integer hopDongPhongId);
}
