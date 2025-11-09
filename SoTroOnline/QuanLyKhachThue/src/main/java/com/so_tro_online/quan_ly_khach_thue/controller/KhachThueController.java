package com.so_tro_online.quan_ly_khach_thue.controller;

import com.so_tro_online.dung_chung.dto.ApiResponse;
import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueDto;
import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueRequest;
import com.so_tro_online.quan_ly_khach_thue.service.KhachThueService;
import com.so_tro_online.quan_ly_khach_thue.exception.DuplicateCanCuocException;
import com.so_tro_online.quan_ly_khach_thue.exception.InvalidKhachThueDataException;
import com.so_tro_online.quan_ly_khach_thue.exception.KhachThueNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "http://localhost:3000")
public class KhachThueController {

    private static final Logger logger = LoggerFactory.getLogger(KhachThueController.class);

    @Autowired
    private KhachThueService khachThueService;
    
    /**
     * Create a new tenant
     */
    @PostMapping("/create")
    public ResponseEntity<?> createKhachThue(@RequestBody KhachThueRequest khachThueRequest) {
        try {
            KhachThueDto newKhachThue = khachThueService.createKhachThue(khachThueRequest);
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.CREATED.value(),
                    "Tenant created successfully",
                    newKhachThue
            );
            return new ResponseEntity<>(
                    response,
                    HttpStatus.CREATED
            );
        } catch (DuplicateCanCuocException e) {
            return new ResponseEntity<>(
                     new ApiResponse<>(
                            HttpStatus.CONFLICT.value(),
                            e.getMessage(),
                            null
                     ),
                     HttpStatus.CONFLICT
            );
        } catch (InvalidKhachThueDataException e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(
                            HttpStatus.BAD_REQUEST.value(),
                            e.getMessage(),
                            null
                    ),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Internal server error: ",
                            null
                    ),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get tenant by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getKhachThueById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            KhachThueDto khachThue = khachThueService.getKhachThueById(id);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            HttpStatus.OK.value(),
                            "Retrieved tenant successfully",
                            khachThue
                    )
            );
        } catch (KhachThueNotFoundException e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(
                            HttpStatus.NOT_FOUND.value(),
                            e.getMessage(),
                            null
                    ),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Internal server error: " + e.getMessage(),
                            null
                    ),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all tenants with pagination - including both active and deleted
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllKhachThue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        logger.info("Received request for getAllKhachThue with page: {}, search: {}, status: {}", page, search, status);
        Map<String, Object> response = new HashMap<>();
        try {
            Page<KhachThueDto> khachThuePage;

            if (search != null && !search.trim().isEmpty()) {
                khachThuePage = khachThueService.searchKhachThue(search.trim(), page);
            } else if (status != null && !status.trim().isEmpty()) {
                // Filter by status if provided
                if ("active".equalsIgnoreCase(status.trim()) || "hoatDong".equalsIgnoreCase(status.trim())) {
                    khachThuePage = khachThueService.getActiveKhachThue(page);
                } else if ("deleted".equalsIgnoreCase(status.trim()) || "daXoa".equalsIgnoreCase(status.trim())) {
                    khachThuePage = khachThueService.getDeletedKhachThue(page);
                } else {
                    khachThuePage = khachThueService.getAllKhachThue(page);
                }
            } else {
                khachThuePage = khachThueService.getAllKhachThue(page);
            }

            Map<String, Object> pageInfo = new HashMap<>();
            pageInfo.put("content", khachThuePage.getContent());
            pageInfo.put("totalElements", khachThuePage.getTotalElements());
            pageInfo.put("totalPages", khachThuePage.getTotalPages());
            pageInfo.put("currentPage", khachThuePage.getNumber());
            pageInfo.put("size", khachThuePage.getSize());
            pageInfo.put("hasNext", khachThuePage.hasNext());
            pageInfo.put("hasPrevious", khachThuePage.hasPrevious());

            response.put("success", true);
            response.put("message", "Lấy danh sách tất cả khách thuê thành công");
            response.put("data", pageInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all deleted tenants with pagination - for admin purposes
     */
    @GetMapping("/deleted")
    public ResponseEntity<Map<String, Object>> getDeletedKhachThue(
            @RequestParam(defaultValue = "0") int page) {
        logger.info("Received request for getDeletedKhachThue with page: {}", page);
        Map<String, Object> response = new HashMap<>();
        try {
            Page<KhachThueDto> khachThuePage = khachThueService.getDeletedKhachThue(page);

            Map<String, Object> pageInfo = new HashMap<>();
            pageInfo.put("content", khachThuePage.getContent());
            pageInfo.put("totalElements", khachThuePage.getTotalElements());
            pageInfo.put("totalPages", khachThuePage.getTotalPages());
            pageInfo.put("currentPage", khachThuePage.getNumber());
            pageInfo.put("size", khachThuePage.getSize());
            pageInfo.put("hasNext", khachThuePage.hasNext());
            pageInfo.put("hasPrevious", khachThuePage.hasPrevious());

            response.put("success", true);
            response.put("message", "Lấy danh sách khách thuê đã xóa thành công");
            response.put("data", pageInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update tenant
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachThueDto>> updateKhachThue(
            @PathVariable int id,
            @RequestBody KhachThueRequest khachThueRequest) {
        try {
            KhachThueDto updatedKhachThue = khachThueService.updateKhachThue(id, khachThueRequest);
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Cập nhật khách thuê thành công",
                    updatedKhachThue
            );
            return ResponseEntity.ok(response);
        } catch (KhachThueNotFoundException e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.NOT_FOUND.value(),
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (DuplicateCanCuocException e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.CONFLICT.value(),
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (InvalidKhachThueDataException e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.BAD_REQUEST.value(),
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi hệ thống: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete tenant
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteKhachThue(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            khachThueService.deleteKhachThue(id);
            response.put("success", true);
            response.put("message", "Khách thuê đã được đánh dấu xóa thành công");
            return ResponseEntity.ok(response);
        } catch (KhachThueNotFoundException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Restore deleted tenant
     */
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<KhachThueDto>> restoreKhachThue(@PathVariable int id) {
        try {
            KhachThueDto restoredKhachThue = khachThueService.restoreKhachThue(id);
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Khôi phục khách thuê thành công",
                    restoredKhachThue
            );
            return ResponseEntity.ok(response);
        } catch (KhachThueNotFoundException e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.NOT_FOUND.value(),
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IllegalStateException e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.BAD_REQUEST.value(),
                    e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ApiResponse<KhachThueDto> response = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi hệ thống: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
