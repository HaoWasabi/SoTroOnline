package com.so_tro_online.dung_chung.exception;

import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandle {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseV2> handleReviewNotFoundException(RuntimeException ex, WebRequest request) {
        return ResponseEntity.status(500).body(new ApiResponseV2(ex.getMessage(), null));
    }
}