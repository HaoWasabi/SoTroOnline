package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.dung_chung.utils.SecureRandomString;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.exception.InvalidPasswordException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoAccountFoundException;
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
    private final EmailService emailService;

    @Autowired
    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public TaiKhoan signIn(String email, String password) {

        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);

        if(taiKhoan== null) {
            throw new NoEmailFoundException();
        }

        if(!(taiKhoan.getMatKhau() != null && passwordEncoder.matches(password, taiKhoan.getMatKhau()))) {
            throw new InvalidPasswordException();
        }

        return taiKhoan;
    }

    @Transactional
    public TaiKhoan signUp(
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

        return newTaiKhoan;
    }

    @Transactional
    public void requestTemporaryPassword(String email) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);

        if(taiKhoan == null) {
            throw new NoEmailFoundException();
        }

        String randomString = SecureRandomString.generate(12);

        taiKhoan.setMatKhau(passwordEncoder.encode(randomString));
        taiKhoanRepository.save(taiKhoan);
        emailService.sendTemporaryPassword(email, randomString);
    }

    @Transactional
    public void updateUserInformation(
            int maTaiKhoan, String maCanCuoc, String email, String hoTen, String dienThoai, String thuongTru, Date ngaySinh
    ) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByMaTaiKhoan(maTaiKhoan).orElse(null);

        if(taiKhoan == null) {
            throw new NoAccountFoundException();
        }

        if(taiKhoan.getMaCanCuoc().equals(maCanCuoc)) {
            taiKhoan.setMaCanCuoc(maCanCuoc);
        }

        if(!taiKhoan.getEmail().equals(email)) {
            taiKhoan.setEmail(email);
        }

        if(!taiKhoan.getHoTen().equals(hoTen)) {
            taiKhoan.setHoTen(hoTen);
        }

        if(!taiKhoan.getDienThoai().equals(dienThoai)) {
            taiKhoan.setDienThoai(dienThoai);
        }

        if(!taiKhoan.getThuongTru().equals(thuongTru)) {
            taiKhoan.setThuongTru(thuongTru);
        }

        if(!taiKhoan.getNgaySinh().equals(ngaySinh)) {
            taiKhoan.setNgaySinh(ngaySinh);
        }

        taiKhoanRepository.save(taiKhoan);
    }

    @Transactional
    public void updateAccountPassword(int maTaiKhoan, String newPassword) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByMaTaiKhoan(maTaiKhoan).orElse(null);

        if(taiKhoan == null) {
            throw new NoAccountFoundException();
        }

        if(passwordEncoder.matches(newPassword, taiKhoan.getMatKhau())) {
            throw new InvalidPasswordException();
        }

        taiKhoan.setMatKhau(passwordEncoder.encode(newPassword));
        taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan getUserByEmail(String email) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);
        if(taiKhoan == null) {
            throw new NoEmailFoundException();
        }
        return taiKhoan;
    }
}
