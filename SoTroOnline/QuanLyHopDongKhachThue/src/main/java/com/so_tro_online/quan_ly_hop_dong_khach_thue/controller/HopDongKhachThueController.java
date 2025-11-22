package com.so_tro_online.quan_ly_hop_dong_khach_thue.controller;

import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_hop_dong_khach_thue.service.HopDongKhachThueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hop-dong-khach-thue")
public class HopDongKhachThueController {
    
    @Autowired
    private HopDongKhachThueService hopDongKhachThueService;
    
    /**
     * Get all tenants associated with a specific contract
     */
    @GetMapping("/contract/{contractId}/tenants")
    public ResponseEntity<ApiResponseV2> getContractTenants(@PathVariable Integer contractId) {
        try {
            System.out.println("HopDongKhachThueController.getContractTenants called with contractId: " + contractId);
            List<Map<String, Object>> tenants = hopDongKhachThueService.getContractTenants(contractId);
            System.out.println("Successfully fetched " + tenants.size() + " tenants for contract " + contractId);
            return ResponseEntity.ok(new ApiResponseV2("success", tenants));
        } catch (Exception e) {
            System.err.println("Error in getContractTenants for contract " + contractId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", "Error fetching contract tenants: " + e.getMessage()));
        }
    }
    
    /**
     * Add a tenant to a contract with validation
     */
    @PostMapping("/contract/{contractId}/tenants/{tenantId}")
    public ResponseEntity<ApiResponseV2> addTenantToContract(
            @PathVariable Integer contractId, 
            @PathVariable Integer tenantId,
            @RequestParam(defaultValue = "10") Integer maxTenants) {
        try {
            hopDongKhachThueService.addTenantToContract(contractId, tenantId, maxTenants);
            return ResponseEntity.ok(new ApiResponseV2("success", "Tenant added to contract successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", e.getMessage()));
        }
    }
    
    /**
     * Remove a tenant from a contract
     */
    @DeleteMapping("/contract/{contractId}/tenants/{tenantId}")
    public ResponseEntity<ApiResponseV2> removeTenantFromContract(
            @PathVariable Integer contractId, 
            @PathVariable Integer tenantId) {
        try {
            hopDongKhachThueService.removeTenantFromContract(contractId, tenantId);
            return ResponseEntity.ok(new ApiResponseV2("success", "Tenant removed from contract successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", e.getMessage()));
        }
    }
    
    /**
     * Check if tenant has active contracts
     */
    @GetMapping("/tenants/{tenantId}/active-contracts")
    public ResponseEntity<ApiResponseV2> checkTenantActiveContracts(@PathVariable Integer tenantId) {
        try {
            Map<String, Object> result = hopDongKhachThueService.checkTenantActiveContracts(tenantId);
            return ResponseEntity.ok(new ApiResponseV2("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", "Error checking tenant contracts: " + e.getMessage()));
        }
    }
    
    /**
     * Get available tenants (not in any active contract)
     */
    @GetMapping("/available-tenants")
    public ResponseEntity<ApiResponseV2> getAvailableTenants() {
        try {
            System.out.println("HopDongKhachThueController.getAvailableTenants called");
            List<Map<String, Object>> availableTenants = hopDongKhachThueService.getAvailableTenants();
            System.out.println("Controller: Successfully retrieved " + availableTenants.size() + " available tenants");
            return ResponseEntity.ok(new ApiResponseV2("success", availableTenants));
        } catch (Exception e) {
            System.err.println("Error in getAvailableTenants controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponseV2("error", "Error fetching available tenants: " + e.getMessage()));
        }
    }

    /**
     * Get tenants by room ID (for room display)
     */
    @GetMapping("/room/{roomId}/tenants")
    public ResponseEntity<ApiResponseV2> getRoomTenants(@PathVariable Integer roomId) {
        try {
            System.out.println("getRoomTenants called for room ID: " + roomId);
            List<Map<String, Object>> tenants = hopDongKhachThueService.getRoomTenants(roomId);
            System.out.println("Successfully fetched " + tenants.size() + " tenants for room " + roomId);
            return ResponseEntity.ok(new ApiResponseV2("success", tenants));
        } catch (Exception e) {
            System.err.println("Error in getRoomTenants for room " + roomId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", "Error fetching room tenants: " + e.getMessage()));
        }
    }
    
    /**
     * Get all tenant-contract relationships with pagination
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAllTenantContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Map<String, Object>> result = hopDongKhachThueService.getAllActiveWithDetails(pageable);
            return ResponseEntity.ok(new ApiResponseV2("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", "Error fetching tenant contracts: " + e.getMessage()));
        }
    }
    
    /**
     * Update main tenant for a contract
     */
    @PutMapping("/contract/{contractId}/main-tenant/{tenantId}")
    public ResponseEntity<ApiResponseV2> updateMainTenant(
            @PathVariable Integer contractId,
            @PathVariable Integer tenantId) {
        try {
            hopDongKhachThueService.updateMainTenant(contractId, tenantId);
            return ResponseEntity.ok(new ApiResponseV2("success", "Main tenant updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseV2("error", e.getMessage()));
        }
    }
    
    /**
     * Test endpoint to verify controller is working
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponseV2> testEndpoint() {
        return ResponseEntity.ok(new ApiResponseV2("success", "HopDongKhachThueController is working!"));
    }
}
