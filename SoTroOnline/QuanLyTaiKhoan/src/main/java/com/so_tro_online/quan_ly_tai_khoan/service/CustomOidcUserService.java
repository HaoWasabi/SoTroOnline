package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class CustomOidcUserService extends OidcUserService {
    private final TaiKhoanRepository taiKhoanRepository;

    public CustomOidcUserService(TaiKhoanRepository taiKhoanRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);
        String email = oidcUser.getEmail();

        System.out.println("OIDC - Processing email: " + email);

        if(taiKhoanRepository.findByEmail(email) == null) {
            System.out.println("OIDC - Email not found, creating new account");
            TaiKhoan newTaiKhoan = new TaiKhoan();
            newTaiKhoan.setEmail(email);
            newTaiKhoan.setNgayTao(LocalDateTime.now());
            newTaiKhoan.setTrangThai(TrangThai.hoatDong);

            // Set hoTen from Google profile if available
            String name = oidcUser.getFullName();
            if (name != null) {
                newTaiKhoan.setHoTen(name);
            }

            TaiKhoan savedAccount = taiKhoanRepository.save(newTaiKhoan);
            System.out.println("OIDC - Account saved with ID: " + savedAccount.getMaTaiKhoan());
        }

        return new DefaultOidcUser(
                Collections.singleton(new SimpleGrantedAuthority("USER")),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo()
        );
    }
}
