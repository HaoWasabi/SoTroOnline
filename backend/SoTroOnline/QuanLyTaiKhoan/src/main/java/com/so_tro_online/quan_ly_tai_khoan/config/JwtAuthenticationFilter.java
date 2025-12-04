package com.so_tro_online.quan_ly_tai_khoan.config;

import com.so_tro_online.quan_ly_tai_khoan.service.JwtService;
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ApplicationContext applicationContext;
    private TaiKhoanService taiKhoanService; // Will be initialized lazily

    public JwtAuthenticationFilter(JwtService jwtService, ApplicationContext applicationContext) {
        this.jwtService = jwtService;
        this.applicationContext = applicationContext;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        String requestURI = request.getRequestURI();
        logger.debug("JwtAuthenticationFilter - Processing request: " + requestURI);
        
        // Skip JWT authentication for non-API routes
        if (!requestURI.startsWith("/api/")) {
            logger.debug("JwtAuthenticationFilter - Skipping JWT check for non-API route: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        logger.debug("JwtAuthenticationFilter - Authorization header: " + authHeader);

        // Check if Authorization header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("JwtAuthenticationFilter - No valid Authorization header found, continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        jwt = authHeader.substring(7);
        logger.debug("JwtAuthenticationFilter - Extracted JWT token: " + jwt.substring(0, Math.min(20, jwt.length())) + "...");

        try {
            // Extract email from JWT
            userEmail = jwtService.extractEmail(jwt);
            logger.debug("JwtAuthenticationFilter - Extracted email: " + userEmail);

            // If email exists and no authentication is set in SecurityContext
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("JwtAuthenticationFilter - Validating token for user: " + userEmail);

                // Validate token
                if (jwtService.isTokenValid(jwt)) {
                    logger.debug("JwtAuthenticationFilter - Token is valid, getting user from database");

                    // Lazy initialization of TaiKhoanService to avoid circular dependency
                    if (taiKhoanService == null) {
                        taiKhoanService = applicationContext.getBean(TaiKhoanService.class);
                    }

                    // Get user from database
                    TaiKhoan taiKhoan = taiKhoanService.getUserByEmail(userEmail);

                    if (taiKhoan != null) {
                        logger.debug("JwtAuthenticationFilter - User found, setting authentication");
                        // Create authentication token
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userEmail,
                                null,
                                new ArrayList<>() // You can add authorities here if needed
                        );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Set authentication in SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("JwtAuthenticationFilter - Authentication set successfully for user: " + userEmail);
                    } else {
                        logger.debug("JwtAuthenticationFilter - User not found in database for email: " + userEmail);
                    }
                } else {
                    logger.debug("JwtAuthenticationFilter - Token validation failed");
                }
            } else {
                logger.debug("JwtAuthenticationFilter - Email is null or authentication already exists");
            }
        } catch (Exception e) {
            // Log error but continue with filter chain
            logger.error("JWT authentication failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
