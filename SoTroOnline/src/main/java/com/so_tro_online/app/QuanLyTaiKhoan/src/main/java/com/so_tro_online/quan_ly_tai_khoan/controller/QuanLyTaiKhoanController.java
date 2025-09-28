package com.so_tro_online.quan_ly_tai_khoan.controller;

import com.so_tro_online.quan_ly_tai_khoan.dto.SignInRequest;
import com.so_tro_online.quan_ly_tai_khoan.dto.SignUpRequest;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.exception.InvalidPasswordException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoEmailFoundException;
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class QuanLyTaiKhoanController {

    private static final Logger logger = LoggerFactory.getLogger(QuanLyTaiKhoanController.class);
    private final TaiKhoanService taiKhoanService;

    public QuanLyTaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody SignInRequest signInRequest) {
        Map<String, String> response = new HashMap<>();

        try {
            taiKhoanService.signIn(signInRequest.getEmail(), signInRequest.getPassword());

            response.put("status", "200");
            response.put("message", "Sign in successfully");

            return ResponseEntity.ok(response);
        } catch(NoEmailFoundException ex) {
            response.put("status", "404");
            response.put("message", "Account is not exist");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }catch(InvalidPasswordException ex) {
            response.put("status", "404");
            response.put("message", "Wrong account or password");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch(Exception ex) {
            response.put("status", "500");
            response.put("message", "Internal server error: " + ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SignUpRequest signUpRequest) {
        Map<String, String> response = new HashMap<>();

        //logger.info("Received signup request for email: {}", signUpRequest != null ? signUpRequest.getEmail() : "null request");
        try {
            /*// Add detailed logging for debugging
            logger.info("SignUp request details - Email: {}, Password: {}, HoTen: {}, DienThoai: {}, NgaySinh: {}, TrangThai: {}, CccdCode: {}, ThuongTru: {}",
                signUpRequest.getEmail(),
                signUpRequest.getPassword() != null ? "***" : "null",
                signUpRequest.getHoTen(),
                signUpRequest.getDienThoai(),
                signUpRequest.getNgaySinh(),
                signUpRequest.getTrangThai(),
                signUpRequest.getCccdCode(),
                signUpRequest.getThuongTru());*/

            LocalDateTime ngayTao = LocalDateTime.now();
            taiKhoanService.signUp(
                   signUpRequest.getEmail(),
                   signUpRequest.getCccdCode(),
                   signUpRequest.getHoTen(),
                   signUpRequest.getDienThoai(),
                   signUpRequest.getThuongTru(),
                   signUpRequest.getNgaySinh(),
                   signUpRequest.getPassword(),
                   ngayTao,
                   signUpRequest.getTrangThai()
            );

            response.put("status", "200");
            response.put("message", "Account is signed in successfully");

           return ResponseEntity.ok(response);
        } catch(DuplicateEmailException ex) {
            response.put("status", "409");
            response.put("message", "Account with this email is already exist!");

            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }catch(HttpMessageNotReadableException ex) {
            logger.error("JSON parsing error: {}", ex.getMessage());
            response.put("status", "400");
            response.put("message", "Error JSON format");

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch(Exception ex) {
            logger.error("Unexpected error during signup: ", ex);
            response.put("status", "500");
            response.put("message", "Internal server error: " + ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
