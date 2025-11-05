package com.so_tro_online.quan_ly_tai_khoan.controller;

import com.so_tro_online.dung_chung.dto.ApiResponse;
import com.so_tro_online.quan_ly_tai_khoan.dto.*;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.exception.*;
import com.so_tro_online.quan_ly_tai_khoan.mapper.UserMapper;
import com.so_tro_online.quan_ly_tai_khoan.service.GoogleService;
import com.so_tro_online.quan_ly_tai_khoan.service.JwtService;
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
    private final GoogleService googleService;
    private final JwtService jwtService;

    public QuanLyTaiKhoanController(
            TaiKhoanService taiKhoanService,
            GoogleService googleService,
            JwtService jwtService
    ) {
        this.taiKhoanService = taiKhoanService;
        this.googleService = googleService;
        this.jwtService = jwtService;
    }

    /**
     * Login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        ApiResponse<Object> response = new ApiResponse<>();
        
        try {
            LoginResponse loginResponse = taiKhoanService.authenticateUser(loginRequest);

            response.setStatus(200);
            response.setMessage("Login successful");
            response.setData(loginResponse);
            
            return ResponseEntity.ok(
                   response
            );
        } catch (Exception e) {
            logger.error("Login failed for email: {}", loginRequest.getEmail(), e);

            response.setStatus(401);
            response.setMessage("Invalid credentials");
            response.setData(null);
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                   response
            );
        }
    }

    /**
     * Refresh token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newAccessToken = taiKhoanService.refreshAccessToken(refreshToken);
            
            response.put("success", true);
            response.put("message", "Token refreshed successfully");
            response.put("data", Map.of("accessToken", newAccessToken));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            
            response.put("success", false);
            response.put("message", "Invalid refresh token");
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Get current user info using the new method
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            TaiKhoanDto userInfo = taiKhoanService.getCurrentUserInfo(token);
            
            response.put("success", true);
            response.put("message", "User info retrieved successfully");
            response.put("data", userInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to get user info", e);
            
            response.put("success", false);
            response.put("message", "Unable to retrieve user info");
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /*
        Password recovery request processing
     */
    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> body) {
        try {
            taiKhoanService.requestPasswordReset(body.get("email"));

            return ResponseEntity.ok(
                    new ApiResponse<>(200, "Password reset link has been sent to your email", null)
            );
        } catch (NoEmailFoundException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(404, "Email not found", null),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /*
        Validate reset token
    **/
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = taiKhoanService.validateResetToken(token);
            
            if (isValid) {
                return ResponseEntity.ok(
                        new ApiResponse<>(200, "Token is valid", null)
                );
            } else {
                return new ResponseEntity<>(
                        new ApiResponse<>(400, "Invalid or expired token", null),
                        HttpStatus.BAD_REQUEST
                );
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /*
        Reset password with token
    * */
    @PostMapping("/reset-password-with-token")
    public ResponseEntity<?> resetPasswordWithToken(@RequestBody ResetPasswordRequest request) {
        try {
            taiKhoanService.resetPasswordWithToken(request.getToken(), request.getNewPassword());

            return ResponseEntity.ok(
                    new ApiResponse<>(200, "Password reset successfully", null)
            );
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(400, ex.getMessage(), null),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PutMapping("/update-user-information")
    public ResponseEntity<?> updateUserInformation(@RequestBody TaiKhoanDto taiKhoanDTO) {
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

            return ResponseEntity.ok(new ApiResponse<>(200, "Updated information successfully", null));
        } catch (NoAccountFoundException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(404, "Your account is not exist", null),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /*
        parameters in request body:
        - maTaiKhoan
        - matKhauMoi
    */
    @PutMapping(value = "/change-password", consumes = "application/json")
    public ResponseEntity<?> updateAccountPassword(@RequestBody ChangePasswordRequest request) {
        try {

            taiKhoanService.updateAccountPassword(
                    request.getMaTaiKhoan(),
                    request.getMatKhauMoi()
            );

            return ResponseEntity.ok(new ApiResponse<>(200, "Updated password successfully", null));
        } catch (NoAccountFoundException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(404, "Your account is not exist", null),
                    HttpStatus.NOT_FOUND
            );
        } catch (InvalidPasswordException ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(409, "New password must be different from old password", null),
                    HttpStatus.CONFLICT
            );
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ApiResponse<>(500, "Internal server error", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Received Authorization header: " + authHeader);

            if (!authHeader.startsWith("Bearer ")) {
                return new ResponseEntity<>(
                        new ApiResponse<>(401, "Authorization header must start with 'Bearer '", null),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String token = authHeader.substring(7);
            System.out.println("Extracted token: " + token.substring(0, Math.min(20, token.length())) + "...");

            if (!jwtService.isTokenValid(token)) {
                System.out.println("Token validation failed");
                return new ResponseEntity<>(
                        new ApiResponse<>(401, "Token is invalid or expired", null),
                        HttpStatus.UNAUTHORIZED
                );
            }

            String email = jwtService.extractEmail(token);
            System.out.println("Extracted email from token: " + email);

            TaiKhoan taiKhoan = taiKhoanService.getUserByEmail(email);

            TaiKhoanDto userInfo = UserMapper.toDto(taiKhoan);

            return ResponseEntity.ok(new ApiResponse<>(200, "User information retrieved successfully", userInfo));
        } catch (NoEmailFoundException ex) {
            System.out.println("User not found for email");
            return new ResponseEntity<>(
                    new ApiResponse<>(404, "User not found", null),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception ex) {
            System.out.println("Error in getUserInfo: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(
                    new ApiResponse<>(401, "Invalid or expired token: " + ex.getMessage(), null),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }

}
