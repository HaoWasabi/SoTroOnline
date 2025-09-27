package com.so_tro_online.quan_ly_tai_khoan.controller;

import com.so_tro_online.quan_ly_tai_khoan.dto.SignUpRequest;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoEmailFoundException;
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class QuanLyTaiKhoanController {

    private final TaiKhoanService taiKhoanService;

    public QuanLyTaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, World!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test method";
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest signUpRequest) {
        try {
            taiKhoanService.signUp(
                   signUpRequest.getEmail(),
                   signUpRequest.getCccdCode(),
                   signUpRequest.getHoTen(),
                   signUpRequest.getDienThoai(),
                   signUpRequest.getThuongTru(),
                   signUpRequest.getNgaySinh(),
                   signUpRequest.getMatKhau(),
                   signUpRequest.getTrangThai()
            );
           return new ResponseEntity<>("Your account is created successfully", HttpStatus.OK);
        } catch(NoEmailFoundException ex) {
            return new ResponseEntity<>("Email is already exist", HttpStatus.CONFLICT);
        } catch(Exception ex) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
