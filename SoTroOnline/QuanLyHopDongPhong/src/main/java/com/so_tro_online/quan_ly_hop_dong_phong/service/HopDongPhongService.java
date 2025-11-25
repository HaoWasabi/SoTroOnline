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

import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;

// Import for tenant-contract relationship management
import com.so_tro_online.quan_ly_hop_dong_khach_thue.service.HopDongKhachThueService;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;

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
        // 1. Lấy dữ liệu hợp đồng
        HopDongPhong hopDong = hopDongPhongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        // 2. Chuẩn bị dữ liệu cho template (Note: Tenant info now from HopDongKhachThue)
        Map<String, Object> data = new HashMap<>();
        data.put("maHopDongPhong", hopDong.getMaHopDongPhong());
        data.put("tenQuanLy", hopDong.getTaiKhoan().getHoTen());
        data.put("soDienThoaiQuanLy",hopDong.getTaiKhoan().getDienThoai());
        data.put("diaChiQuanLy",hopDong.getTaiKhoan().getThuongTru());
        // Note: Tenant data should now be retrieved from HopDongKhachThue service
        data.put("tenKhach", ""); // To be populated from HopDongKhachThue
        data.put("cccdKhach",hopDong.getTaiKhoan().getMaCanCuoc());
        data.put("diaChiKhach",""); // To be populated from HopDongKhachThue
        data.put("tenPhong", hopDong.getPhong().getTenPhong());
        data.put("diaChiPhong", hopDong.getPhong().getDiaChi());
        data.put("dienTichPhong", hopDong.getPhong().getChieuDai().multiply(hopDong.getPhong().getChieuRong()));
        data.put("tienPhong", hopDong.getTienPhong());
        data.put("tienCoc", hopDong.getTienCoc());
        data.put("dvRac", hopDong.getDvRac());
        data.put("dvWifi", hopDong.getDvWifi());
        data.put("dvCap", hopDong.getDvCap());
        data.put("dvKhac", hopDong.getDvKhac());
        data.put("ngayBatDau", df.format(hopDong.getNgayBatDau()));
        data.put("ngayKetThuc", df.format(hopDong.getNgayKetThuc()));
        data.put("ngayTao", df.format(hopDong.getNgayTao()));

        // 3. Nạp template Word
        try (var templateStream = getClass().getResourceAsStream("/templates/template-hopdong.docx");
             var out = response.getOutputStream()) {

            if (templateStream == null) {
                throw new IllegalStateException("Không tìm thấy file template-hopdong.docx trong resources/templates/");
            }

            XWPFTemplate template = XWPFTemplate.compile(templateStream).render(data);

            // 4. Thiết lập header tải file
            response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            response.setHeader("Content-Disposition", "attachment; filename=hop-dong-" + id + ".docx");

            // 5. Ghi trực tiếp ra response
            template.write(out);
            out.flush();
            template.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void generateContractPDF(HttpServletResponse response, Integer id) {
        // 1. Get contract data
        HopDongPhong hopDong = hopDongPhongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        try {
            // 2. Set response headers for PDF download
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", 
                String.format("attachment; filename=\"contract_%d.pdf\"", id));

            // 3. Generate HTML content for the contract
            String htmlContent = generateContractHTML(hopDong);

            // 4. Convert HTML to PDF using OpenHTMLtoPDF
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(outputStream);
                builder.run();

                // 5. Write PDF to response
                byte[] pdfBytes = outputStream.toByteArray();
                response.getOutputStream().write(pdfBytes);
                response.getOutputStream().flush();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage());
        }
    }

    private String generateContractHTML(HopDongPhong hopDong) {
        // Safely extract contract data with explicit type conversion
        String contractId = String.valueOf(hopDong.getMaHopDongPhong());
        String managerName = hopDong.getTaiKhoan().getHoTen() != null ? hopDong.getTaiKhoan().getHoTen() : "N/A";
        String managerPhone = hopDong.getTaiKhoan().getDienThoai() != null ? hopDong.getTaiKhoan().getDienThoai() : "N/A";
        String managerAddress = hopDong.getTaiKhoan().getThuongTru() != null ? hopDong.getTaiKhoan().getThuongTru() : "N/A";
        String roomName = hopDong.getPhong().getTenPhong() != null ? hopDong.getPhong().getTenPhong() : "N/A";
        String roomAddress = hopDong.getPhong().getDiaChi() != null ? hopDong.getPhong().getDiaChi() : "N/A";
        String roomArea = hopDong.getPhong().getChieuDai() != null && hopDong.getPhong().getChieuRong() != null ?
            hopDong.getPhong().getChieuDai().multiply(hopDong.getPhong().getChieuRong()).toString() : "N/A";
        
        // Safely convert BigDecimal to formatted strings
        String tienPhongFormatted = "0";
        String tienCocFormatted = "0";
        
        try {
            if (hopDong.getTienPhong() != null) {
                long tienPhongLong = hopDong.getTienPhong().longValue();
                tienPhongFormatted = String.format("%,d", tienPhongLong);
            }
        } catch (Exception e) {
            System.err.println("Error formatting tienPhong: " + e.getMessage());
            tienPhongFormatted = hopDong.getTienPhong() != null ? hopDong.getTienPhong().toString() : "0";
        }
        
        try {
            if (hopDong.getTienCoc() != null) {
                long tienCocLong = hopDong.getTienCoc().longValue();
                tienCocFormatted = String.format("%,d", tienCocLong);
            }
        } catch (Exception e) {
            System.err.println("Error formatting tienCoc: " + e.getMessage());
            tienCocFormatted = hopDong.getTienCoc() != null ? hopDong.getTienCoc().toString() : "0";
        }
        
        // Safely format LocalDate to String
        String ngayBatDauFormatted = "N/A";
        String ngayKetThucFormatted = "N/A";
        String ngayTaoFormatted = "N/A";
        
        try {
            if (hopDong.getNgayBatDau() != null) {
                ngayBatDauFormatted = hopDong.getNgayBatDau().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
        } catch (Exception e) {
            System.err.println("Error formatting ngayBatDau: " + e.getMessage());
            ngayBatDauFormatted = hopDong.getNgayBatDau() != null ? hopDong.getNgayBatDau().toString() : "N/A";
        }
        
        try {
            if (hopDong.getNgayKetThuc() != null) {
                ngayKetThucFormatted = hopDong.getNgayKetThuc().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
        } catch (Exception e) {
            System.err.println("Error formatting ngayKetThuc: " + e.getMessage());
            ngayKetThucFormatted = hopDong.getNgayKetThuc() != null ? hopDong.getNgayKetThuc().toString() : "N/A";
        }
        
        try {
            if (hopDong.getNgayTao() != null) {
                ngayTaoFormatted = hopDong.getNgayTao().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
        } catch (Exception e) {
            System.err.println("Error formatting ngayTao: " + e.getMessage());
            ngayTaoFormatted = hopDong.getNgayTao() != null ? hopDong.getNgayTao().toString() : "N/A";
        }

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8"></meta>
                <title>Contract</title>
                <style>
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12pt;
                        line-height: 1.4;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        font-size: 18pt;
                        font-weight: bold;
                        margin-bottom: 30px;
                        text-transform: uppercase;
                        color: #2c5aa0;
                    }
                    .contract-info {
                        margin-bottom: 25px;
                    }
                    .info-row {
                        display: flex;
                        margin-bottom: 8px;
                        padding: 5px 0;
                        border-bottom: 1px dotted #ddd;
                    }
                    .info-label {
                        font-weight: bold;
                        width: 150px;
                        flex-shrink: 0;
                        color: #555;
                    }
                    .info-value {
                        flex: 1;
                    }
                    .services-section {
                        margin: 25px 0;
                    }
                    .services-title {
                        font-weight: bold;
                        font-size: 14pt;
                        color: #2c5aa0;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #2c5aa0;
                        padding-bottom: 5px;
                    }
                    .services-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-left: 20px;
                    }
                    .service-item {
                        display: flex;
                        align-items: center;
                        padding: 5px 0;
                    }
                    .service-check {
                        width: 12px;
                        height: 12px;
                        border: 1px solid #333;
                        margin-right: 8px;
                        display: inline-block;
                        position: relative;
                    }
                    .service-check.checked {
                        background-color: #2c5aa0;
                    }
                    .service-check.checked:after {
                        content: '✓';
                        color: white;
                        font-size: 10px;
                        position: absolute;
                        top: -2px;
                        left: 2px;
                    }
                    .signatures {
                        margin-top: 50px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-box {
                        text-align: center;
                        width: 200px;
                    }
                    .signature-title {
                        font-weight: bold;
                        margin-bottom: 60px;
                        color: #555;
                    }
                    .signature-line {
                        border-top: 1px solid #333;
                        margin-top: 10px;
                        padding-top: 5px;
                        font-size: 10pt;
                        color: #666;
                    }
                    .amount {
                        color: #d9534f;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class=\"header\">Hợp Đồng Thuê Phòng Trọ</div>
                
                <div class=\"contract-info\">
                    <div class=\"info-row\">
                        <span class=\"info-label\">Mã hợp đồng:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Quản lý:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Số điện thoại:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Địa chỉ quản lý:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Tên phòng:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Địa chỉ phòng:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Diện tích:</span>
                        <span class=\"info-value\">%s m²</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Tiền phòng:</span>
                        <span class=\"info-value amount\">%s VNĐ</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Tiền cọc:</span>
                        <span class=\"info-value amount\">%s VNĐ</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Ngày bắt đầu:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Ngày kết thúc:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                    <div class=\"info-row\">
                        <span class=\"info-label\">Ngày tạo:</span>
                        <span class=\"info-value\">%s</span>
                    </div>
                </div>
                
                <div class=\"services-section\">
                    <div class=\"services-title\">Dịch vụ bao gồm:</div>
                    <div class=\"services-grid\">
                        <div class=\"service-item\">
                            <span class=\"service-check %s\"></span>
                            <span>Dịch vụ rác</span>
                        </div>
                        <div class=\"service-item\">
                            <span class=\"service-check %s\"></span>
                            <span>Dịch vụ WiFi</span>
                        </div>
                        <div class=\"service-item\">
                            <span class=\"service-check %s\"></span>
                            <span>Dịch vụ cáp</span>
                        </div>
                        <div class=\"service-item\">
                            <span class=\"service-check %s\"></span>
                            <span>Dịch vụ khác</span>
                        </div>
                    </div>
                </div>
                
                <div class=\"signatures\">
                    <div class=\"signature-box\">
                        <div class=\"signature-title\">Bên A (Quản lý)</div>
                        <div class=\"signature-line\">Ký và ghi rõ họ tên</div>
                    </div>
                    <div class=\"signature-box\">
                        <div class=\"signature-title\">Bên B (Khách thuê)</div>
                        <div class=\"signature-line\">Ký và ghi rõ họ tên</div>
                    </div>
                </div>
            </body>
            </html>
            """,
            contractId, managerName, managerPhone, managerAddress,
            roomName, roomAddress, roomArea,
            tienPhongFormatted,
            tienCocFormatted,
            ngayBatDauFormatted,
            ngayKetThucFormatted,
            ngayTaoFormatted,
            // Service checkboxes
            hopDong.getDvRac() != null && hopDong.getDvRac() ? "checked" : "",
            hopDong.getDvWifi() != null && hopDong.getDvWifi() ? "checked" : "",
            hopDong.getDvCap() != null && hopDong.getDvCap() ? "checked" : "",
            hopDong.getDvKhac() != null && hopDong.getDvKhac() ? "checked" : ""
        );
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