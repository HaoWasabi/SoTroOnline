package com.so_tro_online.quan_ly_phieu_thu.repository;

import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PhieuThuRepository extends JpaRepository<PhieuThu, Integer> {
    Optional<PhieuThu> findTopByTrangThaiOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    Optional<PhieuThu> findTopByTrangThaiNotOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    Optional<PhieuThu> findByMaPhieuThuAndTrangThai(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    Optional<PhieuThu> findByMaPhieuThuAndTrangThaiNot(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    List<PhieuThu> findAllByTrangThai(TrangThaiPhieuThu trangThai);
    List<PhieuThu> findAllByTrangThaiNot(TrangThaiPhieuThu trangThai);
    int countByTrangThai(TrangThaiPhieuThu trangThai);
    int countByTrangThaiNot(TrangThaiPhieuThu trangThai);
    @Modifying
    @Query("UPDATE PhieuThu SET trangThai = :#{T(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu).DA_HUY} WHERE maPhieuThu = :maPhieuThu AND trangThai != :#{T(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu).DA_HUY}")
    Integer softDeleteById(Integer maPhieuThu);
    @Modifying
    @Query("UPDATE PhieuThu SET trangThai = :#{T(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu).HOAT_DONG} WHERE maPhieuThu = :maPhieuThu AND trangThai = :#{T(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu).DA_HUY}")
    Integer unDeleteById(Integer maPhieuThu);
    // Tìm phiếu thu có tiền nợ lớn hơn một số tiền cụ thể
    @Query("SELECT * FROM PhieuThu WHERE tienNo > :soTien AND trangThai = :#{T(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu).HOAT_DONG}")
    List<PhieuThu> findByTienNoGreaterThan(@Param("soTien") BigDecimal soTien);
}