package com.so_tro_online.quan_ly_tai_khoan.config;

import com.so_tro_online.quan_ly_tai_khoan.dto.LoginResponse;
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final ApplicationContext applicationContext;
    private TaiKhoanService taiKhoanService; // Will be initialized lazily

    public OAuth2SuccessHandler(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");
        String name = user.getAttribute("name");

        System.out.println("OAuth2SuccessHandler - Email: " + email);
        System.out.println("OAuth2SuccessHandler - Name: " + name);

        try {
            // Lazy initialization of TaiKhoanService to avoid circular dependency
            if (taiKhoanService == null) {
                taiKhoanService = applicationContext.getBean(TaiKhoanService.class);
            }

            // Use the new OAuth2 authentication method to get both tokens
            LoginResponse loginResponse = taiKhoanService.authenticateOAuth2User(email, name);
            
            System.out.println("OAuth2SuccessHandler - Tokens generated successfully");
            System.out.println("  - Access Token: " + (loginResponse.getAccessToken() != null));
            System.out.println("  - Refresh Token: " + (loginResponse.getRefreshToken() != null));

            // Include both tokens and user information in the redirect URL
            String redirectUrl = String.format("http://localhost:3000/auth/callback?accessToken=%s&refreshToken=%s&email=%s&name=%s",
                URLEncoder.encode(loginResponse.getAccessToken(), "UTF-8"),
                URLEncoder.encode(loginResponse.getRefreshToken(), "UTF-8"),
                URLEncoder.encode(email, "UTF-8"),
                URLEncoder.encode(name != null ? name : "", "UTF-8")
            );

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            System.err.println("OAuth2SuccessHandler - Error: " + e.getMessage());
            e.printStackTrace();
            
            // Redirect to error page
            response.sendRedirect("http://localhost:3000/login-page?error=oauth2_failed");
        }
    }
}
