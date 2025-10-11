package com.so_tro_online.quan_ly_dich_vu_phong.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.service.IDichVuService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {
    @Autowired
    IDichVuService iDichVuService;
    @GetMapping("")
    public ResponseEntity<ApiResponse> getDichVu() {

        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.getDichVu()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateDichVu(@PathVariable Integer id, @RequestBody DichVuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.updateDichVu(id, request)));
    }

}
