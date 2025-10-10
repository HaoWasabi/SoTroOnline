package com.so_tro_online.quan_ly_tai_khoan.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class GoogleService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final JwtService jwtService;

    @Value("${GOOGLE_CLIENT_ID}")
    private String GOOGLE_CLIENT_ID;

    public GoogleService(TaiKhoanRepository taiKhoanRepository, JwtService jwtService) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.jwtService = jwtService;
    }

    public TaiKhoan verifyGoogleTokenAndGenerateJwt(String token) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        ).setAudience(Collections.singletonList(GOOGLE_CLIENT_ID)).build();

        try {
            GoogleIdToken idToken = verifier.verify(token);

            if(idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                if(taiKhoanRepository.findByEmail(email) != null) {
                    TaiKhoan newTaiKhoan = new TaiKhoan();
                    newTaiKhoan.setEmail(email);
                    taiKhoanRepository.save(newTaiKhoan);
                    return newTaiKhoan;
                }else {
                    throw new DuplicateEmailException();
                }
            }

            return null;
        } catch(Exception ex) {
            throw new RuntimeException("Invalid ID token", ex);
        }
    }
}
