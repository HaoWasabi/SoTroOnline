package com.so_tro_online.quan_ly_khach_thue.repository;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.entity.TrangThai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachThueRepository extends JpaRepository<KhachThue, Integer> {

    // Check if maCanCuoc exists among active tenants (not deleted)
    boolean existsByMaCanCuocAndTrangThaiNot(String maCanCuoc, TrangThai trangThai);

    // Legacy method for backward compatibility - checks all records
    boolean existsByMaCanCuoc(String maCanCuoc);

    // Only find active tenants (not deleted)
    Page<KhachThue> findByHoTenContainingIgnoreCaseAndTrangThaiNot(String hoTen, TrangThai trangThai, Pageable pageable);
    
    // Find tenants by name - including all statuses
    Page<KhachThue> findByHoTenContainingIgnoreCase(String hoTen, Pageable pageable);
    
    // Find all active tenants (not deleted)
    Page<KhachThue> findByTrangThaiNot(TrangThai trangThai, Pageable pageable);

    // Find all deleted tenants
    Page<KhachThue> findByTrangThai(TrangThai trangThai, Pageable pageable);

    boolean existsByMaKhachDaiDien(String maKhachDaiDien);

    // Enhanced search methods - exclude deleted tenants
    @Query("SELECT k FROM KhachThue k WHERE k.trangThai != :excludedStatus AND (" +
           "LOWER(k.hoTen) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "k.maCanCuoc LIKE CONCAT('%', :searchTerm, '%') OR " +
           "k.maKhachDaiDien LIKE CONCAT('%', :searchTerm, '%') OR " +
           "CONCAT('', k.maKhach) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<KhachThue> findByMultipleFields(String searchTerm, TrangThai excludedStatus, Pageable pageable);

    // Enhanced search methods - include all tenants
    @Query("SELECT k FROM KhachThue k WHERE " +
           "LOWER(k.hoTen) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "k.maCanCuoc LIKE CONCAT('%', :searchTerm, '%') OR " +
           "k.maKhachDaiDien LIKE CONCAT('%', :searchTerm, '%') OR " +
           "CONCAT('', k.maKhach) LIKE CONCAT('%', :searchTerm, '%')")
    Page<KhachThue> findByMultipleFieldsAll(String searchTerm, Pageable pageable);
}
