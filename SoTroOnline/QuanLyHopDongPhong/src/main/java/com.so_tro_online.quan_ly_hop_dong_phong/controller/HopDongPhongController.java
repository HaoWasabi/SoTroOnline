package com.so_tro_online.quan_ly_hop_dong_phong.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/hop-dong-phong")
public class HopDongPhongController {
    
    // Simple test endpoint to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "success");
        response.put("data", "HopDongPhongController is working!");
        return ResponseEntity.ok(response);
    }
    
    // Mock implementation with sample contract data for testing
    @GetMapping("/active/paged")
    public ResponseEntity<Map<String, Object>> getActivePaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        
        // Create sample contract data for testing
        List<Map<String, Object>> allContracts = createSampleContracts();
        
        // Simple pagination logic
        int start = page * size;
        int end = Math.min(start + size, allContracts.size());
        List<Map<String, Object>> pageContent = start < allContracts.size() ? 
            allContracts.subList(start, end) : new ArrayList<>();
        
        // Create response structure
        Map<String, Object> response = new HashMap<>();
        response.put("message", "success");
        
        Map<String, Object> data = new HashMap<>();
        data.put("content", pageContent);
        data.put("page", page);
        data.put("size", size);
        data.put("totalElements", allContracts.size());
        data.put("totalPages", (int) Math.ceil((double) allContracts.size() / size));
        data.put("first", page == 0);
        data.put("last", end >= allContracts.size());
        
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    private List<Map<String, Object>> createSampleContracts() {
        List<Map<String, Object>> contracts = new ArrayList<>();
        
        // Sample contract data based on your database
        String[] tenants = {"Nguyễn Văn B", "Trần Thị C", "Lê Văn D", "Phạm Thị E", "Hoàng Văn F"};
        String[] managers = {"Admin User", "Quản lý 1", "Quản lý 2"};
        String[] rooms = {"Phòng 1", "Phòng 2", "Phòng 4", "Phòng 6", "Phòng 8", "Phòng 9", "Phòng 12"};
        String[] addresses = {"Số 1 - Hà Nội", "Số 2 - Hà Nội", "Số 4 - Hà Nội", "Số 6 - HCM", "Số 8 - HCM"};
        
        for (int i = 1; i <= 15; i++) {
            Map<String, Object> contract = new HashMap<>();
            contract.put("maHopDongPhong", i);
            contract.put("maTaiKhoan", (i % 3) + 1);
            contract.put("tenQuanLy", managers[i % managers.length]);
            contract.put("maKhachThue", (i % 5) + 2);
            contract.put("tenKhachThue", tenants[i % tenants.length]);
            contract.put("maPhong", i);
            contract.put("tenPhong", rooms[i % rooms.length]);
            contract.put("tienPhong", 1200000 + (i * 50000));
            contract.put("tienCoc", 2400000 + (i * 100000));
            contract.put("dvRac", true);
            contract.put("dvWifi", i % 2 == 0);
            contract.put("dvCap", i % 3 == 0);
            contract.put("dvKhac", false);
            contract.put("ngayBatDau", "2024-" + String.format("%02d", (i % 12) + 1) + "-15");
            contract.put("ngayKetThuc", "2025-" + String.format("%02d", (i % 12) + 1) + "-14");
            contract.put("ngayTao", "2024-" + String.format("%02d", (i % 12) + 1) + "-10");
            contract.put("trangThai", "hoatDong");
            
            contracts.add(contract);
        }
        
        return contracts;
    }
}