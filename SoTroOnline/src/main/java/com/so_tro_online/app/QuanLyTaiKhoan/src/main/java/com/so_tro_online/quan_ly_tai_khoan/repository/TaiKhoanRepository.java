package com.so_tro_online.quan_ly_tai_khoan.repository;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, String> {
    @Query("SELECT u FROM TaiKhoan u WHERE u.email = :email AND u.matKhau = :matKhau")
    Optional<TaiKhoan> findByEmailAndMatKhau(String email, String matKhau);

    @Query("select u from TaiKhoan u where u.email = :email")
    TaiKhoan findByEmail(String email);

    /*@Query("select count(t) > 0 from TaiKhoan t where t.maTaiKhoan = :maTaiKhoan")
    boolean existByMaTaiKhoan(String maTaiKhoan);*/

}
