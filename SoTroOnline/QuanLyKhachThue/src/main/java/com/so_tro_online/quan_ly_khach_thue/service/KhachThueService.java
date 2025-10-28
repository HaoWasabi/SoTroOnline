package com.so_tro_online.quan_ly_khach_thue.service;

import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueDto;
import com.so_tro_online.quan_ly_khach_thue.dto.KhachThueRequest;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
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

            // Check for duplicate maCanCuoc
            if (khachThueRequest.getMaCanCuoc() != null &&
                khachThueRepository.existsByMaCanCuoc(khachThueRequest.getMaCanCuoc())) {
                throw new DuplicateCanCuocException(khachThueRequest.getMaCanCuoc());
            }

            KhachThueDto khachThueDto = new KhachThueDto();
            khachThueDto.setMaKhachDaiDien(khachThueRequest.getMaKhachDaiDien());
            khachThueDto.setMaCanCuoc(khachThueRequest.getMaCanCuoc());
            khachThueDto.setHoTen(khachThueRequest.getHoTen());
            khachThueDto.setThuongTru(khachThueRequest.getThuongTru());
            khachThueDto.setNgaySinh(khachThueRequest.getNgaySinh());

            KhachThue khachThue = KhachThueMapper.toEntity(khachThueDto);
            khachThue.setNgayTao(Instant.now());

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
     * Get tenant by ID
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
     * Get all tenants with pagination
     */
    public Page<KhachThueDto> getAllKhachThue(int page) {
        try {
            if (page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("ngayTao").descending());
            Page<KhachThue> khachThuePage = khachThueRepository.findAll(pageable);

            return khachThuePage.map(KhachThueMapper::toDto);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Update tenant
     */
    public KhachThueDto updateKhachThue(int maKhach, KhachThueRequest khachThueRequest) {
        try {
            Optional<KhachThue> existingKhachThue = khachThueRepository.findById(maKhach);
            if (existingKhachThue.isEmpty()) {
                throw new KhachThueNotFoundException(maKhach);
            }

            validateKhachThueDataForUpdate(khachThueRequest);

            // Check for duplicate maCanCuoc (excluding current tenant)
            if (khachThueRequest.getMaCanCuoc() != null &&
                !khachThueRequest.getMaCanCuoc().equals(existingKhachThue.get().getMaCanCuoc()) &&
                khachThueRepository.existsByMaCanCuoc(khachThueRequest.getMaCanCuoc())) {
                throw new DuplicateCanCuocException(khachThueRequest.getMaCanCuoc());
            }

            KhachThue khachThue = existingKhachThue.get();
            KhachThueDto khachThueDto = KhachThueMapper.toDto(khachThue);
            KhachThueMapper.updateEntityFromDto(khachThue, khachThueDto);

            KhachThue updatedKhachThue = khachThueRepository.save(khachThue);
            return KhachThueMapper.toDto(updatedKhachThue);
        } catch (KhachThueNotFoundException | DuplicateCanCuocException | InvalidKhachThueDataException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Delete tenant
     */
    public void deleteKhachThue(int maKhach) {
        try {
            if (!khachThueRepository.existsById(maKhach)) {
                throw new KhachThueNotFoundException(maKhach);
            }

            khachThueRepository.deleteById(maKhach);
        } catch (KhachThueNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa khách thuê: " + e.getMessage(), e);
        }
    }

    /**
     * Search tenants by name
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
     * Validate tenant data for creation
     */
    private void validateKhachThueData(KhachThueRequest khachThueRequest) {
        if (khachThueRequest.getHoTen() == null || khachThueRequest.getHoTen().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Họ tên không được để trống");
        }

        if (khachThueRequest.getMaCanCuoc() == null || khachThueRequest.getMaCanCuoc().trim().isEmpty()) {
            throw new InvalidKhachThueDataException("Mã căn cước không được để trống");
        }

        if (khachThueRequest.getMaCanCuoc().length() != 12) {
            throw new InvalidKhachThueDataException("Mã căn cước phải có 12 ký tự");
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
    }
}
