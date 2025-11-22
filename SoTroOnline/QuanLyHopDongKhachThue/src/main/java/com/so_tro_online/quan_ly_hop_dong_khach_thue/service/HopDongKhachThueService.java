package com.so_tro_online.quan_ly_hop_dong_khach_thue.service;

import com.so_tro_online.quan_ly_hop_dong_khach_thue.entity.HopDongKhachThue;
import com.so_tro_online.quan_ly_hop_dong_khach_thue.repository.HopDongKhachThueRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class HopDongKhachThueService {

    @Autowired
    private HopDongKhachThueRepository hopDongKhachThueRepository;

    @Autowired
    private KhachThueRepository khachThueRepository;

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * Get all tenants for a specific contract
     */
    public List<Map<String, Object>> getContractTenants(Integer contractId) {
        try {
            System.out.println("HopDongKhachThueService.getContractTenants called with contractId: " + contractId);
            
            List<HopDongKhachThue> tenants = hopDongKhachThueRepository.findByContractIdAndTrangThai(
                contractId, HopDongKhachThue.TrangThai.hoatDong);
            
            System.out.println("Found " + tenants.size() + " tenant records for contract " + contractId);

            List<Map<String, Object>> result = tenants.stream().map(this::mapTenantToResponse).collect(Collectors.toList());
            System.out.println("Successfully mapped tenant records to response format");
            
            return result;
        } catch (Exception e) {
            System.err.println("Error in getContractTenants for contract " + contractId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching contract tenants: " + e.getMessage(), e);
        }
    }

    /**
     * Add a tenant to a contract with validation
     */
    public void addTenantToContract(Integer contractId, Integer tenantId) {
        addTenantToContract(contractId, tenantId, 5); // Default max 5 tenants per room
    }

    /**
     * Add a tenant to a contract with max tenant limit validation
     * Note: Contract validation should be done by the calling service (HopDongPhongService)
     */
    public void addTenantToContract(Integer contractId, Integer tenantId, Integer maxTenants) {
        // Validate tenant exists and is active
        KhachThue khachThue = khachThueRepository.findById(tenantId)
            .filter(k -> k.getTrangThai() == com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.hoatDong)
            .orElseThrow(() -> new RuntimeException("Active tenant not found with ID: " + tenantId));

        // Check if tenant is already in this contract
        if (hopDongKhachThueRepository.existsByMaHopDongPhongAndKhachThueIdAndTrangThai(
                contractId, tenantId, HopDongKhachThue.TrangThai.hoatDong)) {
            throw new RuntimeException("Tenant is already in this contract");
        }

        // Check if tenant has other active contracts
        List<HopDongKhachThue> activeContracts = hopDongKhachThueRepository
            .findActiveContractsByTenantId(tenantId, HopDongKhachThue.TrangThai.hoatDong);
        
        if (!activeContracts.isEmpty()) {
            throw new RuntimeException("Tenant already has an active contract");
        }

        // Check tenant limit
        Long currentTenantCount = hopDongKhachThueRepository
            .countActiveTenantsInContract(contractId, HopDongKhachThue.TrangThai.hoatDong);
        
        if (currentTenantCount >= maxTenants) {
            throw new RuntimeException("Contract has reached maximum tenant limit: " + maxTenants);
        }

        // Determine if this is the main tenant (first tenant or no main tenant exists)
        Optional<HopDongKhachThue> existingMainTenant = hopDongKhachThueRepository
            .findMainTenantByContractId(contractId, HopDongKhachThue.TrangThai.hoatDong);
        
        boolean isMainTenant = !existingMainTenant.isPresent();

        // Create new tenant-contract relationship
        HopDongKhachThue hopDongKhachThue = new HopDongKhachThue(contractId, khachThue, isMainTenant);
        hopDongKhachThue.setNgayVaoO(LocalDate.now());
        
        hopDongKhachThueRepository.save(hopDongKhachThue);
    }

    /**
     * Remove a tenant from a contract
     */
    public void removeTenantFromContract(Integer contractId, Integer tenantId) {
        // Find the tenant-contract relationship
        HopDongKhachThue hopDongKhachThue = hopDongKhachThueRepository
            .findByContractIdAndTenantIdAndTrangThai(contractId, tenantId, HopDongKhachThue.TrangThai.hoatDong)
            .orElseThrow(() -> new RuntimeException("Tenant not found in this contract"));

        // Check if this is the main tenant
        if (hopDongKhachThue.getLaKhachDaiDien()) {
            // Count remaining active tenants
            Long activeTenantCount = hopDongKhachThueRepository
                .countActiveTenantsInContract(contractId, HopDongKhachThue.TrangThai.hoatDong);
            
            if (activeTenantCount > 1) {
                // Find another tenant to promote as main tenant
                List<HopDongKhachThue> otherTenants = hopDongKhachThueRepository
                    .findByContractIdAndTrangThai(contractId, HopDongKhachThue.TrangThai.hoatDong)
                    .stream()
                    .filter(t -> !Objects.equals(t.getKhachThue().getMaKhach(), tenantId))
                    .collect(Collectors.toList());
                
                if (!otherTenants.isEmpty()) {
                    // Promote the first tenant as main tenant
                    HopDongKhachThue newMainTenant = otherTenants.get(0);
                    newMainTenant.setLaKhachDaiDien(true);
                    hopDongKhachThueRepository.save(newMainTenant);
                }
            }
        }

        // Remove tenant (soft delete)
        hopDongKhachThue.setTrangThai(HopDongKhachThue.TrangThai.daRa);
        hopDongKhachThue.setNgayRaO(LocalDate.now());
        hopDongKhachThueRepository.save(hopDongKhachThue);
        
        // Check if this was the last tenant in the contract
        Long remainingTenantCount = hopDongKhachThueRepository
            .countActiveTenantsInContract(contractId, HopDongKhachThue.TrangThai.hoatDong);
            
        if (remainingTenantCount == 0) {
            // No more tenants in contract - terminate the contract and free the room
            System.out.println("Last tenant removed from contract " + contractId + ". Terminating contract and freeing room.");
            terminateContractAndFreeRoom(contractId);
        }
    }

    /**
     * Check if tenant has active contracts
     */
    public Map<String, Object> checkTenantActiveContracts(Integer tenantId) {
        List<HopDongKhachThue> activeContracts = hopDongKhachThueRepository
            .findActiveContractsByTenantId(tenantId, HopDongKhachThue.TrangThai.hoatDong);

        Map<String, Object> result = new HashMap<>();
        result.put("hasActiveContract", !activeContracts.isEmpty());
        result.put("activeContractCount", activeContracts.size());
        
        if (!activeContracts.isEmpty()) {
            List<Map<String, Object>> contracts = activeContracts.stream()
                .map(this::mapContractToResponse)
                .collect(Collectors.toList());
            result.put("contracts", contracts);
        }

        return result;
    }

    /**
     * Get available tenants (not in any active contract)
     * Simplified version - contract validity should be checked by calling service
     */
    public List<Map<String, Object>> getAvailableTenants() {
        try {
            System.out.println("HopDongKhachThueService.getAvailableTenants called");
            
            // Get all tenants with active tenant-contract relationships
            System.out.println("Fetching tenants with active contracts...");
            List<Integer> tenantsWithContracts = hopDongKhachThueRepository
                .findTenantsWithActiveContracts(HopDongKhachThue.TrangThai.hoatDong);
            System.out.println("Found " + tenantsWithContracts.size() + " tenants with active contracts");

            // Get all active tenants
            System.out.println("Fetching all active tenants from KhachThueRepository...");
            List<KhachThue> allActiveTenants = khachThueRepository
                .findByTrangThaiNot(com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.daXoa, 
                    org.springframework.data.domain.Pageable.unpaged())
                .getContent();
            System.out.println("Found " + allActiveTenants.size() + " active tenants");

            // Filter out tenants with active contracts
            System.out.println("Filtering available tenants...");
            List<KhachThue> availableTenants = allActiveTenants.stream()
                .filter(tenant -> !tenantsWithContracts.contains(tenant.getMaKhach()))
                .toList();
            System.out.println("Found " + availableTenants.size() + " available tenants");

            List<Map<String, Object>> result = availableTenants.stream()
                .map(this::mapKhachThueToResponse)
                .collect(Collectors.toList());
            System.out.println("Successfully mapped available tenants to response");
            
            return result;
        } catch (Exception e) {
            System.err.println("Error in getAvailableTenants: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching available tenants: " + e.getMessage(), e);
        }
    }

    /**
     * Get tenants by room ID
     * Note: This functionality should be moved to QuanLyHopDongPhong service
     * Temporarily returns empty list to avoid circular dependency
     */
    public List<Map<String, Object>> getRoomTenants(Integer roomId) {
        // This method needs to be handled by the HopDongPhongService
        // since it requires knowledge of room-contract relationships
        System.out.println("getRoomTenants called for room " + roomId + " - should be handled by contract service");
        return new ArrayList<>();
    }

    /**
     * Get paginated list of all tenant-contract relationships
     * Note: Complex contract details should be handled by calling service
     */
    public Page<Map<String, Object>> getAllActiveWithDetails(Pageable pageable) {
        // This method requires complex joins with HopDongPhong which creates circular dependency
        // Return empty page for now - this should be handled by HopDongPhongService
        return Page.empty(pageable);
    }

    /**
     * Update main tenant for a contract
     */
    public void updateMainTenant(Integer contractId, Integer newMainTenantId) {
        // Remove main tenant status from current main tenant
        Optional<HopDongKhachThue> currentMainTenant = hopDongKhachThueRepository
            .findMainTenantByContractId(contractId, HopDongKhachThue.TrangThai.hoatDong);
        
        if (currentMainTenant.isPresent()) {
            currentMainTenant.get().setLaKhachDaiDien(false);
            hopDongKhachThueRepository.save(currentMainTenant.get());
        }

        // Set new main tenant
        HopDongKhachThue newMainTenant = hopDongKhachThueRepository
            .findByContractIdAndTenantIdAndTrangThai(contractId, newMainTenantId, HopDongKhachThue.TrangThai.hoatDong)
            .orElseThrow(() -> new RuntimeException("Tenant not found in this contract"));
        
        newMainTenant.setLaKhachDaiDien(true);
        hopDongKhachThueRepository.save(newMainTenant);
    }

    // Helper methods for mapping entities to response DTOs
    
    private Map<String, Object> mapTenantToResponse(HopDongKhachThue hopDongKhachThue) {
        Map<String, Object> response = new HashMap<>();
        KhachThue khachThue = hopDongKhachThue.getKhachThue();
        
        response.put("ma_khach", khachThue.getMaKhach());
        response.put("ho_ten", khachThue.getHoTen());
        response.put("ma_can_cuoc", khachThue.getMaCanCuoc());
        response.put("dien_thoai", khachThue.getDienThoai());
        response.put("ngay_sinh", khachThue.getNgaySinh());
        response.put("thuong_tru", khachThue.getThuongTru());
        response.put("trang_thai", khachThue.getTrangThai().toString());
        response.put("ngay_vao_o", hopDongKhachThue.getNgayVaoO());
        response.put("ngay_ra_o", hopDongKhachThue.getNgayRaO());
        response.put("is_main_tenant", hopDongKhachThue.getLaKhachDaiDien());
        response.put("email", ""); // Add empty email field for compatibility
        
        return response;
    }
    
    private Map<String, Object> mapContractToResponse(HopDongKhachThue hopDongKhachThue) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("ma_hop_dong_phong", hopDongKhachThue.getMaHopDongPhong());
        response.put("ma_phong", "Unknown - requires contract service");
        response.put("ten_phong", "Unknown - requires contract service");
        response.put("ngay_bat_dau", "Unknown - requires contract service");
        response.put("ngay_ket_thuc", "Unknown - requires contract service");
        response.put("tenant_type", hopDongKhachThue.getLaKhachDaiDien() ? "main_tenant" : "member_tenant");
        
        return response;
    }
    
    private Map<String, Object> mapKhachThueToResponse(KhachThue khachThue) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("ma_khach", khachThue.getMaKhach());
        response.put("ho_ten", khachThue.getHoTen());
        response.put("ma_can_cuoc", khachThue.getMaCanCuoc());
        response.put("dien_thoai", khachThue.getDienThoai());
        response.put("ngay_sinh", khachThue.getNgaySinh());
        response.put("thuong_tru", khachThue.getThuongTru());
        response.put("trang_thai", khachThue.getTrangThai().toString());
        response.put("email", ""); // Add empty email field for compatibility
        
        return response;
    }
    
    private Map<String, Object> mapDetailedTenantContractResponse(HopDongKhachThue hopDongKhachThue) {
        Map<String, Object> response = new HashMap<>();
        KhachThue khachThue = hopDongKhachThue.getKhachThue();
        
        response.put("ma_hop_dong_khach_thue", hopDongKhachThue.getMaHopDongKhachThue());
        response.put("ma_hop_dong_phong", hopDongKhachThue.getMaHopDongPhong());
        response.put("ma_khach", khachThue.getMaKhach());
        response.put("ten_khach", khachThue.getHoTen());
        response.put("ten_phong", "Unknown - requires contract service");
        response.put("ten_quan_ly", "Unknown - requires contract service");
        response.put("ngay_vao_o", hopDongKhachThue.getNgayVaoO());
        response.put("ngay_ra_o", hopDongKhachThue.getNgayRaO());
        response.put("la_khach_dai_dien", hopDongKhachThue.getLaKhachDaiDien());
        response.put("trang_thai", hopDongKhachThue.getTrangThai().toString());
        response.put("ngay_tao", hopDongKhachThue.getNgayTao());
        
        return response;
    }

    /**
     * Terminate a contract and free the associated room when all tenants are removed
     * This method requires integration with the contract and room services
     */
    private void terminateContractAndFreeRoom(Integer contractId) {
        try {
            System.out.println("Attempting to terminate contract " + contractId + " - all tenants removed");
            
            // Use ApplicationContext to avoid circular dependency
            // Get the HopDongPhongService bean and call the termination method
            try {
                Object hopDongPhongService = applicationContext.getBean("hopDongPhongService");
                
                // Use reflection to call the terminateContractWhenEmpty method
                java.lang.reflect.Method terminateMethod = hopDongPhongService.getClass()
                    .getMethod("terminateContractWhenEmpty", Integer.class);
                terminateMethod.invoke(hopDongPhongService, contractId);
                
                System.out.println("Successfully terminated contract " + contractId + " and freed associated room");
                
            } catch (Exception serviceException) {
                System.err.println("Failed to call HopDongPhongService for contract termination: " + serviceException.getMessage());
                
                // Fallback: just log what should happen
                System.out.println("Contract " + contractId + " should be terminated and room made available");
                System.out.println("Manual intervention required: Update contract status to 'daXoa' and room to 'phongTrong'");
            }
            
        } catch (Exception e) {
            System.err.println("Error in terminateContractAndFreeRoom for contract " + contractId + ": " + e.getMessage());
            // Don't throw exception here to avoid rolling back the tenant removal
        }
    }

    /**
     * Get all active contracts for a specific tenant (for validation before adding to new contract)
     */
    public List<Map<String, Object>> getTenantActiveContracts(Integer tenantId) {
        try {
            System.out.println("HopDongKhachThueService.getTenantActiveContracts called with tenantId: " + tenantId);
            
            // Find all active contracts for this tenant
            List<HopDongKhachThue> activeContracts = hopDongKhachThueRepository
                .findActiveContractsByTenantId(tenantId, HopDongKhachThue.TrangThai.hoatDong);
            
            System.out.println("Found " + activeContracts.size() + " active contracts for tenant " + tenantId);

            List<Map<String, Object>> result = activeContracts.stream().map(this::mapTenantToResponse).collect(Collectors.toList());
            System.out.println("Successfully mapped active contract records to response format");
            
            return result;
        } catch (Exception e) {
            System.err.println("Error in getTenantActiveContracts for tenant " + tenantId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching tenant active contracts: " + e.getMessage(), e);
        }
    }
}
