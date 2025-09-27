package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.quan_ly_tai_khoan.entity.Account;
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
public class AccountService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Account signIn(String email, String password) {
        String emailTaiKhoan = taiKhoanRepository.findByEmail(email);

        if(emailTaiKhoan == null) {
            throw new NoEmailFoundException("Khong tim thay tai khoan voi email!");
        }

        Account account = taiKhoanRepository.findByEmailAndMatKhau(email, password).orElse(null);

        if(account == null) {
            throw new InvalidPasswordException("Sai tai khoan hoac mat khau!");
        }

        return account;
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
        Account newAccount = UserMapper.toEntity(
                email, cccdCode, hoTen, dienThoai, thuongTru, ngaySinh, matKhau, trangThai
        );

        taiKhoanRepository.save(newAccount);
    }


}
