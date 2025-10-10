package com.so_tro_online.quan_ly_hoa_don.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_hoa_don.service.IHoaDonService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/hoa-don")
public class HoaDonController {
    private final IHoaDonService hoaDonService;

    public HoaDonController(IHoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllHoaDon() {

        return ResponseEntity.ok(new ApiResponse("success", hoaDonService.getAllHoaDon()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getHoaDonById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success",hoaDonService.getHoaDonById(id)));
    }


    @GetMapping
    public ResponseEntity<ApiResponse>getHoaDonByDate(@RequestParam Integer thang,@RequestParam Integer nam) {
        return ResponseEntity.ok(new ApiResponse("success",hoaDonService.getHoaDonByDate(thang, nam)));
    }
}
