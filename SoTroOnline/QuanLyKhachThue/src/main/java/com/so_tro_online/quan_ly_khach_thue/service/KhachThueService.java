package com.so_tro_online.quan_ly_khach_thue.service;


import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueDto;
import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueRequest;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.entity.TrangThai;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_khach_thue.exception.DuplicateCanCuocException;
import com.so_tro_online.quan_ly_khach_thue.exception.InvalidKhachThueDataException;
import com.so_tro_online.quan_ly_khach_thue.exception.KhachThueNotFoundException;
import com.so_tro_online.quan_ly_khach_thue.mapper.KhachThueMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class KhachThueService {

    private static final int PAGE_SIZE = 6;

    @Autowired
    private KhachThueRepository khachThueRepository;

    /**
     * Create a new tenant
     */
    public KhachThueDto createKhachThue(KhachThueRequest khachThueRequest) {
        try {
            validateKhachThueData(khachThueRequest);

            // Check for duplicate maCanCuoc among active tenants
            if (khachThueRequest.getMaCanCuoc() != null &&
                khachThueRepository.existsByMaCanCuocAndTrangThaiNot(khachThueRequest.getMaCanCuoc().trim(), TrangThai.daXoa)) {
                throw new DuplicateCanCuocException(khachThueRequest.getMaCanCuoc().trim());
            }

            // Create entity using mapper
            KhachThue khachThue = KhachThueMapper.createEntityFromRequest(khachThueRequest);

            KhachThue savedKhachThue = khachThueRepository.save(khachThue);
            return KhachThueMapper.toDto(savedKhachThue);
        } catch (Exception e) {
            if (e instanceof DuplicateCanCuocException || e instanceof InvalidKhachThueDataException) {
                throw e;
            }
            throw new RuntimeException("Error creating new tenant : " + e.getMessage(), e);
        }
    }

    /**
     * Get tenant by ID - including both active and deleted ones
     */
    public KhachThueDto getKhachThueById(int maKhach) {
        try {
            Optional<KhachThue> khachThue = khachThueRepository.findById(maKhach);
            if (khachThue.isEmpty()) {
                throw new KhachThueNotFoundException(maKhach);
            }
            return KhachThueMapper.toDto(khachThue.get());
        } catch (KhachThueNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy thông tin khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Get all tenants with pagination - including both active and deleted ones
     */
    public Page<KhachThueDto> getAllKhachThue(int page, Integer managerId) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage;
            
            if (managerId != null) {
                khachThuePage = khachThueRepository.findByMaNguoiQuanLy(managerId, pageable);
            } else {
                khachThuePage = khachThueRepository.findAll(pageable);
            }

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Get active tenants only with pagination
     */
    public Page<KhachThueDto> getActiveKhachThue(int page, Integer managerId) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage;
            
            if (managerId != null) {
                khachThuePage = khachThueRepository.findByMaNguoiQuanLyAndTrangThaiNot(managerId, TrangThai.daXoa, pageable);
            } else {
                khachThuePage = khachThueRepository.findByTrangThaiNot(TrangThai.daXoa, pageable);
            }

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khách thuê hoạt động: " + e.getMessage(), e);
        }
    }

    /**
     * Update tenant - allow updating both active and deleted ones
     */
    public KhachThueDto updateKhachThue(int maKhach, KhachThueRequest khachThueRequest) {
        try {
            Optional<KhachThue> existingKhachThue = khachThueRepository.findById(maKhach);
            if (existingKhachThue.isEmpty()) {
                throw new KhachThueNotFoundException(maKhach);
            }
            validateKhachThueDataForUpdate(khachThueRequest);

            // Check for duplicate maCanCuoc among active tenants (excluding current tenant)
            if (khachThueRequest.getMaCanCuoc() != null &&
                !khachThueRequest.getMaCanCuoc().equals(existingKhachThue.get().getMaCanCuoc()) &&
                khachThueRepository.existsByMaCanCuocAndTrangThaiNot(khachThueRequest.getMaCanCuoc(), TrangThai.daXoa)) {
                throw new DuplicateCanCuocException(khachThueRequest.getMaCanCuoc());
            }

            KhachThue khachThue = existingKhachThue.get();
            
            // Update fields from request
            if (khachThueRequest.getHoTen() != null && !khachThueRequest.getHoTen().trim().isEmpty()) {
                khachThue.setHoTen(khachThueRequest.getHoTen().trim());
            }
            if (khachThueRequest.getMaCanCuoc() != null && !khachThueRequest.getMaCanCuoc().trim().isEmpty()) {
                khachThue.setMaCanCuoc(khachThueRequest.getMaCanCuoc().trim());
            }
            if (khachThueRequest.getDienThoai() != null && !khachThueRequest.getDienThoai().trim().isEmpty()) {
                khachThue.setDienThoai(khachThueRequest.getDienThoai().trim());
            }
            if (khachThueRequest.getThuongTru() != null && !khachThueRequest.getThuongTru().trim().isEmpty()) {
                khachThue.setThuongTru(khachThueRequest.getThuongTru().trim());
            }
            if (khachThueRequest.getNgaySinh() != null && !khachThueRequest.getNgaySinh().trim().isEmpty()) {
                try {
                    // Parse date string (expected format: "YYYY-MM-DD")
                    LocalDate localDate = LocalDate.parse(khachThueRequest.getNgaySinh().trim());
                    Date ngaySinh = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                    khachThue.setNgaySinh(ngaySinh);
                } catch (Exception dateException) {
                    throw new InvalidKhachThueDataException("Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD");
                }
            }
            if (khachThueRequest.getEmail() != null && !khachThueRequest.getEmail().trim().isEmpty()) {
                khachThue.setEmail(khachThueRequest.getEmail().trim());
            }

            KhachThue updatedKhachThue = khachThueRepository.save(khachThue);
            return KhachThueMapper.toDto(updatedKhachThue);
        } catch (KhachThueNotFoundException | DuplicateCanCuocException | InvalidKhachThueDataException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Delete tenant "soft delete" - update status to 'daXoa'
     * Only allow deletion if tenant has no active contracts
     */
    public void deleteKhachThue(int maKhach) {
        try {
            Optional<KhachThue> existingKhachThue = khachThueRepository.findById(maKhach);
            if (existingKhachThue.isEmpty()) {
                throw new KhachThueNotFoundException(maKhach);
            }

            // Check if tenant has active contracts
            // Use a direct query to check for active tenant-contract relationships
            boolean hasActiveContracts = khachThueRepository.existsActiveContractsForTenant(maKhach);
            if (hasActiveContracts) {
                throw new RuntimeException("Không thể xóa khách thuê vì đang có hợp đồng hoạt động. Vui lòng kết thúc hợp đồng trước khi xóa.");
            }

            KhachThue khachThue = existingKhachThue.get();
            khachThue.setTrangThai(TrangThai.daXoa);
            khachThueRepository.save(khachThue);
        } catch (KhachThueNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Restore deleted tenant - update status back to 'hoatDong'
     */
    public KhachThueDto restoreKhachThue(int maKhach) {
        try {
            Optional<KhachThue> existingKhachThue = khachThueRepository.findById(maKhach);
            if (existingKhachThue.isEmpty()) {
                throw new KhachThueNotFoundException(maKhach);
            }

            KhachThue khachThue = existingKhachThue.get();
            if (khachThue.getTrangThai() != TrangThai.daXoa) {
                throw new IllegalStateException("Khách thuê này chưa bị xóa");
            }

            khachThue.setTrangThai(TrangThai.hoatDong);
            KhachThue restoredKhachThue = khachThueRepository.save(khachThue);
            return KhachThueMapper.toDto(restoredKhachThue);
        } catch (KhachThueNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi khôi phục khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Get all deleted tenants with pagination - for admin purposes
     */
    public Page<KhachThueDto> getDeletedKhachThue(int page, Integer managerId) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage;
            
            if (managerId != null) {
                khachThuePage = khachThueRepository.findByMaNguoiQuanLyAndTrangThai(managerId, TrangThai.daXoa, pageable);
            } else {
                khachThuePage = khachThueRepository.findByTrangThai(TrangThai.daXoa, pageable);
            }

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khách thuê đã xóa: " + e.getMessage(), e);
        }
    }

    /**
     * Search tenants by name - including both active and deleted ones
     */
    public Page<KhachThueDto> searchKhachThueByName(String hoTen, int page) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage = khachThueRepository.findByHoTenContainingIgnoreCase(hoTen, pageable);

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tìm kiếm khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Enhanced search tenants by multiple fields (maKhach, maCanCuoc, hoTen) - including both active and deleted ones
     */
    public Page<KhachThueDto> searchKhachThue(String searchTerm, int page, Integer managerId) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage;
            
            if (managerId != null) {
                khachThuePage = khachThueRepository.findByManagerAndMultipleFields(managerId, searchTerm.trim(), TrangThai.daXoa, pageable);
            } else {
                khachThuePage = khachThueRepository.findByMultipleFieldsAll(searchTerm.trim(), pageable);
            }

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tìm kiếm khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Validate tenant data for creation
     */
    private void validateKhachThueData(KhachThueRequest khachThueRequest) {
        if (khachThueRequest.getHoTen() == null || khachThueRequest.getHoTen().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Họ tên không được để trống");
        }

        if (khachThueRequest.getMaCanCuoc() == null || khachThueRequest.getMaCanCuoc().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Mã căn cước không được để trống");
        }

        if (khachThueRequest.getMaCanCuoc().trim().length() != 12) {
            throw new InvalidKhachThueDataException("Mã căn cước phải có 12 ký tự");
        }

        // Validate date format if provided
        if (khachThueRequest.getNgaySinh() != null && !khachThueRequest.getNgaySinh().trim().isEmpty()) {
            try {
                LocalDate.parse(khachThueRequest.getNgaySinh().trim());
            } catch (Exception e) {
                throw new InvalidKhachThueDataException("Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD");
            }
        }

        // Validate phone number format if provided
        if (khachThueRequest.getDienThoai() != null && !khachThueRequest.getDienThoai().trim().isEmpty()) {
            String phoneNumber = khachThueRequest.getDienThoai().trim();
            if (phoneNumber.length() < 10 || phoneNumber.length() > 15) {
                throw new InvalidKhachThueDataException("Số điện thoại phải có từ 10 đến 15 ký tự");
            }
        }

        // Validate email format if provided
        if (khachThueRequest.getEmail() != null && !khachThueRequest.getEmail().trim().isEmpty()) {
            String email = khachThueRequest.getEmail().trim();
            String emailPattern = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!email.matches(emailPattern)) {
                throw new InvalidKhachThueDataException("Định dạng email không hợp lệ");
            }
        }
    }

    /**
     * Validate tenant data for update
     */
    private void validateKhachThueDataForUpdate(KhachThueRequest khachThueRequest) {
        if (khachThueRequest.getHoTen() != null && khachThueRequest.getHoTen().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Họ tên không được để trống");
        }

        if (khachThueRequest.getMaCanCuoc() != null &&
            (khachThueRequest.getMaCanCuoc().trim().isEmpty() || khachThueRequest.getMaCanCuoc().length() != 12)) {
            throw new InvalidKhachThueDataException("Mã căn cước phải có 12 ký tự");
        }

        if(khachThueRequest.getNgaySinh() != null && khachThueRequest.getNgaySinh().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Ngày sinh không được để trống");
        }

        // Validate email format if provided
        if (khachThueRequest.getEmail() != null && !khachThueRequest.getEmail().trim().isEmpty()) {
            String email = khachThueRequest.getEmail().trim();
            String emailPattern = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!email.matches(emailPattern)) {
                throw new InvalidKhachThueDataException("Định dạng email không hợp lệ");
            }
        }
    }

    // Backward compatibility methods without manager filtering
    public Page<KhachThueDto> getAllKhachThue(int page) {
        return getAllKhachThue(page, null);
    }

    public Page<KhachThueDto> getActiveKhachThue(int page) {
        return getActiveKhachThue(page, null);
    }

    public Page<KhachThueDto> getDeletedKhachThue(int page) {
        return getDeletedKhachThue(page, null);
    }

    public Page<KhachThueDto> searchKhachThue(String searchTerm, int page) {
        return searchKhachThue(searchTerm, page, null);
    }
}
