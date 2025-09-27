package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.exception.InvalidPasswordException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoEmailFoundException;
import com.so_tro_online.quan_ly_tai_khoan.mapper.UserMapper;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TaiKhoan signIn(String email, String password) {
        String emailTaiKhoan = taiKhoanRepository.findByEmail(email);

        if(emailTaiKhoan == null) {
            throw new NoEmailFoundException("Khong tim thay tai khoan voi email!");
        }

        TaiKhoan taiKhoan = taiKhoanRepository.findByEmailAndMatKhau(email, password).orElse(null);

        if(taiKhoan == null) {
            throw new InvalidPasswordException("Sai tai khoan hoac mat khau!");
        }

        return taiKhoan;
    }

    public void signUp(
            String email,
            String cccdCode,
            String hoTen,
            String dienThoai,
            String thuongTru,
            Date ngaySinh,
            String matKhau,
            TrangThai trangThai
    ) {
        String accountRetrievedByEmail = taiKhoanRepository.findByEmail(email);

        if(accountRetrievedByEmail != null) {
            throw new DuplicateEmailException("Email is already exist!");
        }

        String encodedPassword = passwordEncoder.encode(matKhau);
        TaiKhoan newTaiKhoan = UserMapper.toEntity(
                email, cccdCode, hoTen, dienThoai, thuongTru, ngaySinh, matKhau, trangThai
        );

        taiKhoanRepository.save(newTaiKhoan);
    }


}
