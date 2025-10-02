package com.so_tro_online.quan_ly_tai_khoan.controller;

import com.so_tro_online.quan_ly_tai_khoan.dto.SignInRequest;
import com.so_tro_online.quan_ly_tai_khoan.dto.SignUpRequest;
import com.so_tro_online.quan_ly_tai_khoan.dto.TaiKhoanDTO;
import com.so_tro_online.quan_ly_tai_khoan.dto.ApiResponse;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.exception.*;
import com.so_tro_online.quan_ly_tai_khoan.mapper.UserMapper;
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.sql.Date;
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
    public ResponseEntity<?> signIn(@RequestBody SignInRequest signInRequest) {
        try {
            TaiKhoan taiKhoan = taiKhoanService.signIn(signInRequest.getEmail(), signInRequest.getPassword());

            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    200,
                    "Log in successfully",
                    UserMapper.toDto(taiKhoan)
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.OK);
        } catch(NoEmailFoundException ex) {
            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    404,
                    "Account is not exist",
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
        }catch(InvalidPasswordException ex) {
            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    409,
                    "Wrong account or password",
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
        } catch(Exception ex) {
            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    409,
                    "Internal server error",
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        //logger.info("Received signup request for email: {}", signUpRequest != null ? signUpRequest.getEmail() : "null request");
        try {

            LocalDateTime ngayTao = LocalDateTime.now();
            TaiKhoan newTaiKhoan = taiKhoanService.signUp(
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

            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    200,
                    "Sign up successfully",
                    UserMapper.toDto(newTaiKhoan)
            );

           return ResponseEntity.ok(apiResponse);
        } catch(DuplicateEmailException ex) {
            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    409,
                    "Account with this email is already exist!",
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.CONFLICT);
        }catch(HttpMessageNotReadableException ex) {
            logger.error("JSON parsing error: {}", ex.getMessage());

            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    400,
                    "Error JSON format",
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
        } catch(Exception ex) {
            logger.error("Unexpected error during signup: ", ex);

            ApiResponse<TaiKhoanDTO> apiResponse = new ApiResponse<>(
                    409,
                    "Internal server error: " + ex.getMessage(),
                    null
            );

            return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {

        try {
            taiKhoanService.requestTemporaryPassword(body.get("email"));

            return ResponseEntity.ok(
                    new ApiResponse<>(200, "New temporary password are sent to your email", null)
            );
        }catch (EmailSendFailedException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(200, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PutMapping("/update-user-information")
    public ResponseEntity<?> udateUserInformation(@RequestBody TaiKhoanDTO taiKhoanDTO) {
        try {
           taiKhoanService.updateUserInformation(
                   taiKhoanDTO.getMaTaiKhoan(),
                   taiKhoanDTO.getMaCanCuoc(),
                   taiKhoanDTO.getEmail(),
                   taiKhoanDTO.getHoTen(),
                   taiKhoanDTO.getDienThoai(),
                   taiKhoanDTO.getThuongTru(),
                   Date.valueOf(taiKhoanDTO.getNgaySinh())
           );

           return ResponseEntity.ok( new ApiResponse<>(200, "Updated information successfully", null));
        }catch (NoAccountFoundException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(404, "Your account is not exist", null),
                    HttpStatus.NOT_FOUND
            );
        }catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
