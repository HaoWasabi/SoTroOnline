package com.so_tro_online.quan_ly_phong.service;


import com.so_tro_online.dung_chung.dto.PagedResponse;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;

import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.exception.RoomAlreadyExist;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Service

public class PhongService implements IPhongService{
    private final TaiKhoanRepository taiKhoanRepository;
    private final PhongRepository phongRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public PhongService(TaiKhoanRepository taiKhoanRepository, PhongRepository phongRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.phongRepository = phongRepository;

    }

    @Override
    public List<RoomResponse> getAllRooms(Integer managerId) {
        if (managerId != null) {
            return phongRepository.findByTaiKhoanMaTaiKhoan(managerId).stream().map(this::mapToRoomResponse).toList();
        }
        return phongRepository.findAll().stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public PagedResponse<RoomResponse> getAllRoomsPaged(int page, int size, Integer managerId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Phong> phongPage;
        
        if (managerId != null) {
            phongPage = phongRepository.findByTaiKhoanMaTaiKhoan(managerId, pageable);
        } else {
            phongPage = phongRepository.findAll(pageable);
        }
        
        List<RoomResponse> roomResponses = phongPage.getContent().stream()
                .map(this::mapToRoomResponse)
                .toList();
        return new PagedResponse<>(roomResponses, page, size, phongPage.getTotalElements());
    }

    @Override
    public List<RoomResponse> getAllRoomsActive(Integer managerId) {
        if (managerId != null) {
            return phongRepository.findByTaiKhoanMaTaiKhoanAndTrangThaiNot(managerId, TrangThai.daXoa)
                    .stream().map(this::mapToRoomResponse).toList();
        }
        return phongRepository.findByTrangThaiNot(TrangThai.daXoa)
                .stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public PagedResponse<RoomResponse> getAllRoomsActivePaged(int page, int size, Integer managerId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Phong> phongPage;
        
        if (managerId != null) {
            phongPage = phongRepository.findByTaiKhoanMaTaiKhoanAndTrangThaiNot(managerId, TrangThai.daXoa, pageable);
        } else {
            phongPage = phongRepository.findByTrangThaiNot(TrangThai.daXoa, pageable);
        }
        
        List<RoomResponse> roomResponses = phongPage.getContent().stream()
                .map(this::mapToRoomResponse)
                .toList();
        return new PagedResponse<>(roomResponses, page, size, phongPage.getTotalElements());
    }

    @Override
    public RoomResponse getRoomById(Integer id) {
        return phongRepository.findById(id).map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
    }

    @Override
    public RoomResponse getRoomActiveById(Integer id) {
        return phongRepository.findByMaPhongAndTrangThaiNot(id,TrangThai.daXoa)
                .map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng  với id: "+id));
    }

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest) {

        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+roomRequest.getMaQuanLy()));
        
        // SAAS: Check room name uniqueness within manager's scope only
        if(phongRepository.existsByTenPhongAndTaiKhoanMaTaiKhoanAndTrangThaiNot(roomRequest.getTenPhong(), roomRequest.getMaQuanLy(), TrangThai.daXoa)){
            throw new RoomAlreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        
        Phong phong = getPhong(roomRequest, taiKhoan);
        return mapToRoomResponse(phongRepository.save(phong));

    }

    private static Phong getPhong(RoomRequest roomRequest, TaiKhoan taiKhoan) {
        Phong phong=new Phong();
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(TrangThai.valueOf(roomRequest.getTrangThai()));
        phong.setTaiKhoan(taiKhoan);
        return phong;
    }

    @Override
    public RoomResponse updateRoom(Integer id, RoomRequest roomRequest) {
        Phong phong= phongRepository.findByMaPhongAndTrangThaiNot(id,TrangThai.daXoa)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
        
        // SAAS: Check room name uniqueness within manager's scope only (exclude current room)
        if(phongRepository.existsByTenPhongAndMaPhongNotAndTaiKhoanMaTaiKhoanAndTrangThaiNot(roomRequest.getTenPhong(), id, roomRequest.getMaQuanLy(), TrangThai.daXoa)){
            throw new RoomAlreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+id));
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(TrangThai.valueOf(roomRequest.getTrangThai()));
        phong.setTaiKhoan(taiKhoan);
        return mapToRoomResponse(phongRepository.save(phong));
    }

    @Override
    public void deleteRoom(Integer id) {
        Phong phong = phongRepository.findById(id)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy phòng với id: " + id));
        phongRepository.delete(phong); // Permanently delete the record
    }

    @Override
    public Integer importExcel(MultipartFile file) {
        int countSaved = 0;
        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // bỏ header (row 0)
                Row row = sheet.getRow(i);
                if (row == null) continue;
                try {
                    Phong phong = new Phong();
                    int maQuanLy = (int) row.getCell(0).getNumericCellValue();
                    TaiKhoan taiKhoan = taiKhoanRepository.findById(maQuanLy).
                            orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+maQuanLy));
                    phong.setTaiKhoan(taiKhoan);
                    
                    String tenPhong = row.getCell(1).getStringCellValue();
                    // SAAS: Check room name uniqueness within manager's scope only
                    if(phongRepository.existsByTenPhongAndTaiKhoanMaTaiKhoanAndTrangThaiNot(tenPhong, maQuanLy, TrangThai.daXoa)){
                        throw new RoomAlreadyExist("phòng đã tồn tại: " + tenPhong);
                    }
                    
                    phong.setTenPhong(tenPhong);
                    phong.setLoaiPhong(row.getCell(2).getStringCellValue());
                    phong.setDiaChi(row.getCell(3).getStringCellValue());
                    phong.setChieuDai(BigDecimal.valueOf(row.getCell(4).getNumericCellValue()));
                    phong.setChieuRong(BigDecimal.valueOf(row.getCell(5).getNumericCellValue()));
                    phong.setVatDung(row.getCell(6).getStringCellValue());
                    phong.setGiaThueCoBan(BigDecimal.valueOf(row.getCell(7).getNumericCellValue()));
                    phong.setTrangThai(TrangThai.valueOf(row.getCell(8).getStringCellValue()));
                    phongRepository.save(phong);
                    countSaved++;
                }
                catch (Exception e){

                }

            }

        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel: " + e.getMessage(), e);
        }
        return countSaved;
    }

    @Override
    public void exportToExcel(HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) { // false để tạo workbook định dạng .xlsx
            Sheet sheet = workbook.createSheet("Phòng");
            Row header = sheet.createRow(0);
            String[] columns = {"Mã quản lý", "Tên phòng", "Loại phòng", "Địa chỉ", "Chiều dài",
                    "Chiều rộng", "Vật dụng", "Giá thuê cơ bản", "Trạng thái"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            List<Phong> phongList = phongRepository.findAll();
            int rowNum = 1;
            for (Phong phong : phongList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(phong.getTaiKhoan().getMaTaiKhoan());
                row.createCell(1).setCellValue(phong.getTenPhong());
                row.createCell(2).setCellValue(phong.getLoaiPhong());
                row.createCell(3).setCellValue(phong.getDiaChi());
                row.createCell(4).setCellValue(phong.getChieuDai().doubleValue());
                row.createCell(5).setCellValue(phong.getChieuRong().doubleValue());
                row.createCell(6).setCellValue(phong.getVatDung());
                row.createCell(7).setCellValue(phong.getGiaThueCoBan().doubleValue());
                row.createCell(8).setCellValue(phong.getTrangThai().name());
            }
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=phong.xlsx");
            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất file Excel: " + e.getMessage(), e);
        }
    }

    @Override
    public List<RoomResponse> searchRoom(String searchTerm, Integer managerId) {
        // Log manager-based search for debugging
        System.out.println("Searching rooms for manager: " + managerId + ", searchTerm: " + searchTerm);
        
        List<Phong> phongList;
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            // For non-paginated search, we'll use the repository methods
            // Note: This could potentially return many results, so consider pagination in production
            if (managerId != null) {
                // For simplicity, we'll get the first 100 results using PageRequest
                Pageable pageable = PageRequest.of(0, 100);
                Page<Phong> phongPage = phongRepository.findByManagerAndMultipleFields(managerId, searchTerm.trim(), TrangThai.daXoa, pageable);
                phongList = phongPage.getContent();
            } else {
                Pageable pageable = PageRequest.of(0, 100);
                Page<Phong> phongPage = phongRepository.findByMultipleFields(searchTerm.trim(), TrangThai.daXoa, pageable);
                phongList = phongPage.getContent();
            }
        } else {
            // No search term, get all active rooms for manager (limit to 100)
            if (managerId != null) {
                Pageable pageable = PageRequest.of(0, 100);
                Page<Phong> phongPage = phongRepository.findByTaiKhoanMaTaiKhoanAndTrangThaiNot(managerId, TrangThai.daXoa, pageable);
                phongList = phongPage.getContent();
            } else {
                Pageable pageable = PageRequest.of(0, 100);
                Page<Phong> phongPage = phongRepository.findByTrangThaiNot(TrangThai.daXoa, pageable);
                phongList = phongPage.getContent();
            }
        }
        
        List<RoomResponse> roomResponses = phongList.stream()
                .map(this::mapToRoomResponse)
                .toList();
        
        System.out.println("Found " + roomResponses.size() + " rooms for manager: " + managerId);
        return roomResponses;
    }

    @Override
    public PagedResponse<RoomResponse> searchRoomPaged(String searchTerm, int page, int size, Integer managerId) {
        return searchRoomPaged(searchTerm, null, page, size, managerId);
    }

    @Override
    public PagedResponse<RoomResponse> searchRoomPaged(String searchTerm, String statusFilter, int page, int size, Integer managerId) {
        // Log manager-based search for debugging
        System.out.println("Searching paged rooms for manager: " + managerId + ", searchTerm: " + searchTerm + ", statusFilter: " + statusFilter + ", page: " + page + ", size: " + size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Phong> phongPage;
        
        // Parse status filter if provided
        TrangThai statusEnum = null;
        if (statusFilter != null && !statusFilter.trim().isEmpty()) {
            try {
                statusEnum = TrangThai.valueOf(statusFilter.trim());
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid status filter: " + statusFilter + ", ignoring...");
            }
        }
        
        boolean hasSearchTerm = searchTerm != null && !searchTerm.trim().isEmpty();
        
        if (hasSearchTerm && statusEnum != null) {
            // Search with both term and status filter
            if (managerId != null) {
                phongPage = phongRepository.findByManagerAndMultipleFieldsWithStatus(managerId, searchTerm.trim(), statusEnum, TrangThai.daXoa, pageable);
            } else {
                phongPage = phongRepository.findByMultipleFieldsWithStatus(searchTerm.trim(), statusEnum, TrangThai.daXoa, pageable);
            }
        } else if (hasSearchTerm) {
            // Search with term only
            if (managerId != null) {
                phongPage = phongRepository.findByManagerAndMultipleFields(managerId, searchTerm.trim(), TrangThai.daXoa, pageable);
            } else {
                phongPage = phongRepository.findByMultipleFields(searchTerm.trim(), TrangThai.daXoa, pageable);
            }
        } else if (statusEnum != null) {
            // Filter by status only
            if (managerId != null) {
                phongPage = phongRepository.findByTaiKhoanMaTaiKhoanAndTrangThai(managerId, statusEnum, pageable);
            } else {
                phongPage = phongRepository.findByTrangThai(statusEnum, pageable);
            }
        } else {
            // No search term or status filter, get all active rooms for manager
            if (managerId != null) {
                phongPage = phongRepository.findByTaiKhoanMaTaiKhoanAndTrangThaiNot(managerId, TrangThai.daXoa, pageable);
            } else {
                phongPage = phongRepository.findByTrangThaiNot(TrangThai.daXoa, pageable);
            }
        }
        
        List<RoomResponse> roomResponses = phongPage.getContent().stream()
                .map(this::mapToRoomResponse)
                .toList();
        
        System.out.println("Found " + phongPage.getTotalElements() + " total rooms (" + roomResponses.size() + " in page) for manager: " + managerId);
        return new PagedResponse<>(roomResponses, page, size, phongPage.getTotalElements());
    }

    public RoomResponse mapToRoomResponse(Phong phong) {
        return new RoomResponse(phong.getMaPhong(),phong.getTaiKhoan().getHoTen(),phong.getTaiKhoan().getMaTaiKhoan(),
                phong.getTenPhong() ,phong.getLoaiPhong(), phong.getDiaChi(),phong.getChieuDai(),phong.getChieuRong()
                ,phong.getVatDung(),phong.getGiaThueCoBan(),phong.getTrangThai()
        );
    }
    
    @Override
    public List<?> getRoomTenants(Integer roomId) {
        String sql = """
            SELECT kt.ma_khach as ma_khach_dai_dien, kt.ho_ten, kt.dien_thoai, kt.ma_can_cuoc,
                   hdp.ngay_bat_dau, hdp.ngay_ket_thuc, hdp.trang_thai as contract_status
            FROM khach_thue kt
            JOIN hop_dong_phong hdp ON kt.ma_khach = hdp.ma_khach_dai_dien
            WHERE hdp.ma_phong = ? AND hdp.trang_thai = 'hoatDong'
            ORDER BY hdp.ngay_bat_dau DESC
            """;
        
        return jdbcTemplate.queryForList(sql, roomId);
    }
    
    @Override
    public Object addTenantToRoom(Integer roomId, Integer tenantId, Integer managerId) {
        // Check if room exists and is available
        Phong room = phongRepository.findById(roomId)
            .orElseThrow(() -> new ReseourceNotFoundException("Room not found with ID: " + roomId));
            
        // Check if tenant exists
        String tenantCheckSql = "SELECT COUNT(*) FROM khach_thue WHERE ma_khach = ?";
        Integer tenantExists = jdbcTemplate.queryForObject(tenantCheckSql, Integer.class, tenantId);
        if (tenantExists == 0) {
            throw new ReseourceNotFoundException("Tenant not found with ID: " + tenantId);
        }
        
        // Check if tenant is active (flexible status check)
        String tenantStatusCheckSql = "SELECT trang_thai FROM khach_thue WHERE ma_khach = ?";
        String tenantStatus = jdbcTemplate.queryForObject(tenantStatusCheckSql, String.class, tenantId);
        if (tenantStatus == null || (!tenantStatus.equalsIgnoreCase("hoatDong") && !tenantStatus.equalsIgnoreCase("hoatdong"))) {
            throw new ReseourceNotFoundException("Tenant is inactive (status: " + tenantStatus + ") with ID: " + tenantId);
        }
        
        // Check if manager exists
        String managerCheckSql = "SELECT COUNT(*) FROM tai_khoan WHERE ma_tai_khoan = ? AND trang_thai = 'hoatDong'";
        Integer managerExists = jdbcTemplate.queryForObject(managerCheckSql, Integer.class, managerId);
        if (managerExists == 0) {
            throw new ReseourceNotFoundException("Manager not found or inactive with ID: " + managerId);
        }
            
        // Check if tenant already has an active contract for this room
        String checkSql = """
            SELECT COUNT(*) FROM hop_dong_phong 
            WHERE ma_phong = ? AND ma_khach_dai_dien = ? AND trang_thai = 'hoatDong'
            """;
        Integer existingContracts = jdbcTemplate.queryForObject(checkSql, Integer.class, roomId, tenantId);
        
        if (existingContracts > 0) {
            throw new IllegalStateException("Tenant already has an active contract for this room");
        }
        
        // Create new contract
        String insertSql = """
            INSERT INTO hop_dong_phong (
                ngay_bat_dau, ngay_ket_thuc, ngay_tao, tien_coc, tien_phong, 
                trang_thai, ma_khach_dai_dien, ma_phong, ma_quan_ly
            ) VALUES (
                CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), CURDATE(), 
                ?, ?, 'hoatDong', ?, ?, ?
            )
            """;
            
        jdbcTemplate.update(insertSql, 
            room.getGiaThueCoBan().multiply(new BigDecimal("2")), // Default deposit = 2 months rent
            room.getGiaThueCoBan(),
            tenantId, roomId, managerId);
            
        return "Contract created successfully";
    }
    
    @Override
    public void removeTenantFromRoom(Integer roomId, Integer tenantId) {
        String sql = """
            UPDATE hop_dong_phong 
            SET trang_thai = 'daXoa' 
            WHERE ma_phong = ? AND ma_khach_dai_dien = ? AND trang_thai = 'hoatDong'
            """;
            
        int updated = jdbcTemplate.update(sql, roomId, tenantId);
        
        if (updated == 0) {
            throw new ReseourceNotFoundException("No active contract found for tenant in this room");
        }
    }
}