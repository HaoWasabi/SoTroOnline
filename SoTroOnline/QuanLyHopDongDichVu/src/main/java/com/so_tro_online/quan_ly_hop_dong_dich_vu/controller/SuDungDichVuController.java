package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;


import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.service.ISuDungDichVuService;
// Import for user authentication
import com.so_tro_online.quan_ly_tai_khoan.service.TaiKhoanService;
import com.so_tro_online.quan_ly_tai_khoan.dto.TaiKhoanDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-using")
public class SuDungDichVuController {
    private final ISuDungDichVuService suDungDichVuService;
    
    @Autowired
    private TaiKhoanService taiKhoanService;

    public SuDungDichVuController(ISuDungDichVuService suDungDichVuService) {
        this.suDungDichVuService = suDungDichVuService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAllSuDungDichVu() {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVu()));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2> getAllSuDungDichVuActiveByUser(@RequestHeader("Authorization") String token) {
        try {
            // Get current user from token
            TaiKhoanDto currentUser = taiKhoanService.getCurrentUserInfo(token);
            
            // Use manager-specific method for better performance with direct ma_quan_ly filtering
            return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVuActiveByManager(currentUser.getMaTaiKhoan())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manager/{maQuanLy}")
    public ResponseEntity<ApiResponseV2> getAllSuDungDichVuActiveByManager(@PathVariable Integer maQuanLy, @RequestHeader("Authorization") String token) {
        try {
            // Get current user from token for authorization check
            TaiKhoanDto currentUser = taiKhoanService.getCurrentUserInfo(token);
            
            // Ensure user can only access their own data (SAAS security)
            if (!(currentUser.getMaTaiKhoan() == maQuanLy)) {
                return ResponseEntity.status(403).body(new ApiResponseV2("error", "Access denied: You can only access your own service usage data"));
            }
            
            // Use manager-specific method for direct ma_quan_ly filtering
            return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVuActiveByManager(maQuanLy)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getHopDongDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getSuDungDichVu(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponseV2>createHopDongDichVu(@RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success",suDungDichVuService.createSuDungDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseV2>updateHopDongDichVu(@PathVariable Integer id, @RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.updateSuDungDichVu(id,request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseV2>deleteHopDongDichVu(@PathVariable Integer id) {
        suDungDichVuService.deleteSuDungDichVu(id);
        return ResponseEntity.ok(new ApiResponseV2("success", null));
    }
    @GetMapping("/room/{maPhong}")
    public ResponseEntity<ApiResponseV2>getAllSuDungDichVuActiveByPhong(@PathVariable Integer maPhong) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVuActiveByPhong(maPhong)));
    }
}
