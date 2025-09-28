package com.so_tro_online.exception;

import com.so_tro_online.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandle {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleReviewNotFoundException(RuntimeException ex, WebRequest request) {
        return ResponseEntity.status(500).body(new ApiResponse(ex.getMessage(), null));
    }
}
