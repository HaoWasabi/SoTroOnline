package com.so_tro_online.quan_ly_tai_khoan.repository;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan,Integer> {
    Optional<TaiKhoan> findByMaTaiKhoanAndTrangThai(Integer maQuanLy, TrangThai trangThai);
}
