package com.so_tro_online.quan_ly_dich_vu_phong.repository;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface DichVuRepository extends JpaRepository<DichVu,Integer> {
    boolean existsByTenDichVuAndTrangThai(String tenDichVu, TrangThai trangThai);

    boolean existsByTenDichVuAndMaDichVuNotAndTrangThai(String tenDichVu, Integer maDichVu, TrangThai trangThai);

    List<DichVu> findByTrangThai(TrangThai trangThai);
    Optional<DichVu> findByMaDichVuAndTrangThai(Integer id,TrangThai trangThai);
}
