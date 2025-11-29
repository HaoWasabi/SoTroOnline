package com.so_tro_online.quan_ly_hop_dong_phong.controller;

import com.so_tro_online.quan_ly_hop_dong_phong.service.EmailRentRoomService;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

// @RestController // Disabled for production
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private EmailRentRoomService emailRentRoomService;

    @PostMapping("/send-test-email")
    public ResponseEntity<String> sendTestEmail() {
        return sendTestEmailInternal();
    }
    
    @GetMapping("/send-test-email")
    public ResponseEntity<String> sendTestEmailGet() {
        return sendTestEmailInternal();
    }
    
    private ResponseEntity<String> sendTestEmailInternal() {
        try {
            // Create a test RentRoomMessage
            RentRoomMessage testMessage = new RentRoomMessage();
            testMessage.setMaHopDongPhong(999);
            testMessage.setTienPhong(BigDecimal.valueOf(1000000.0));
            testMessage.setTienCoc(BigDecimal.valueOf(100000.0));
            testMessage.setNgayBatDau(LocalDate.now());
            testMessage.setNgayKetThuc(LocalDate.now().plusMonths(12));
            
            // Create test room
            Phong testPhong = new Phong();
            testPhong.setTenPhong("Test Room");
            testPhong.setLoaiPhong("Standard");
            testPhong.setDiaChi("123 Test Street");
            testPhong.setChieuDai(BigDecimal.valueOf(4.0));
            testPhong.setChieuRong(BigDecimal.valueOf(3.0));
            testPhong.setVatDung("Bed, Table, Chair");
            testMessage.setPhong(testPhong);
            
            // Create test manager account
            TaiKhoan testTaiKhoan = new TaiKhoan();
            testTaiKhoan.setHoTen("Test Manager");
            testTaiKhoan.setEmail("manager@test.com");
            testMessage.setTaiKhoan(testTaiKhoan);

            KhachThue tenant1 = new KhachThue();
            tenant1.setHoTen("Nguyen Xuan Phu");
            tenant1.setEmail("nguyenxuanphu204@gmail.com");
            tenant1.setMaKhach(2);
            
            List<KhachThue> testTenants = Arrays.asList(tenant1);
            testMessage.setKhachThue(testTenants);
            
            // Send test email
            emailRentRoomService.sendConfirmRentRoom(testMessage);
            
            return ResponseEntity.ok("Test email sent successfully! Check the logs and your Gmail inbox.");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send test email: " + e.getMessage());
        }
    }
}