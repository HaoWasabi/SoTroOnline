package com.so_tro_online.quan_ly_hop_dong_phong.controller;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.service.HopDongPhongService;

// Import for tenant management integration
import com.so_tro_online.quan_ly_hop_dong_khach_thue.service.HopDongKhachThueService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.data.domain.Page;
import java.util.*;

@RestController
@RequestMapping("/api/hop-dong-phong")
@CrossOrigin(origins = "http://localhost:3000")
public class HopDongPhongController {

    @Autowired
    private HopDongPhongService hopDongPhongService;

    @Autowired
    private RestTemplate restTemplate;

    // Add tenant management service for integration
    @Autowired
    private HopDongKhachThueService hopDongKhachThueService;

    // Simple test endpoint to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "success");
        response.put("data", "HopDongPhongController is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        System.out.println("DEBUG: Test endpoint called successfully");
        return ResponseEntity.ok(response);
    }

    // DEPRECATED: Old mock implementation - kept for compatibility  
    // Use the new getAvailableTenantsNew() method instead
    @GetMapping("/available-tenants-mock")
    public ResponseEntity<Map<String, Object>> getAvailableTenantsMock() {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("DEBUG: getAvailableTenants() called");

            // For now, provide a mock response to get the frontend working
            // TODO: Replace with proper service integration
            List<Map<String, Object>> mockTenants = new ArrayList<>();

            // Add sample tenant data
            Map<String, Object> tenant1 = new HashMap<>();
            tenant1.put("maKhachThue", 1);
            tenant1.put("hoTen", "Nguyen Van A");
            tenant1.put("soDienThoai", "0123456789");
            tenant1.put("email", "nguyenvana@gmail.com");
            tenant1.put("trangThai", "hoatDong");
            mockTenants.add(tenant1);

            Map<String, Object> tenant2 = new HashMap<>();
            tenant2.put("maKhachThue", 2);
            tenant2.put("hoTen", "Tran Thi B");
            tenant2.put("soDienThoai", "0987654321");
            tenant2.put("email", "tranthib@gmail.com");
            tenant2.put("trangThai", "hoatDong");
            mockTenants.add(tenant2);

            System.out.println("DEBUG: Returning " + mockTenants.size() + " mock tenants");
            response.put("message", "success");
            response.put("data", mockTenants);
            return ResponseEntity.ok(response);

            // Original RestTemplate code - commented out for now to avoid issues
            /*
            String tenantUrl = "http://localhost:8080/api/tenants?status=active";
            System.out.println("DEBUG: Calling tenant URL: " + tenantUrl);
            
            // Add timeout and error handling
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> tenantResponse = restTemplate.getForObject(tenantUrl, Map.class);
                System.out.println("DEBUG: Tenant response: " + tenantResponse);
                
                if (tenantResponse != null) {
                    // Check for success in different formats
                    boolean isSuccess = "true".equals(String.valueOf(tenantResponse.get("success"))) ||
                                       "success".equals(tenantResponse.get("status")) ||
                                       "success".equals(tenantResponse.get("message"));
                    
                    System.out.println("DEBUG: Is response successful: " + isSuccess);
                    
                    if (isSuccess && tenantResponse.containsKey("data")) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> dataObject = (Map<String, Object>) tenantResponse.get("data");
                        System.out.println("DEBUG: Data object: " + dataObject);
                        
                        if (dataObject != null && dataObject.containsKey("content")) {
                            @SuppressWarnings("unchecked")
                            List<Object> content = (List<Object>) dataObject.get("content");
                            System.out.println("DEBUG: Found content with " + content.size() + " items");
                            response.put("message", "success");
                            response.put("data", content);
                            return ResponseEntity.ok(response);
                        }
                    }
                }
                
                System.out.println("DEBUG: No valid content found, returning empty array");
                // Fallback - no tenants found or unexpected response structure
                response.put("message", "success");
                response.put("data", new ArrayList<>());
                return ResponseEntity.ok(response);
                
            } catch (Exception restException) {
                System.err.println("DEBUG: RestTemplate call failed: " + restException.getMessage());
                // If RestTemplate fails, return empty array instead of error
                response.put("message", "success");
                response.put("data", new ArrayList<>());
                return ResponseEntity.ok(response);
            }
            */

        } catch (Exception e) {
            System.err.println("DEBUG: Exception in getAvailableTenants: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "error");
            response.put("data", "Failed to fetch available tenants: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Mock implementation with sample contract data for testing
    @GetMapping("/active/paged")
    public ResponseEntity<Map<String, Object>> getActivePaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        try {
            // Since getActiveContractsPaged was removed, let's use the available methods
            // This is a simplified implementation using available service methods
            List<HopDongPhongResponse> contracts = hopDongPhongService.getAllHopDongPhongActive();

            // Simple pagination logic
            int start = page * size;
            int end = Math.min(start + size, contracts.size());
            List<HopDongPhongResponse> pageContent = start >= contracts.size() ?
                    new ArrayList<>() : contracts.subList(start, end);

            Map<String, Object> data = new HashMap<>();
            data.put("content", pageContent);
            data.put("page", page);
            data.put("size", size);
            data.put("totalElements", contracts.size());
            data.put("totalPages", (int) Math.ceil((double) contracts.size() / size));
            data.put("first", page == 0);
            data.put("last", end >= contracts.size());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "success");
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "error");
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all active contracts
     */
    @GetMapping("/all-active")
    public ResponseEntity<Map<String, Object>> getAllActiveContracts() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<HopDongPhongResponse> contracts = hopDongPhongService.getAllHopDongPhongActive();
            response.put("message", "success");
            response.put("data", contracts);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get contract by ID
     */
    @GetMapping("/{contractId}")
    public ResponseEntity<Map<String, Object>> getContractById(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            HopDongPhongResponse contract = hopDongPhongService.getHopDongPhongById(contractId);
            response.put("message", "success");
            response.put("data", contract);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Create new contract
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createContract(@RequestBody HopDongPhongRequest contractRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            HopDongPhongResponse result = hopDongPhongService.createHopDongPhong(contractRequest);
            response.put("message", "success");
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update contract
     */
    @PutMapping("/{contractId}")
    public ResponseEntity<Map<String, Object>> updateContract(
            @PathVariable Integer contractId,
            @RequestBody HopDongPhongRequest contractRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            HopDongPhongResponse result = hopDongPhongService.updateHopDongPhong(contractId, contractRequest);
            response.put("message", "success");
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete contract (soft delete)
     */
    @DeleteMapping("/{contractId}")
    public ResponseEntity<Map<String, Object>> deleteContract(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            hopDongPhongService.deleteHopDongPhong(contractId);
            response.put("message", "success");
            response.put("data", "Contract deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Print contract document
     */
    @GetMapping("/{contractId}/print")
    public void printContract(@PathVariable Integer contractId, HttpServletResponse response) {
        try {
            hopDongPhongService.printHopDongPhong(response, contractId);
        } catch (Exception e) {
            throw new RuntimeException("Error printing contract: " + e.getMessage());
        }
    }

    /**
     * Get contracts without invoice for specific month/year
     */
    @GetMapping("/no-invoice")
    public ResponseEntity<Map<String, Object>> getContractsWithoutInvoice(
            @RequestParam int thang,
            @RequestParam int nam) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<HopDongPhongResponse> contracts = hopDongPhongService.findAllNotHasHoaDonByThangAndNam(thang, nam);
            response.put("message", "success");
            response.put("data", contracts);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get tenants by room ID (for room display)
     */
    @GetMapping("/room/{roomId}/tenants")
    public ResponseEntity<Map<String, Object>> getRoomTenants(@PathVariable Integer roomId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> tenants = hopDongKhachThueService.getRoomTenants(roomId);
            response.put("message", "success");
            response.put("data", tenants);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error fetching room tenants: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update expired contracts automatically
     */
    @PostMapping("/update-expired")
    public ResponseEntity<Map<String, Object>> updateExpiredContracts() {
        Map<String, Object> response = new HashMap<>();
        try {
            hopDongPhongService.updateExpiredContracts();
            response.put("message", "success");
            response.put("data", "Expired contracts updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error updating expired contracts: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Check contract debts before liquidation
     */
    @GetMapping("/{contractId}/debts")
    public ResponseEntity<Map<String, Object>> checkContractDebts(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> debtInfo = hopDongPhongService.checkContractDebts(contractId);
            response.put("message", "success");
            response.put("data", debtInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error checking contract debts: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Calculate deposit refund for contract liquidation
     */
    @GetMapping("/{contractId}/deposit-refund")
    public ResponseEntity<Map<String, Object>> calculateDepositRefund(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> refundInfo = hopDongPhongService.calculateDepositRefund(contractId);
            response.put("message", "success");
            response.put("data", refundInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error calculating deposit refund: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get room status summary
     */
    @GetMapping("/room-status-summary")
    public ResponseEntity<Map<String, Object>> getRoomStatusSummary() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> summary = hopDongPhongService.getRoomStatusSummary();
            response.put("message", "success");
            response.put("data", summary);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error getting room status summary: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Sync room statuses with contracts
     */
    @PostMapping("/sync-room-status")
    public ResponseEntity<Map<String, Object>> syncRoomStatus() {
        Map<String, Object> response = new HashMap<>();
        try {
            hopDongPhongService.syncRoomStatusWithContracts();
            response.put("message", "success");
            response.put("data", "Room statuses synced successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error syncing room statuses: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Add a tenant to an existing contract
     */
    @PostMapping("/{contractId}/tenants/{tenantId}")
    public ResponseEntity<Map<String, Object>> addTenantToContract(
            @PathVariable Integer contractId, 
            @PathVariable Integer tenantId,
            @RequestParam(defaultValue = "5") Integer maxTenants) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Adding tenant " + tenantId + " to contract " + contractId + " with max " + maxTenants + " tenants");
            
            // Use the tenant service to add tenant to contract
            hopDongKhachThueService.addTenantToContract(contractId, tenantId, maxTenants);
            
            response.put("status", "success");
            response.put("message", "Tenant added to contract successfully");
            response.put("data", Map.of(
                "contractId", contractId,
                "tenantId", tenantId,
                "maxTenants", maxTenants
            ));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error adding tenant to contract: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error adding tenant to contract: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Remove a tenant from an existing contract
     */
    @DeleteMapping("/{contractId}/tenants/{tenantId}")
    public ResponseEntity<Map<String, Object>> removeTenantFromContract(
            @PathVariable Integer contractId, 
            @PathVariable Integer tenantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Removing tenant " + tenantId + " from contract " + contractId);
            
            // Use the tenant service to remove tenant from contract
            hopDongKhachThueService.removeTenantFromContract(contractId, tenantId);
            
            response.put("status", "success");
            response.put("message", "Tenant removed from contract successfully");
            response.put("data", Map.of(
                "contractId", contractId,
                "tenantId", tenantId
            ));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error removing tenant from contract: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error removing tenant from contract: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all tenants for a specific contract
     */
    @GetMapping("/{contractId}/tenants")
    public ResponseEntity<Map<String, Object>> getContractTenants(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Getting tenants for contract " + contractId);
            
            // Use the tenant service to get contract tenants
            List<Map<String, Object>> tenants = hopDongKhachThueService.getContractTenants(contractId);
            
            response.put("status", "success");
            response.put("message", "Contract tenants retrieved successfully");
            response.put("data", tenants);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting contract tenants: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error getting contract tenants: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get available tenants (not in any active contract)
     */
    @GetMapping("/available-tenants")
    public ResponseEntity<Map<String, Object>> getAvailableTenants() {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Getting available tenants");
            
            // Use the tenant service to get available tenants
            List<Map<String, Object>> tenants = hopDongKhachThueService.getAvailableTenants();
            
            response.put("status", "success");
            response.put("message", "Available tenants retrieved successfully");
            response.put("data", tenants);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting available tenants: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error getting available tenants: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Check if a tenant has active contracts (for validation before adding to new contract)
     */
    @GetMapping("/tenants/{tenantId}/active-contracts")
    public ResponseEntity<Map<String, Object>> checkTenantActiveContracts(@PathVariable Integer tenantId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Use the tenant service to check for active contracts
            List<Map<String, Object>> activeContracts = hopDongKhachThueService.getTenantActiveContracts(tenantId);
            
            boolean hasActiveContract = !activeContracts.isEmpty();
            int activeContractCount = activeContracts.size();
            
            Map<String, Object> result = new HashMap<>();
            result.put("tenantId", tenantId);
            result.put("hasActiveContract", hasActiveContract);
            result.put("activeContractCount", activeContractCount);
            result.put("activeContracts", activeContracts);
            
            response.put("status", "success");
            response.put("data", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error checking tenant active contracts: " + e.getMessage());
            response.put("status", "error");
            response.put("data", "Error checking tenant contracts: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Enhanced contract liquidation with debt checking
     */
    @DeleteMapping("/{contractId}/liquidate")
    public ResponseEntity<Map<String, Object>> liquidateContract(@PathVariable Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check debts first
            Map<String, Object> debtInfo = hopDongPhongService.checkContractDebts(contractId);
            Map<String, Object> refundInfo = hopDongPhongService.calculateDepositRefund(contractId);

            // Perform liquidation
            hopDongPhongService.deleteHopDongPhong(contractId);

            Map<String, Object> liquidationInfo = new HashMap<>();
            liquidationInfo.put("debtInfo", debtInfo);
            liquidationInfo.put("refundInfo", refundInfo);
            liquidationInfo.put("message", "Contract liquidated successfully");

            response.put("message", "success");
            response.put("data", liquidationInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "error");
            response.put("data", "Error liquidating contract: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}