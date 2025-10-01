package com.so_tro_online.quan_ly_dich_vu_phong.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.service.IDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {
    @Autowired
    IDichVuService iDichVuService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllDichVu() {

        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.getAllDichVu()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponse>getAllDichVuActive() {

        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.getAllDichVuActive()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.getDichVuById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponse>getDichVuActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.getDichVuActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createDichVu(@RequestBody DichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success", iDichVuService.createDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateDichVu(@PathVariable Integer id, @RequestBody DichVuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", iDichVuService.updateDichVu(id, request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>deleteDichVu(@PathVariable Integer id) {
        iDichVuService.deleteDichVu(id);
        return ResponseEntity.ok(new ApiResponse("success", null));
    }
}
