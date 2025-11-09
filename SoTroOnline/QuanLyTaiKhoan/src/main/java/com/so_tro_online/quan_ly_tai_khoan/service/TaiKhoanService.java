package com.so_tro_online.quan_ly_tai_khoan.service;

import com.so_tro_online.dung_chung.utils.SecureRandomString;
import com.so_tro_online.quan_ly_tai_khoan.dto.LoginRequest;
import com.so_tro_online.quan_ly_tai_khoan.dto.LoginResponse;
import com.so_tro_online.quan_ly_tai_khoan.dto.TaiKhoanDto;
import com.so_tro_online.quan_ly_tai_khoan.entity.PasswordResetToken;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai;
import com.so_tro_online.quan_ly_tai_khoan.exception.DuplicateEmailException;
import com.so_tro_online.quan_ly_tai_khoan.exception.InvalidPasswordException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoAccountFoundException;
import com.so_tro_online.quan_ly_tai_khoan.exception.NoEmailFoundException;
import com.so_tro_online.quan_ly_tai_khoan.mapper.UserMapper;
import com.so_tro_online.quan_ly_tai_khoan.repository.PasswordResetTokenRepository;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Service
public class TaiKhoanService {
    private static final Logger logger = LoggerFactory.getLogger(TaiKhoanService.class);
    
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Autowired
    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, 
                          PasswordResetTokenRepository passwordResetTokenRepository,
                          PasswordEncoder passwordEncoder, 
                          EmailService emailService, JwtService jwtService) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
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
    public void requestPasswordReset(String email) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);

        if(taiKhoan == null) {
            throw new NoEmailFoundException();
        }

        // Invalidate any existing tokens for this email
        passwordResetTokenRepository.markAllTokensAsUsedByEmail(email);

        // Generate a new reset token
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // Token expires in 1 hour

        PasswordResetToken passwordResetToken = new PasswordResetToken(resetToken, email, expiryDate);
        passwordResetTokenRepository.save(passwordResetToken);

        // Send reset link via email
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        emailService.sendPasswordResetLink(email, resetLink);
    }

    @Transactional
    public boolean validateResetToken(String token) {
        return passwordResetTokenRepository.findValidToken(token, LocalDateTime.now()).isPresent();
    }

    @Transactional
    public void resetPasswordWithToken(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findValidToken(token, LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(resetToken.getEmail());
        if (taiKhoan == null) {
            throw new NoEmailFoundException();
        }

        // Update password
        taiKhoan.setMatKhau(passwordEncoder.encode(newPassword));
        taiKhoanRepository.save(taiKhoan);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        logger.info("Password reset successfully for email: {}", resetToken.getEmail());
    }

    @Transactional
    public void updateUserInformation(
            int maTaiKhoan, String maCanCuoc, String email, String hoTen, String dienThoai, String thuongTru, Date ngaySinh
    ) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByMaTaiKhoan(maTaiKhoan).orElse(null);

        if(taiKhoan == null) {
            throw new NoAccountFoundException();
        }

        // Handle maCanCuoc safely (can be null for Google accounts)
        if (!java.util.Objects.equals(taiKhoan.getMaCanCuoc(), maCanCuoc)) {
            taiKhoan.setMaCanCuoc(maCanCuoc);
        }

        // Handle email safely
        if (!java.util.Objects.equals(taiKhoan.getEmail(), email)) {
            taiKhoan.setEmail(email);
        }

        // Handle hoTen safely
        if (!java.util.Objects.equals(taiKhoan.getHoTen(), hoTen)) {
            taiKhoan.setHoTen(hoTen);
        }

        // Handle dienThoai safely
        if (!java.util.Objects.equals(taiKhoan.getDienThoai(), dienThoai)) {
            taiKhoan.setDienThoai(dienThoai);
        }

        // Handle thuongTru safely
        if (!java.util.Objects.equals(taiKhoan.getThuongTru(), thuongTru)) {
            taiKhoan.setThuongTru(thuongTru);
        }

        // Handle ngaySinh safely
        if (!java.util.Objects.equals(taiKhoan.getNgaySinh(), ngaySinh)) {
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

    /**
     * Authenticate user with email and password and return LoginResponse with JWT token
     */
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        logger.info("Authenticating user: {}", loginRequest.getEmail());

        try {
            // Use existing signIn method for authentication
            TaiKhoan taiKhoan = signIn(loginRequest.getEmail(), loginRequest.getPassword());
            
            // Generate JWT tokens
            String accessToken = jwtService.generateToken(taiKhoan.getEmail());
            String refreshToken = generateRefreshToken(taiKhoan.getEmail());

            // Create user info
            TaiKhoanDto taiKhoanDTO = UserMapper.toDto(taiKhoan);
            
            return new LoginResponse(
                accessToken,
                refreshToken,
                3600, // 1 hour (can be configurable)
                taiKhoanDTO
            );
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getEmail(), e);
            throw new RuntimeException("Invalid credentials");
        }
    }

    /**
     * Authenticate OAuth2 user and return LoginResponse with JWT tokens
     */
    public LoginResponse authenticateOAuth2User(String email, String name) {
        logger.info("Authenticating OAuth2 user: {}", email);

        try {
            // Find or create user
            TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);
            
            if (taiKhoan == null) {
                // Create new user for OAuth2 login
                taiKhoan = new TaiKhoan();
                taiKhoan.setEmail(email);
                taiKhoan.setHoTen(name != null ? name : email.split("@")[0]);
                taiKhoan.setTrangThai(TrangThai.hoatDong);
                taiKhoan.setNgayTao(LocalDateTime.now());
                // OAuth2 users don't have passwords
                taiKhoan = taiKhoanRepository.save(taiKhoan);
                logger.info("Created new OAuth2 user: {}", email);
            }
            
            // Generate JWT tokens
            String accessToken = jwtService.generateToken(taiKhoan.getEmail());
            String refreshToken = generateRefreshToken(taiKhoan.getEmail());

            // Create user info
            TaiKhoanDto taiKhoanDTO = UserMapper.toDto(taiKhoan);
            
            return new LoginResponse(
                accessToken,
                refreshToken,
                3600, // 1 hour (can be configurable)
                taiKhoanDTO
            );
        } catch (Exception e) {
            logger.error("OAuth2 authentication failed for user: {}", email, e);
            throw new RuntimeException("OAuth2 authentication failed");
        }
    }

    /**
     * Refresh access token using refresh token
     */
    public String refreshAccessToken(String refreshToken) {
        try {
            // Extract email from refresh token (implement your own validation logic)
            String email = validateAndExtractEmailFromRefreshToken(refreshToken);
            
            // Generate new access token
            return jwtService.generateToken(email);
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            throw new RuntimeException("Invalid refresh token");
        }
    }

    /**
     * Get current user information from JWT token
     */
    public TaiKhoanDto getCurrentUserInfo(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                
                if (jwtService.isTokenValid(jwtToken)) {
                    String email = jwtService.extractEmail(jwtToken);
                    TaiKhoan taiKhoan = getUserByEmail(email);
                    
                    return UserMapper.toDto(taiKhoan);
                }
            }
            throw new RuntimeException("Invalid token");
        } catch (Exception e) {
            logger.error("Failed to get user info from token", e);
            throw new RuntimeException("Invalid token");
        }
    }

    /**
     * Generate refresh token
     */
    private String generateRefreshToken(String email) {
        // You can implement a more sophisticated refresh token generation
        // For now, using a simple approach
        return "refresh_" + email + "_" + System.currentTimeMillis();
    }

    /**
     * Validate refresh token and extract email
     */
    private String validateAndExtractEmailFromRefreshToken(String refreshToken) {
        // Implement your refresh token validation logic here
        // This is a simple implementation - you should use proper JWT for refresh tokens too
        if (refreshToken != null && refreshToken.startsWith("refresh_")) {
            String[] parts = refreshToken.split("_");
            if (parts.length >= 2) {
                return parts[1]; // Extract email from refresh token
            }
        }
        throw new RuntimeException("Invalid refresh token format");
    }
}
