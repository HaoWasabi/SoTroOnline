package com.so_tro_online.quan_ly_phong.repository;

import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhongRepository extends JpaRepository<Phong,Integer> {
    boolean existsByTenPhongAndTrangThai(String tenPhong,TrangThai trangThai);
    boolean existsByTenPhongAndMaPhongNotAndTrangThai(String tenPhong, Integer maPhong,TrangThai trangThai);
    List<Phong>findByTrangThai(TrangThai trangThai);
    Optional<Phong> findByMaPhongAndTrangThai(Integer id, TrangThai trangThai);
}
