package com.so_tro_online.quan_ly_hoa_don.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    Optional<HoaDon> findByIdAndTrangThai(int id, TrangThaiHoaDon trangThai);
    Optional<HoaDon> findByIdAndTrangThaiNot(int id, TrangThaiHoaDon trangThai);
    List<HoaDon> findAllByTrangThai(TrangThaiHoaDon trangThai);
    List<HoaDon> findAllByTrangThaiNot(TrangThaiHoaDon trangThai);
    int countByTrangThai(TrangThaiHoaDon trangThai);
    int countByTrangThaiNot(TrangThaiHoaDon trangThai);
}