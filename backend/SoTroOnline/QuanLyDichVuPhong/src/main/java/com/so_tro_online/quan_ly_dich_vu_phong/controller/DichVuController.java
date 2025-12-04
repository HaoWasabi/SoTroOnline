package com.so_tro_online.quan_ly_dich_vu_phong.controller;


import com.so_tro_online.dung_chung.dto.ApiResponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.service.IDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/service")
@CrossOrigin(origins = "http://localhost:3000")
public class DichVuController {
    @Autowired
    IDichVuService iDichVuService;
    
    @GetMapping("")
    public ResponseEntity<ApiResponse<DichVuReponse>> getDichVu() {
        DichVuReponse data = iDichVuService.getDichVu();
        return ResponseEntity.ok(new ApiResponse<>(200, "success", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DichVuReponse>> updateDichVu(@PathVariable Integer id, @RequestBody DichVuRequest request) {
        DichVuReponse data = iDichVuService.updateDichVu(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "success", data));
    }

}