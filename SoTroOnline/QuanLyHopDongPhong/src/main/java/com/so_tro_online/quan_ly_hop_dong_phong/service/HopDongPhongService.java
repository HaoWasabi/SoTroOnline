package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.deepoove.poi.XWPFTemplate;
// OpenHTMLtoPDF imports for PDF generation
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.exception.HopDongAlreadyExists;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;

import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;

// Import for tenant-contract relationship management
import com.so_tro_online.quan_ly_hop_dong_khach_thue.service.HopDongKhachThueService;
import com.so_tro_online.quan_ly_hop_dong_phong.util.HopDongData;
import com.so_tro_online.quan_ly_hop_dong_phong.util.HopDongExporter;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HopDongPhongService implements IHopDongPhongService {
    
    private final PhongRepository phongRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    private final SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
    
    // Dependency for managing tenant-contract relationships
    @Autowired
    private HopDongKhachThueService hopDongKhachThueService;
    
    @Autowired
    private KhachThueRepository khachThueRepository;
    
    public HopDongPhongService(PhongRepository phongRepository, TaiKhoanRepository taiKhoanRepository, HopDongPhongRepository hopDongPhongRepository) {
        this.phongRepository = phongRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }
    
    @Override
    public List<HopDongPhongResponse> getAllHopDongPhong() {
        return hopDongPhongRepository.findAll().stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongActive() {
        return hopDongPhongRepository.findByTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public Page<HopDongPhongResponse> getAllHopDongPhongActivePaged(Pageable pageable) {
        return hopDongPhongRepository.findByTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong, pageable)
                .map(this::mapToHopDongPhongResponse);
    }

    private HopDongPhongResponse mapToHopDongPhongResponse(HopDongPhong hopDongPhong) {
        // Get main tenant for this contract
        Integer maKhachDaiDien = null;
        String tenKhachDaiDien = null;
        
        try {
            // Fetch tenant-contract relationships for this contract
            List<Map<String, Object>> tenants = hopDongKhachThueService.getContractTenants(hopDongPhong.getMaHopDongPhong());
            
            // Find the main tenant (representative)
            if (tenants != null && !tenants.isEmpty()) {
                for (Map<String, Object> tenant : tenants) {
                    Boolean isMainTenant = (Boolean) tenant.get("is_main_tenant");
                    if (isMainTenant != null && isMainTenant) {
                        maKhachDaiDien = (Integer) tenant.get("ma_khach");
                        tenKhachDaiDien = (String) tenant.get("ho_ten");
                        break;
                    }
                }
                
                // If no main tenant found, use the first tenant
                if (maKhachDaiDien == null && !tenants.isEmpty()) {
                    Map<String, Object> firstTenant = tenants.get(0);
                    maKhachDaiDien = (Integer) firstTenant.get("ma_khach");
                    tenKhachDaiDien = (String) firstTenant.get("ho_ten");
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not fetch tenant data for contract " + hopDongPhong.getMaHopDongPhong() + ": " + e.getMessage());
            // Continue with null tenant data
        }
        
        return new HopDongPhongResponse(hopDongPhong.getMaHopDongPhong(),
                hopDongPhong.getTaiKhoan().getMaTaiKhoan(),
                hopDongPhong.getTaiKhoan().getHoTen(),
                maKhachDaiDien, // maKhachThue from HopDongKhachThue
                tenKhachDaiDien, // tenKhachThue from HopDongKhachThue
                hopDongPhong.getPhong().getMaPhong(),
                hopDongPhong.getPhong().getTenPhong(),
                hopDongPhong.getTienPhong(),
                hopDongPhong.getTienCoc(),
                hopDongPhong.getDvRac(),
                hopDongPhong.getDvWifi(),
                hopDongPhong.getDvCap(),
                hopDongPhong.getDvKhac(),
                hopDongPhong.getNgayBatDau(),
                hopDongPhong.getNgayKetThuc(),
                hopDongPhong.getNgayTao(),
                hopDongPhong.getTrangThai());
    }

    @Override
    public HopDongPhongResponse getHopDongPhongById(Integer id) {
        return hopDongPhongRepository.findById(id)
                .map(this::mapToHopDongPhongResponse)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: " + id));
    }

    @Override
    public HopDongPhongResponse getHopDongPhongActiveById(Integer id) {
        return hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .map(this::mapToHopDongPhongResponse)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng  với id: " + id));
    }

    @Override
    public HopDongPhongResponse createHopDongPhong(HopDongPhongRequest hopDongRequest) {
        System.out.println("=== CREATE CONTRACT DEBUG ===");
        System.out.println("maTaiKhoan = " + hopDongRequest.getMaTaiKhoan());
        System.out.println("maKhachThue = " + hopDongRequest.getMaKhachThue());
        System.out.println("phong=" + hopDongRequest.getMaPhong());
        System.out.println("tienPhong=" + hopDongRequest.getTienPhong());
        System.out.println("tienCoc=" + hopDongRequest.getTienCoc());
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(hopDongRequest.getMaTaiKhoan(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+hopDongRequest.getMaTaiKhoan()));
        // For contract creation, we need available rooms (phongTrong), not occupied ones (hoatDong)
        Phong phong=phongRepository.findByMaPhongAndTrangThai(hopDongRequest.getMaPhong(), TrangThai.phongTrong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng trống với id: "+hopDongRequest.getMaPhong()));
        
        if(hopDongPhongRepository.existsByPhongAndTrangThai(phong, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)){
            throw new HopDongAlreadyExists("phòng này đã được thuê");
        }
        HopDongPhong hopDongPhong=new HopDongPhong();
        hopDongPhong.setPhong(phong);
        hopDongPhong.setTaiKhoan(taiKhoan);
        // Note: Tenant relationship is now managed separately through HopDongKhachThue
        hopDongPhong.setTienPhong(phong.getGiaThueCoBan());
        hopDongPhong.setTienCoc(hopDongRequest.getTienCoc());
        hopDongPhong.setDvRac(hopDongRequest.getDvRac());
        hopDongPhong.setDvWifi(hopDongRequest.getDvWifi());
        hopDongPhong.setDvCap(hopDongRequest.getDvCap());
        hopDongPhong.setDvKhac(hopDongRequest.getDvKhac());
        hopDongPhong.setNgayBatDau(hopDongRequest.getNgayBatDau());
        hopDongPhong.setNgayKetThuc(hopDongRequest.getNgayKetThuc());
        hopDongPhong.setTrangThai(hopDongRequest.getTrangThai());
        hopDongPhong.setNgayTao(LocalDate.now());
        
        // Save the contract
        HopDongPhong savedContract = hopDongPhongRepository.save(hopDongPhong);
        System.out.println("Saved contract with ID: " + savedContract.getMaHopDongPhong());
        
        // Update room status from 'phongTrong' to 'hoatDong' after successful contract creation
        phong.setTrangThai(TrangThai.hoatDong);
        phongRepository.save(phong);
        
        // Create tenant-contract relationship in hop_dong_khach_thue table if tenant is specified
        if (hopDongRequest.getMaKhachThue() != null) {
            try {
                System.out.println("Creating tenant-contract relationship for tenant: " + hopDongRequest.getMaKhachThue());
                // Add tenant as the main tenant (representative) for this new contract
                hopDongKhachThueService.addTenantToContract(
                    savedContract.getMaHopDongPhong(), 
                    hopDongRequest.getMaKhachThue(), 
                    5 // Maximum 5 tenants per room
                );
                System.out.println("Successfully created tenant-contract relationship");
            } catch (Exception e) {
                System.err.println("Failed to create tenant-contract relationship: " + e.getMessage());
                e.printStackTrace();
                // Log the error but don't fail the contract creation
                // The tenant can be added later via the tenant management UI
            }
        } else {
            System.out.println("No tenant ID provided in contract request - skipping tenant-contract relationship creation");
        }
        
        return mapToHopDongPhongResponse(savedContract);
    }

    @Override
    public HopDongPhongResponse updateHopDongPhong(Integer id, HopDongPhongRequest roomRequest) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
                
        // Store original status to check if it changed
        com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai originalStatus = hopDongPhong.getTrangThai();
        
        hopDongPhong.setTienPhong(roomRequest.getTienPhong());
        hopDongPhong.setTienCoc(roomRequest.getTienCoc());
        hopDongPhong.setNgayKetThuc(roomRequest.getNgayKetThuc());
        hopDongPhong.setTrangThai(roomRequest.getTrangThai());
        
        HopDongPhong savedContract = hopDongPhongRepository.save(hopDongPhong);
        
        // Sync with tenant-contract relationships if status changed to inactive
        if (originalStatus == com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong &&
            roomRequest.getTrangThai() == com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa) {
            try {
                System.out.println("Contract status changed to deleted, updating tenant relationships");
                // Note: Tenant relationships will be handled by the HopDongKhachThueService 
                // when individual tenants are removed via the UI
            } catch (Exception e) {
                System.err.println("Failed to sync tenant relationships on contract update: " + e.getMessage());
            }
        }
        
        return mapToHopDongPhongResponse(savedContract);
    }

    /**
     * Automatically update expired contracts
     */
    public void updateExpiredContracts() {
        try {
            LocalDate today = LocalDate.now();
            List<HopDongPhong> activeContracts = hopDongPhongRepository.findByTrangThai(
                com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong);
            
            int updatedCount = 0;
            for (HopDongPhong contract : activeContracts) {
                if (contract.getNgayKetThuc().isBefore(today)) {
                    System.out.println("Marking contract " + contract.getMaHopDongPhong() + " as expired");
                    contract.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa);
                    hopDongPhongRepository.save(contract);
                    
                    // Update room status back to available
                    Phong phong = contract.getPhong();
                    phong.setTrangThai(TrangThai.phongTrong);
                    phongRepository.save(phong);
                    
                    updatedCount++;
                }
            }
            
            if (updatedCount > 0) {
                System.out.println("Updated " + updatedCount + " expired contracts");
            }
        } catch (Exception e) {
            System.err.println("Error updating expired contracts: " + e.getMessage());
        }
    }
    
    /**
     * Check tenant debts before contract liquidation
     */
    public Map<String, Object> checkContractDebts(Integer contractId) {
        Map<String, Object> result = new HashMap<>();
        try {
            // This would integrate with invoice/debt management system
            // For now, return mock data structure
            result.put("totalDebt", 0.0);
            result.put("hasDebt", false);
            result.put("debtDetails", new ArrayList<>());
            result.put("canLiquidate", true);
            
            // TODO: Integrate with actual debt checking logic
            // Query invoice system for unpaid bills
            // Calculate total outstanding amount
            
            return result;
        } catch (Exception e) {
            System.err.println("Error checking contract debts: " + e.getMessage());
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    /**
     * Calculate deposit refund for contract liquidation
     */
    public Map<String, Object> calculateDepositRefund(Integer contractId) {
        Map<String, Object> result = new HashMap<>();
        try {
            HopDongPhong contract = hopDongPhongRepository.findById(contractId)
                .orElseThrow(() -> new ReseourceNotFoundException("Contract not found: " + contractId));
            
            // Get debt information
            Map<String, Object> debtInfo = checkContractDebts(contractId);
            Double totalDebt = (Double) debtInfo.get("totalDebt");
            
            // Calculate refund
            Double depositAmount = contract.getTienCoc().doubleValue();
            Double refundAmount = Math.max(0, depositAmount - totalDebt);
            
            result.put("originalDeposit", depositAmount);
            result.put("totalDebt", totalDebt);
            result.put("refundAmount", refundAmount);
            result.put("hasRefund", refundAmount > 0);
            
            return result;
        } catch (Exception e) {
            System.err.println("Error calculating deposit refund: " + e.getMessage());
            result.put("error", e.getMessage());
            return result;
        }
    }

    @Override
    public void deleteHopDongPhong(Integer id) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
                
        // Check debts before liquidation
        Map<String, Object> debtInfo = checkContractDebts(id);
        Boolean hasDebt = (Boolean) debtInfo.get("hasDebt");
        
        if (hasDebt != null && hasDebt) {
            Double totalDebt = (Double) debtInfo.get("totalDebt");
            System.out.println("Warning: Contract has outstanding debt of " + totalDebt);
            // In a real system, you might want to prevent deletion or require confirmation
        }
        
        // Calculate deposit refund
        Map<String, Object> refundInfo = calculateDepositRefund(id);
        Double refundAmount = (Double) refundInfo.get("refundAmount");
        System.out.println("Deposit refund amount: " + refundAmount);
        
        // Get room for status update
        Phong phong = hopDongPhong.getPhong();
        
        // Soft delete the contract
        hopDongPhong.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa);
        hopDongPhongRepository.save(hopDongPhong);
        
        // Update room status back to available (phongTrong)
        phong.setTrangThai(TrangThai.phongTrong);
        phongRepository.save(phong);
        System.out.println("Updated room " + phong.getTenPhong() + " status to available");
        
        // Sync with tenant-contract relationships - mark all tenants as moved out
        try {
            System.out.println("Contract liquidated, handling tenant relationships for contract: " + id);
            // Get all tenants for this contract and mark them as moved out
            List<Map<String, Object>> tenants = hopDongKhachThueService.getContractTenants(id);
            for (Map<String, Object> tenant : tenants) {
                Object tenantIdObj = tenant.get("maKhachThue");
                if (tenantIdObj != null) {
                    Integer tenantId = tenantIdObj instanceof Integer ? (Integer) tenantIdObj : Integer.parseInt(tenantIdObj.toString());
                    hopDongKhachThueService.removeTenantFromContract(id, tenantId);
                }
            }
            System.out.println("Successfully updated tenant relationships on contract liquidation");
        } catch (Exception e) {
            System.err.println("Failed to sync tenant relationships on contract liquidation: " + e.getMessage());
            // Log error but don't fail the contract liquidation
        }
    }

    @Override
    public void printHopDongPhong(HttpServletResponse response, Integer id) {
        // Use the new professional contract generator instead of template-based approach
        generateProfessionalContract(response, id);
    }

    /**
     * Generate professional contract DOCX using HopDongExporter
     */
    public void generateProfessionalContract(HttpServletResponse response, Integer id) {
        // 1. Get contract data
        HopDongPhong hopDong = hopDongPhongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        try {
            // 2. Get tenant information from HopDongKhachThue service
            List<Map<String, Object>> contractTenants = hopDongKhachThueService.getContractTenants(id);
            
            // For simplicity, use the first tenant as main tenant (representative)
            String tenantName = "Chưa có khách thuê";
            String tenantCccd = "";
            String tenantAddress = "";
            String tenantPhone = "";
            java.util.Date tenantBirthDate = null;
            
            if (!contractTenants.isEmpty()) {
                Map<String, Object> mainTenant = contractTenants.get(0);
                tenantName = (String) mainTenant.getOrDefault("hoTen", "Chưa có tên");
                tenantCccd = (String) mainTenant.getOrDefault("maCanCuoc", "");
                tenantAddress = (String) mainTenant.getOrDefault("thuongTru", "");
                tenantPhone = (String) mainTenant.getOrDefault("dienThoai", "");
                // Note: We'd need to get birth date from tenant data if available
            }

            // 3. Create HopDongData from the contract entity
            HopDongData.PersonInfo benA = new HopDongData.PersonInfo(
                hopDong.getTaiKhoan().getMaTaiKhoan(),
                hopDong.getTaiKhoan().getMaCanCuoc(),
                hopDong.getTaiKhoan().getEmail(),
                hopDong.getTaiKhoan().getHoTen(),
                hopDong.getTaiKhoan().getDienThoai(),
                hopDong.getTaiKhoan().getThuongTru(),
                null // We don't have birth date in TaiKhoan
            );

            HopDongData.PersonInfo benB = new HopDongData.PersonInfo(
                null, // Tenant ID not available directly
                tenantCccd,
                "", // Tenant email not available
                tenantName,
                tenantPhone,
                tenantAddress,
                tenantBirthDate
            );

            HopDongData hopDongData = new HopDongData(
                benA,
                benB,
                hopDong.getPhong().getDiaChi(),
                hopDong.getTienPhong() != null ? hopDong.getTienPhong().longValue() : 0L,
                3500L, // Default electricity rate - this should come from service configuration
                15000L, // Default water rate - this should come from service configuration
                hopDong.getDvRac() != null ? hopDong.getDvRac() : false,
                hopDong.getDvWifi() != null ? hopDong.getDvWifi() : false,
                hopDong.getDvCap() != null ? hopDong.getDvCap() : false,
                hopDong.getDvKhac() != null ? hopDong.getDvKhac() : false,
                50000L, // Default waste fee
                100000L, // Default wifi fee
                150000L, // Default cable fee
                0L, // Default other service fee
                hopDong.getTienCoc() != null ? hopDong.getTienCoc().longValue() : 0L,
                hopDong.getNgayBatDau(),
                hopDong.getNgayKetThuc(),
                hopDong.getNgayTao() // Use creation date as signing date
            );

            // 4. Generate DOCX using HopDongExporter
            byte[] docxBytes = HopDongExporter.exportHopDongToBytes(hopDongData);

            // 5. Set response headers for DOCX download
            response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            response.setHeader("Content-Disposition", 
                String.format("attachment; filename=\"hop-dong-%d.docx\"", id));
            response.setContentLength(docxBytes.length);

            // 6. Write DOCX to response
            response.getOutputStream().write(docxBytes);
            response.getOutputStream().flush();

        } catch (Exception e) {
            System.err.println("Professional Contract Generation Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generating professional contract: " + e.getMessage(), e);
        }
    }


    @Override
    public List<HopDongPhongResponse> findAllNotHasHoaDonByThangAndNam(int thang, int nam) {
        YearMonth currentMonth=YearMonth.of(nam,thang);
        List<HopDongPhong>temp=hopDongPhongRepository.findAllNotHasHoaDonByThangAndNam(thang,nam);
        return hopDongPhongRepository.findAllNotHasHoaDonByThangAndNam(thang,nam).stream()
                .filter(hd->{
                    YearMonth ngayBatDau=YearMonth.of(hd.getNgayBatDau().getYear(),hd.getNgayBatDau().getMonth());
                    YearMonth ngayKetThuc=YearMonth.of(hd.getNgayKetThuc().getYear(),hd.getNgayKetThuc().getMonth());
                    return (ngayBatDau.isBefore(currentMonth) || ngayBatDau.equals(currentMonth)) &&
                            (ngayKetThuc.isAfter(currentMonth) || ngayKetThuc.equals(currentMonth));
                }).map(this::mapToHopDongPhongResponse )
                .toList();
    }

    /**
     * Get tenants for a specific room by finding active contracts and their tenant relationships
     */
    public List<Map<String, Object>> getRoomTenants(Integer roomId) {
        try {
            System.out.println("HopDongPhongService.getRoomTenants called for room ID: " + roomId);

            // Find active contracts for the room
            List<HopDongPhong> activeContracts = hopDongPhongRepository
                .findByPhongMaPhongAndTrangThai(roomId, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong);

            if (activeContracts.isEmpty()) {
                System.out.println("No active contracts found for room " + roomId);
                return List.of();
            }

            // For each active contract, get its tenants
            List<Map<String, Object>> allTenants = new ArrayList<>();
            for (HopDongPhong contract : activeContracts) {
                System.out.println("Getting tenants for contract ID: " + contract.getMaHopDongPhong());
                List<Map<String, Object>> contractTenants = hopDongKhachThueService
                    .getContractTenants(contract.getMaHopDongPhong());

                // Add contract info to each tenant
                for (Map<String, Object> tenant : contractTenants) {
                    tenant.put("ma_hop_dong_phong", contract.getMaHopDongPhong());
                    tenant.put("ten_phong", contract.getPhong().getTenPhong());
                    tenant.put("ngay_bat_dau_hop_dong", contract.getNgayBatDau());
                    tenant.put("ngay_ket_thuc_hop_dong", contract.getNgayKetThuc());
                }

                allTenants.addAll(contractTenants);
            }

            System.out.println("Found " + allTenants.size() + " tenants for room " + roomId);
            return allTenants;

        } catch (Exception e) {
            System.err.println("Error in getRoomTenants for room " + roomId + ": " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
    
    /**
     * Get room status summary
     */
    public Map<String, Object> getRoomStatusSummary() {
        Map<String, Object> summary = new HashMap<>();
        try {
            // Count rooms by status
            long totalRooms = phongRepository.count();
            long availableRooms = phongRepository.countByTrangThai(TrangThai.phongTrong);
            long occupiedRooms = phongRepository.countByTrangThai(TrangThai.hoatDong);
            
            summary.put("totalRooms", totalRooms);
            summary.put("availableRooms", availableRooms);
            summary.put("occupiedRooms", occupiedRooms);
            summary.put("occupancyRate", totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0);
            
            return summary;
        } catch (Exception e) {
            System.err.println("Error getting room status summary: " + e.getMessage());
            summary.put("error", e.getMessage());
            return summary;
        }
    }
    
    /**
     * Update room status based on contract status
     */
    public void syncRoomStatusWithContracts() {
        try {
            System.out.println("Syncing room statuses with contract statuses...");
            
            // Get all active contracts
            List<HopDongPhong> activeContracts = hopDongPhongRepository.findByTrangThai(
                com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong);
            
            Set<Integer> occupiedRoomIds = activeContracts.stream()
                .map(contract -> contract.getPhong().getMaPhong())
                .collect(Collectors.toSet());
            
            // Update all rooms to correct status
            List<Phong> allRooms = phongRepository.findAll();
            for (Phong room : allRooms) {
                TrangThai expectedStatus = occupiedRoomIds.contains(room.getMaPhong()) 
                    ? TrangThai.hoatDong : TrangThai.phongTrong;
                
                if (room.getTrangThai() != expectedStatus) {
                    System.out.println("Updating room " + room.getTenPhong() + " from " 
                        + room.getTrangThai() + " to " + expectedStatus);
                    room.setTrangThai(expectedStatus);
                    phongRepository.save(room);
                }
            }
            
            System.out.println("Room status sync completed");
        } catch (Exception e) {
            System.err.println("Error syncing room statuses: " + e.getMessage());
        }
    }

    /**
     * Terminate a contract and update room status when all tenants are removed
     * This method is called when the last tenant is removed from a contract
     */
    public void terminateContractWhenEmpty(Integer contractId) {
        try {
            System.out.println("Terminating contract " + contractId + " due to no remaining tenants");
            
            // Find the contract
            HopDongPhong contract = hopDongPhongRepository.findById(contractId)
                .orElseThrow(() -> new ReseourceNotFoundException("Contract not found with id: " + contractId));
            
            // Check if contract is currently active
            if (contract.getTrangThai() == com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong) {
                // Update contract status to terminated
                contract.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa);
                hopDongPhongRepository.save(contract);
                System.out.println("Contract " + contractId + " status updated to 'daXoa' (terminated)");
                
                // Update room status to available
                Phong phong = contract.getPhong();
                phong.setTrangThai(TrangThai.phongTrong);
                phongRepository.save(phong);
                System.out.println("Room " + phong.getTenPhong() + " status updated to 'phongTrong' (available)");
            } else {
                System.out.println("Contract " + contractId + " is not active - no action taken");
            }
            
        } catch (Exception e) {
            System.err.println("Error terminating empty contract " + contractId + ": " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception to avoid rolling back tenant removal
        }
    }
}