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
    
    // Manager-scoped validation methods for SAAS
    boolean existsByTenPhongAndTaiKhoanMaTaiKhoanAndTrangThaiNot(String tenPhong, Integer maTaiKhoan, TrangThai trangThai);
    boolean existsByTenPhongAndMaPhongNotAndTaiKhoanMaTaiKhoanAndTrangThaiNot(String tenPhong, Integer maPhong, Integer maTaiKhoan, TrangThai trangThai);
    
    List<Phong>findByTrangThai(TrangThai trangThai);
    Page<Phong> findByTrangThai(TrangThai trangThai, Pageable pageable);
    
    // Count methods for room status tracking
    long countByTrangThai(TrangThai trangThai);
    
    @Query("select p from Phong p where p.maPhong = :id and p.trangThai = :trangThai")
    Optional<Phong> findByMaPhongAndTrangThai(Integer id, TrangThai trangThai);
    
    // Find all active rooms (excluding deleted ones)
    List<Phong> findByTrangThaiNot(TrangThai trangThai);
    Page<Phong> findByTrangThaiNot(TrangThai trangThai, Pageable pageable);
    Optional<Phong> findByMaPhongAndTrangThaiNot(Integer id, TrangThai trangThai);
    
    // Manager-based filtering methods
    List<Phong> findByTaiKhoanMaTaiKhoan(Integer maTaiKhoan);
    Page<Phong> findByTaiKhoanMaTaiKhoan(Integer maTaiKhoan, Pageable pageable);
    List<Phong> findByTaiKhoanMaTaiKhoanAndTrangThaiNot(Integer maTaiKhoan, TrangThai trangThai);
    Page<Phong> findByTaiKhoanMaTaiKhoanAndTrangThaiNot(Integer maTaiKhoan, TrangThai trangThai, Pageable pageable);
    
    // Enhanced search methods - exclude deleted rooms
    @Query("SELECT p FROM Phong p WHERE p.trangThai != :excludedStatus AND (" +
           "LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CONCAT('', p.maPhong) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Phong> findByMultipleFields(String searchTerm, TrangThai excludedStatus, Pageable pageable);

    // Enhanced search methods - include all rooms
    @Query("SELECT p FROM Phong p WHERE " +
           "LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CONCAT('', p.maPhong) LIKE CONCAT('%', :searchTerm, '%')")
    Page<Phong> findByMultipleFieldsAll(String searchTerm, Pageable pageable);
    
    // Manager-based search method
    @Query("SELECT p FROM Phong p WHERE p.taiKhoan.maTaiKhoan = :managerId AND p.trangThai != :excludedStatus AND (" +
           "LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CONCAT('', p.maPhong) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Phong> findByManagerAndMultipleFields(Integer managerId, String searchTerm, TrangThai excludedStatus, Pageable pageable);
    
    // Status filtering methods
    Page<Phong> findByTaiKhoanMaTaiKhoanAndTrangThai(Integer managerId, TrangThai trangThai, Pageable pageable);
    Page<Phong> findByTrangThaiAndTrangThaiNot(TrangThai includedStatus, TrangThai excludedStatus, Pageable pageable);
    
    // Manager-based search with status filter
    @Query("SELECT p FROM Phong p WHERE p.taiKhoan.maTaiKhoan = :managerId AND p.trangThai = :status AND p.trangThai != :excludedStatus AND (" +
           "LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CONCAT('', p.maPhong) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Phong> findByManagerAndMultipleFieldsWithStatus(Integer managerId, String searchTerm, TrangThai status, TrangThai excludedStatus, Pageable pageable);
    
    // Global search with status filter (no manager restriction)
    @Query("SELECT p FROM Phong p WHERE p.trangThai = :status AND p.trangThai != :excludedStatus AND (" +
           "LOWER(p.tenPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.loaiPhong) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.diaChi) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CONCAT('', p.maPhong) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Phong> findByMultipleFieldsWithStatus(String searchTerm, TrangThai status, TrangThai excludedStatus, Pageable pageable);

}
