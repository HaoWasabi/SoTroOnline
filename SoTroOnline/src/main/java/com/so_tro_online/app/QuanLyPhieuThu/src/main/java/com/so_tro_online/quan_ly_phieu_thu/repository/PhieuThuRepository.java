package com.so_tro_online.quan_ly_phieu_thu.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface PhieuThuRepository extends JpaRepository<PhieuThu,Integer> {
    List<PhieuThu> findByHoaDon(HoaDon hoaDon);

    List<PhieuThu> findByKhachThue(KhachThue khachThue);
}
