package com.so_tro_online.quan_ly_hop_dong_dich_vu.repository;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.MyHopDongDichVu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyHopDongDichVuRepository extends JpaRepository<MyHopDongDichVu,Integer> {
    boolean existsByHopDongMaHopDongPhongAndDichVuMaDichVu(Integer maHopDong, Integer maDichVu);

    List<MyHopDongDichVu> findByHopDongMaHopDongPhong(Integer maHopDongPhong);
}
