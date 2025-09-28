package com.so_tro_online.quan_ly_hoa_don.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.ChiTietHoaDonDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ChiTietHoaDonDichVuRepository extends JpaRepository<ChiTietHoaDonDichVu, Integer> {
    Optional<ChiTietHoaDonDichVu> findByIdAndTrangThai(int id, TrangThaiChiTietHoaDonDichVu trangThai);
    Optional<ChiTietHoaDonDichVu> findByIdAndTrangThaiNot(int id, TrangThaiChiTietHoaDonDichVu trangThai);
    List<ChiTietHoaDonDichVu> findAllByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    List<ChiTietHoaDonDichVu> findAllByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
    int countByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    int countByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
}