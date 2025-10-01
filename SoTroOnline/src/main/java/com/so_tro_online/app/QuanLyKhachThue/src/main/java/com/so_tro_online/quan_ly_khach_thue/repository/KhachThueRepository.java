package com.so_tro_online.quan_ly_khach_thue.repository;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhachThueRepository extends JpaRepository<KhachThue,Integer> {
    Optional<KhachThue> findByMaKhachAndTrangThai(Integer maKhachDaiDien, TrangThai trangThai);
}
