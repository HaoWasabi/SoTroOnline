package com.so_tro_online.quan_ly_tai_khoan.repository;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan,Integer> {
    @Query("select u from TaiKhoan u where u.email = ?1 and u.matKhau = ?2")
    Optional<TaiKhoan> findByEmailAndMatKhau(String email, String matKhau);

    @Query("select email from TaiKhoan u where u.email = ?1")
    String findByEmail(String email);

    Optional<TaiKhoan> findByMaTaiKhoanAndTrangThai(Integer maQuanLy, TrangThai trangThai);
}
