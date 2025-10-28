package com.so_tro_online.quan_ly_khach_thue.repository;

import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachThueRepository extends JpaRepository<KhachThue, Integer> {

    boolean existsByMaCanCuoc(String maCanCuoc);

    Page<KhachThue> findByHoTenContainingIgnoreCase(String hoTen, Pageable pageable);
}
