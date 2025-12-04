package com.so_tro_online.quan_ly_dich_vu_phong.repository;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu,Integer> {
    
    @Query("SELECT d FROM DichVu d ORDER BY d.maDichVu ASC")
    Page<DichVu> findAllOrderById(Pageable pageable);
    
    @Query("SELECT d FROM DichVu d ORDER BY d.maDichVu ASC")
    List<DichVu> findAllOrderById();
    
    // Find the first available record
    @Query("SELECT d FROM DichVu d ORDER BY d.maDichVu ASC LIMIT 1")
    Optional<DichVu> findFirst();
}
