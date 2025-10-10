package com.so_tro_online.quan_ly_tai_khoan.config;

import com.so_tro_online.quan_ly_tai_khoan.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    public OAuth2SuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");
        String name = user.getAttribute("name");
        String token = jwtService.generateToken(email);

        System.out.println("OAuth2SuccessHandler - Email: " + email);
        System.out.println("OAuth2SuccessHandler - Name: " + name);
        System.out.println("OAuth2SuccessHandler - Token generated: " + (token != null));

        // Include user information in the redirect URL
        String redirectUrl = String.format("http://localhost:3000/auth/callback?token=%s&email=%s&name=%s",
            token,
            java.net.URLEncoder.encode(email, "UTF-8"),
            java.net.URLEncoder.encode(name != null ? name : "", "UTF-8")
        );

        response.sendRedirect(redirectUrl);
    }
}
