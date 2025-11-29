package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.deepoove.poi.XWPFTemplate;
// OpenHTMLtoPDF imports for PDF generation
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.exception.HopDongAlreadyExists;
import com.so_tro_online.quan_ly_hop_dong_phong.exception.EmailNotificationException;
import com.so_tro_online.quan_ly_hop_dong_phong.notification.NotificationService;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;

import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
// Removed HoaDon imports to break circular dependency
// import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
// import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
// Removed PhieuThu imports to break circular dependency
// import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
// import com.so_tro_online.quan_ly_phieu_thu.repository.PhieuThuRepository;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HopDongPhongService implements IHopDongPhongService {

    private static final Logger logger = LoggerFactory.getLogger(HopDongPhongService.class);

    private final EmailRentRoomService emailRentRoomService;
    private final NotificationService notificationService;
    private final PhongRepository phongRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    private final SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
    
    // Dependency for managing tenant-contract relationships
    @Autowired
    private HopDongKhachThueService hopDongKhachThueService;
    
    @Autowired
    private KhachThueRepository khachThueRepository;

    // Lazy injection to break circular dependency


    /*@Autowired
    @Lazy
    public void setHoaDonRepository(HoaDonRepository hoaDonRepository) {
        this.hoaDonRepository = hoaDonRepository;
    }

    @Autowired
    @Lazy
    public void setPhieuThuRepository(PhieuThuRepository phieuThuRepository) {
        this.phieuThuRepository = phieuThuRepository;
    }*/
    
    public HopDongPhongService(
            PhongRepository phongRepository,
            TaiKhoanRepository taiKhoanRepository,
            HopDongPhongRepository hopDongPhongRepository,
            EmailRentRoomService emailRentRoomService,
            NotificationService notificationService
    ) {
        this.phongRepository = phongRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
        this.emailRentRoomService = emailRentRoomService;
        this.notificationService = notificationService;
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
    
    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongActiveByUser(Integer maTaiKhoan) {
        return hopDongPhongRepository.findByTaiKhoanMaTaiKhoanAndTrangThai(maTaiKhoan, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }
    
    @Override
    public Page<HopDongPhongResponse> getAllHopDongPhongActivePagedByUser(Integer maTaiKhoan, Pageable pageable) {
        return hopDongPhongRepository.findByTaiKhoanMaTaiKhoanAndTrangThai(maTaiKhoan, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong, pageable)
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
        logger.debug("=== CREATE CONTRACT DEBUG ===");
        logger.debug("maTaiKhoan = {}", hopDongRequest.getMaTaiKhoan());
        logger.debug("maKhachThue (main tenant) = {}", hopDongRequest.getMaKhachThue());
        logger.debug("additionalTenantIds = {}", hopDongRequest.getAdditionalTenantIds());
        logger.debug("maximumTenants = {}", hopDongRequest.getMaximumTenants());
        logger.debug("phong = {}", hopDongRequest.getMaPhong());
        
        // Validate account exists
        TaiKhoan taiKhoan = taiKhoanRepository.findByMaTaiKhoanAndTrangThai(
                hopDongRequest.getMaTaiKhoan(), 
                com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong
        ).orElseThrow(() -> new ReseourceNotFoundException(
                "không tìm thấy người dùng với id: " + hopDongRequest.getMaTaiKhoan()));
        
        // Validate room is available
        Phong phong = phongRepository.findByMaPhongAndTrangThai(
                hopDongRequest.getMaPhong(), 
                TrangThai.phongTrong
        ).orElseThrow(() -> new ReseourceNotFoundException(
                "không tìm thấy phòng trống với id: " + hopDongRequest.getMaPhong()));
        
        // Check if room already has an active contract
        if (hopDongPhongRepository.existsByPhongAndTrangThai(phong, 
                com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)) {
            throw new HopDongAlreadyExists("phòng này đã được thuê");
        }
        
        // Collect all tenant IDs (main tenant + additional tenants)
        Set<Integer> allTenantIds = new HashSet<>();
        if (hopDongRequest.getMaKhachThue() != null) {
            allTenantIds.add(hopDongRequest.getMaKhachThue());
        }
        if (hopDongRequest.getAdditionalTenantIds() != null) {
            allTenantIds.addAll(hopDongRequest.getAdditionalTenantIds());
        }
        
        // Validate tenant limit using room's maximum tenant setting
        Integer maxTenants = phong.getSoLuongKhachToiDa() != null ? 
                phong.getSoLuongKhachToiDa() : 4; // Default max 4 tenants if not set
        if (allTenantIds.size() > maxTenants) {
            throw new RuntimeException(String.format(
                    "Số lượng khách thuê (%d) vượt quá giới hạn tối đa của phòng (%d)", 
                    allTenantIds.size(), maxTenants));
        }
        
        // Validate all tenants exist and are active
        for (Integer tenantId : allTenantIds) {
            // Check tenant exists and is active
            if (!khachThueRepository.existsByMaKhachAndTrangThai(
                    tenantId, com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.hoatDong)) {
                throw new RuntimeException("Khách thuê với ID " + tenantId + " không tồn tại hoặc không hoạt động");
            }
            // Note: Removed active contract check - tenants can now rent multiple rooms
        }
        
        // Create contract entity
        HopDongPhong hopDongPhong = new HopDongPhong();
        hopDongPhong.setPhong(phong);
        hopDongPhong.setTaiKhoan(taiKhoan);
        hopDongPhong.setTienPhong(hopDongRequest.getTienPhong() != null ? 
                hopDongRequest.getTienPhong() : phong.getGiaThueCoBan());
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
        logger.info("Saved contract with ID: {}", savedContract.getMaHopDongPhong());
        
        // Update room status from 'phongTrong' to 'hoatDong' after successful contract creation
        phong.setTrangThai(TrangThai.hoatDong);
        phongRepository.save(phong);
        
        // Create tenant-contract relationships for all tenants
        List<String> failedTenants = new ArrayList<>();
        
        // Add main tenant first (as representative)
        if (hopDongRequest.getMaKhachThue() != null) {
            try {
                logger.debug("Adding main tenant (representative): {}", hopDongRequest.getMaKhachThue());
                hopDongKhachThueService.addTenantToContract(
                    savedContract.getMaHopDongPhong(), 
                    hopDongRequest.getMaKhachThue(), 
                    maxTenants
                );
                logger.debug("Successfully added main tenant");
            } catch (Exception e) {
                logger.error("Failed to add main tenant: {}", e.getMessage());
                failedTenants.add("Main tenant ID: " + hopDongRequest.getMaKhachThue());
            }
        }
        
        // Add additional tenants
        if (hopDongRequest.getAdditionalTenantIds() != null) {
            for (Integer tenantId : hopDongRequest.getAdditionalTenantIds()) {
                try {
                    logger.debug("Adding additional tenant: {}", tenantId);
                    hopDongKhachThueService.addTenantToContract(
                        savedContract.getMaHopDongPhong(), 
                        tenantId, 
                        maxTenants
                    );
                    logger.debug("Successfully added additional tenant: {}", tenantId);
                } catch (Exception e) {
                    logger.error("Failed to add tenant {}: {}", tenantId, e.getMessage());
                    failedTenants.add("Tenant ID: " + tenantId);
                }
            }
        }
        
        // Log any failures but don't fail the contract creation
        if (!failedTenants.isEmpty()) {
            logger.warn("Some tenants could not be added to the contract: {}", failedTenants);
            logger.warn("Contract created successfully, but tenant relationships can be managed later via the UI");
        }

        // Collect all tenants for the email notification
        List<com.so_tro_online.quan_ly_khach_thue.entity.KhachThue> allTenants = new ArrayList<>();
        List<String> tenantEmails = new ArrayList<>();
        
        for (Integer tenantId : allTenantIds) {
            try {
                java.util.Optional<com.so_tro_online.quan_ly_khach_thue.entity.KhachThue> tenantOpt = 
                    khachThueRepository.findById(tenantId);
                if (tenantOpt.isPresent()) {
                    com.so_tro_online.quan_ly_khach_thue.entity.KhachThue tenant = tenantOpt.get();
                    // Check if tenant is active
                    if (tenant.getTrangThai() == com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.hoatDong) {
                        allTenants.add(tenant);
                        // Collect email addresses for notification
                        if (tenant.getEmail() != null && !tenant.getEmail().trim().isEmpty()) {
                            tenantEmails.add(tenant.getEmail().trim());
                            logger.debug("Added tenant email for notification: {}", tenant.getEmail());
                        } else {
                            logger.debug("Warning: Tenant {} (ID: {}) has no email address", tenant.getHoTen(), tenantId);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Could not retrieve tenant {} for email: {}", tenantId, e.getMessage());
            }
        }

        // Create the Kafka message with all tenant and contract information
        RentRoomMessage rentRoomMessage = new RentRoomMessage();
        rentRoomMessage.setMaHopDongPhong(savedContract.getMaHopDongPhong());
        rentRoomMessage.setPhong(phong);
        rentRoomMessage.setTienPhong(savedContract.getTienPhong());
        rentRoomMessage.setKhachThue(allTenants);
        rentRoomMessage.setTienCoc(savedContract.getTienCoc());
        rentRoomMessage.setNgayBatDau(savedContract.getNgayBatDau());
        rentRoomMessage.setNgayKetThuc(savedContract.getNgayKetThuc());
        rentRoomMessage.setTaiKhoan(taiKhoan);
        rentRoomMessage.setNgayTao(LocalDate.now());
        
        // Send notification only if we have tenants
        if (!allTenants.isEmpty()) {
            logger.info("Sending Kafka notification for contract {} to {} email addresses: {}", 
                       savedContract.getMaHopDongPhong(), tenantEmails.size(), tenantEmails);
            try {
                notificationService.sentRentConfirm(rentRoomMessage);
                logger.info("Kafka notification sent successfully for contract: {}", savedContract.getMaHopDongPhong());
            } catch (Exception kafkaException) {
                // Create custom exception with detailed information
                EmailNotificationException emailNotificationException = new EmailNotificationException(
                    "Failed to send Kafka notification for contract " + savedContract.getMaHopDongPhong(),
                    savedContract.getMaHopDongPhong().toString(),
                    "contract-confirmation",
                    kafkaException
                );
                
                logger.error("Email notification failed: {}", emailNotificationException.toString());
                logger.warn("Contract created successfully, but email notification failed. Email can be sent manually later.");

                
                // Don't throw exception - contract creation should succeed even if email fails
                // In a production system, you might want to:
                // 1. Log this to a monitoring system
                // 2. Queue the email for retry
                // 3. Send notification to admin
            }
        } else {
            logger.info("No active tenants found for email notification");
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
                    logger.info("Marking contract {} as expired", contract.getMaHopDongPhong());
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
                logger.info("Updated {} expired contracts", updatedCount);
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
            logger.error("Error checking contract debts: {}", e.getMessage());
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
            logger.error("Error calculating deposit refund: {}", e.getMessage());
            result.put("error", e.getMessage());
            return result;
        }
    }

    @Override
    public void deleteHopDongPhong(Integer id) {
        HopDongPhong hopDongPhong = hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: " + id));
        
        logger.info("Attempting to delete contract with ID: {}", id);
        
        // Mark related invoices as DA_XOA using lazy-injected repository
        /*if (hoaDonRepository != null) {
            List<HoaDon> relatedInvoices = hoaDonRepository.findByHopDongPhong(hopDongPhong);
            if (!relatedInvoices.isEmpty()) {
                logger.info("Found {} related invoices for contract {}. Marking them as DA_XOA.", relatedInvoices.size(), id);
                
                for (HoaDon invoice : relatedInvoices) {
                    // Mark invoice as deleted (DA_XOA)
                    invoice.setTrangThai(com.so_tro_online.quan_ly_hoa_don.entity.TrangThai.DA_XOA);
                    hoaDonRepository.save(invoice);
                    logger.debug("Marked invoice {} as DA_XOA", invoice.getMaHoaDon());
                }
                
                logger.info("Successfully marked {} invoices as DA_XOA for contract {}", relatedInvoices.size(), id);
            }
        }
        
        // Mark related receipts as DA_XOA using lazy-injected repository
        if (phieuThuRepository != null) {
            List<PhieuThu> relatedReceipts = phieuThuRepository.findByHoaDon_HopDongPhong(hopDongPhong);
            if (!relatedReceipts.isEmpty()) {
                logger.info("Found {} related receipts for contract {}. Marking them as DA_XOA.", relatedReceipts.size(), id);
                
                for (PhieuThu receipt : relatedReceipts) {
                    // Mark receipt as deleted (DA_XOA)
                    receipt.setTrangThai(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai.daXoa);
                    phieuThuRepository.save(receipt);
                    logger.debug("Marked receipt {} as DA_XOA", receipt.getMaPhieuThu());
                }
                
                logger.info("Successfully marked {} receipts as DA_XOA for contract {}", relatedReceipts.size(), id);
            }
        }*/
        
        logger.info("Related invoices and receipts have been marked as DA_XOA. Proceeding with contract deletion.");
        
        // Check debts before liquidation
        Map<String, Object> debtInfo = checkContractDebts(id);
        Boolean hasDebt = (Boolean) debtInfo.get("hasDebt");
        
        if (hasDebt != null && hasDebt) {
            Double totalDebt = (Double) debtInfo.get("totalDebt");
            logger.warn("Warning: Contract has outstanding debt of {}", totalDebt);
            // In a real system, you might want to prevent deletion or require confirmation
        }
        
        // Calculate deposit refund
        Map<String, Object> refundInfo = calculateDepositRefund(id);
        Double refundAmount = (Double) refundInfo.get("refundAmount");
        logger.info("Deposit refund amount: {}", refundAmount);
        
        // Get room for status update
        Phong phong = hopDongPhong.getPhong();
        
        // Soft delete the contract
        hopDongPhong.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa);
        hopDongPhongRepository.save(hopDongPhong);
        logger.info("Contract {} marked as deleted (DA_XOA)", id);
        
        // Update room status back to available (phongTrong)
        phong.setTrangThai(TrangThai.phongTrong);
        phongRepository.save(phong);
        logger.info("Updated room {} status to available", phong.getTenPhong());
        
        // Sync with tenant-contract relationships - mark all tenants as moved out
        try {
            logger.info("Contract liquidated, handling tenant relationships for contract: {}", id);
            // Get all tenants for this contract and mark them as moved out
            List<Map<String, Object>> tenants = hopDongKhachThueService.getContractTenants(id);
            for (Map<String, Object> tenant : tenants) {
                Object tenantIdObj = tenant.get("maKhachThue");
                if (tenantIdObj != null) {
                    Integer tenantId = tenantIdObj instanceof Integer ? (Integer) tenantIdObj : Integer.parseInt(tenantIdObj.toString());
                    hopDongKhachThueService.removeTenantFromContract(id, tenantId);
                }
            }
            logger.info("Successfully updated tenant relationships on contract liquidation");
        } catch (Exception e) {
            logger.error("Failed to sync tenant relationships on contract liquidation: {}", e.getMessage());
            // Log error but don't fail the contract liquidation
        }
        
        logger.info("Contract {} deletion completed successfully", id);
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