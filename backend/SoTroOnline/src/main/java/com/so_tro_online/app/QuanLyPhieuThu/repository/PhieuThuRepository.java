package com.so_tro_online.quan_ly_phieu_thu.repository;

import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PhieuThuRepository extends JpaRepository<PhieuThu, Integer> {
    Optional<PhieuThu> findByIdAndTrangThai(int id, TrangThaiPhieuThu trangThai);
    Optional<PhieuThu> findByIdAndTrangThaiNot(int id, TrangThaiPhieuThu trangThai);
    List<PhieuThu> findAllByTrangThai(TrangThaiPhieuThu trangThai);
    List<PhieuThu> findAllByTrangThaiNot(TrangThaiPhieuThu trangThai);
    int countByTrangThai(TrangThaiPhieuThu trangThai);
    int countByTrangThaiNot(TrangThaiPhieuThu trangThai);
}