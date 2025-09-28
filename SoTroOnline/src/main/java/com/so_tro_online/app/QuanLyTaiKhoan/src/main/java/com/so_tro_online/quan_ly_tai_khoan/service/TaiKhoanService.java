package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.exception.InvalidPasswordException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoEmailFoundException;
import com.so_tro_online.quan_ly_tai_khoan.mapper.UserMapper;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Service
public class TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signIn(String email, String password) {

        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);

        if(taiKhoan== null) {
            throw new NoEmailFoundException();
        }

        if(!(taiKhoan.getMatKhau() != null && passwordEncoder.matches(password, taiKhoan.getMatKhau()))) {
            throw new InvalidPasswordException();
        }

    }

    @Transactional
    public void signUp(
            String email,
            String cccdCode,
            String hoTen,
            String dienThoai,
            String thuongTru,
            Date ngaySinh,
            String matKhau,
            LocalDateTime ngayTao,
            TrangThai trangThai
    ) {
        TaiKhoan accountRetrievedByEmail = taiKhoanRepository.findByEmail(email);

        if(accountRetrievedByEmail != null) {
            throw new DuplicateEmailException();
        }

        String encodedPassword = passwordEncoder.encode(matKhau);
        TaiKhoan newTaiKhoan = UserMapper.toEntity(
                email, cccdCode, hoTen, dienThoai, thuongTru, ngaySinh, encodedPassword, ngayTao, trangThai
        );

        taiKhoanRepository.save(newTaiKhoan);
    }


}
