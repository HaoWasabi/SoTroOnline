package com.so_tro_online.quan_ly_phong.repository;

import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhongRepository extends JpaRepository<Phong,Integer> {
    boolean existsByTenPhongAndTrangThai(String tenPhong,TrangThai trangThai);
    boolean existsByTenPhongAndMaPhongNotAndTrangThai(String tenPhong, Integer maPhong,TrangThai trangThai);
    boolean existsByTenPhongAndTrangThaiNot(String tenPhong, TrangThai trangThai);
    boolean existsByTenPhongAndMaPhongNotAndTrangThaiNot(String tenPhong, Integer maPhong, TrangThai trangThai);
    List<Phong>findByTrangThai(TrangThai trangThai);
    Page<Phong> findByTrangThai(TrangThai trangThai, Pageable pageable);
    Optional<Phong> findByMaPhongAndTrangThai(Integer id, TrangThai trangThai);
    
    // Find all active rooms (excluding deleted ones)
    List<Phong> findByTrangThaiNot(TrangThai trangThai);
    Page<Phong> findByTrangThaiNot(TrangThai trangThai, Pageable pageable);
    Optional<Phong> findByMaPhongAndTrangThaiNot(Integer id, TrangThai trangThai);
    
    @Query("SELECT p FROM Phong p WHERE " +
            "(:tenPhong IS NULL OR LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :tenPhong, '%'))) AND " +
            "(:loaiPhong IS NULL OR LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :loaiPhong, '%'))) AND " +
            "(:diaChi IS NULL OR LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :diaChi, '%'))) AND " +
            "(:chieuDai IS NULL OR p.chieuDai = :chieuDai) AND " +
            "(:chieuRong IS NULL OR p.chieuRong = :chieuRong) AND " +
            "(:vatDung IS NULL OR LOWER(p.vatDung) LIKE LOWER(CONCAT('%', :vatDung, '%'))) AND " +
            "(:giaThueCoBan IS NULL OR p.giaThueCoBan = :giaThueCoBan) AND " +
            "p.trangThai != 'daXoa'")
    List<Phong>searchRoom(String tenPhong, String loaiPhong, String diaChi,
                          BigDecimal chieuDai, BigDecimal chieuRong, String vatDung, BigDecimal giaThueCoBan);

    @Query("SELECT p FROM Phong p WHERE " +
            "(:tenPhong IS NULL OR LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :tenPhong, '%'))) AND " +
            "(:loaiPhong IS NULL OR LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :loaiPhong, '%'))) AND " +
            "(:diaChi IS NULL OR LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :diaChi, '%'))) AND " +
            "(:chieuDai IS NULL OR p.chieuDai = :chieuDai) AND " +
            "(:chieuRong IS NULL OR p.chieuRong = :chieuRong) AND " +
            "(:vatDung IS NULL OR LOWER(p.vatDung) LIKE LOWER(CONCAT('%', :vatDung, '%'))) AND " +
            "(:giaThueCoBan IS NULL OR p.giaThueCoBan = :giaThueCoBan) AND " +
            "p.trangThai != 'daXoa'")
    Page<Phong> searchRoomPaged(String tenPhong, String loaiPhong, String diaChi,
                                BigDecimal chieuDai, BigDecimal chieuRong, String vatDung, BigDecimal giaThueCoBan,
                                Pageable pageable);

}
