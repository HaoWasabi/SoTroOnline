package com.so_tro_online.quan_ly_phieu_thu.service;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThai;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuRequest;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuResponse;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuExportData;

import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.exception.BusinessException;
import com.so_tro_online.quan_ly_phieu_thu.repository.PhieuThuRepository;
import com.so_tro_online.quan_ly_phieu_thu.util.PhieuThuExporter;
import com.so_tro_online.quan_ly_phieu_thu.util.SimpleReceiptExporter;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class PhieuThuService implements IPhieuThuService{
    private final PhieuThuRepository phieuThuRepository;
    private final HoaDonRepository hoaDonRepository;
    private final KhachThueRepository khachThueRepository;
    private final HopDongPhongRepository hopDongPhongRepo;
    private final PhongRepository phongRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    
    public PhieuThuService(PhieuThuRepository phieuThuRepository, HoaDonRepository hoaDonRepository, 
                          KhachThueRepository khachThueRepository, HopDongPhongRepository hopDongPhongRepo, 
                          PhongRepository phongRepository, TaiKhoanRepository taiKhoanRepository) {
        this.phieuThuRepository = phieuThuRepository;
        this.hoaDonRepository = hoaDonRepository;
        this.khachThueRepository = khachThueRepository;
        this.hopDongPhongRepo = hopDongPhongRepo;
        this.phongRepository = phongRepository;
        this.taiKhoanRepository = taiKhoanRepository;
    }

    @Override
    public List<PhieuThuResponse> getAllPhieuThu() {
        return phieuThuRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PhieuThuResponse> getAllActivePhieuThu() {
        return phieuThuRepository.findAllActive().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PhieuThuResponse toResponse(PhieuThu phieuThu) {
        PhieuThuResponse response = new PhieuThuResponse();
        response.setMaPhieuThu(phieuThu.getMaPhieuThu());
        response.setMaHoaDon(phieuThu.getHoaDon().getMaHoaDon());
        response.setMaKhachThue(phieuThu.getKhachThue().getMaKhach());
        response.setSoTienThu(phieuThu.getSoTienThu());
        response.setNgayThu(phieuThu.getNgayThu());
        response.setGhiChu(phieuThu.getGhiChu());
        response.setCapNhatLanCuoi(phieuThu.getCapNhatLanCuoi());
        response.setTrangThai(phieuThu.getTrangThai());
        return response;
    }

    @Override
    public PhieuThuResponse createPhieuThu(PhieuThuRequest req) {
        HoaDon hoaDon=hoaDonRepository.findById(req.getMaHoaDon())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hóa đơn với id:"+req.getMaHoaDon()));
        KhachThue khachThue=khachThueRepository.findById(req.getMaKhachHang())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy khách thuê với id:"+req.getMaKhachHang()));
        if(hoaDon.getTienConNo().compareTo(req.getSoTienThu())<0){
            throw new BusinessException("Số tiền thu vượt quá số tiền còn nợ của hóa đơn");
        }
        PhieuThu phieuThu=new PhieuThu();
        phieuThu.setHoaDon(hoaDon);
        phieuThu.setKhachThue(khachThue);
        phieuThu.setSoTienThu(req.getSoTienThu());
        phieuThu.setNgayThu(LocalDate.now());
        phieuThu.setGhiChu(req.getGhiChu());
        phieuThu.setCapNhatLanCuoi(LocalDate.now());
        phieuThu.setTrangThai(req.getTrangThai());
        phieuThu.setConNo(hoaDon.getTienConNo().subtract(req.getSoTienThu()));
        phieuThu.setNoiDungThu("Thu tiền phòng và dịch vụ của"+hoaDon.getNoiDung());
        PhieuThu saved=phieuThuRepository.save(phieuThu);
        hoaDon.setTienConNo(hoaDon.getTienConNo().subtract(req.getSoTienThu()));
        if(hoaDon.getTienConNo().compareTo(BigDecimal.ZERO)==0) {
            hoaDon.setTrangThai(com.so_tro_online.quan_ly_hoa_don.entity.TrangThai.DA_THANH_TOAN);
        }
        hoaDonRepository.save(hoaDon);
        return toResponse(saved);
    }

    @Override
    public PhieuThuResponse updatePhieuThu(Integer id, PhieuThuRequest req) {
        HoaDon hoaDon=hoaDonRepository.findById(req.getMaHoaDon())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hóa đơn với id:"+req.getMaHoaDon()));
       PhieuThu phieuThu=phieuThuRepository.findById(id)
               .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phiếu thu với id:"+id));
       phieuThu.setGhiChu(req.getGhiChu());
       phieuThu.setCapNhatLanCuoi(LocalDate.now());
       return toResponse(phieuThuRepository.save(phieuThu));
    }

    @Override
    public void deletePhieuThu(Integer id) {

    }

    @Override
    public PhieuThuResponse getPhieuThuById(Integer id) {
        return phieuThuRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phiếu thu với id:"+id));
    }

    @Override
    public List<PhieuThuResponse> getPhieuThuByHoaDon(Integer maHoaDon) {
        HoaDon hoaDon=hoaDonRepository.findById(maHoaDon)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hóa đơn với id:"+maHoaDon));
        return phieuThuRepository.findByHoaDon(hoaDon).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PhieuThuResponse> getPhieuThuByKhachThue(Integer maKhachThue) {
        KhachThue khachThue=khachThueRepository.findById(maKhachThue)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy khách thuê với id:"+maKhachThue));
        return phieuThuRepository.findByKhachThue(khachThue).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PhieuThuResponse> thuTienTuDong(Integer maHopDongPhong, BigDecimal soTienThu) {
        HopDongPhong hopDong = hopDongPhongRepo.findById(maHopDongPhong)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));
        //KhachThue khach = hopDong.getKhachThue();

        // Lấy danh sách hóa đơn còn nợ
        List<HoaDon> hoaDons = hoaDonRepository
                .findHoaDonConNo(maHopDongPhong, BigDecimal.ZERO);

        // 👉 Tính tổng nợ hiện tại
        BigDecimal tongNo = hoaDons.stream()
                .map(HoaDon::getTienConNo)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 👉 Nếu khách nộp nhiều hơn tổng nợ
        if (soTienThu.compareTo(tongNo) > 0) {
            BigDecimal tienDu = soTienThu.subtract(tongNo);
            throw new BusinessException(String.format("Khách nộp dư %.0f VNĐ so với tổng nợ %.0f VNĐ",
                    tienDu, tongNo));
        }
        List<PhieuThu>phieuThus=new ArrayList<>();
        List<HoaDon>hoaDonList=new ArrayList<>();
        // ===== Tiến hành phân bổ tiền vào các hóa đơn =====
        BigDecimal tienConLai = soTienThu;

        for (HoaDon hoaDon : hoaDons) {
            if (tienConLai.compareTo(BigDecimal.ZERO) <= 0) break;

            BigDecimal noHienTai = hoaDon.getTienConNo();
            BigDecimal soTienTru = tienConLai.min(noHienTai);

            // Cập nhật hóa đơn
            hoaDon.setTienConNo(noHienTai.subtract(soTienTru));
            hoaDon.setTrangThai(
                    hoaDon.getTienConNo().compareTo(BigDecimal.ZERO) == 0
                            ? TrangThai.DA_THANH_TOAN
                            : TrangThai.CON_NO
            );
            hoaDon.setCapNhatLanCuoi(LocalDate.now());
            hoaDonList.add(hoaDon);


            // Tạo phiếu thu
            PhieuThu phieu = new PhieuThu();
            phieu.setHoaDon(hoaDon);
            //phieu.setKhachThue(khach);
            phieu.setSoTienThu(soTienTru);
            phieu.setConNo(hoaDon.getTienConNo());
            phieu.setNoiDungThu("Thu tiền phòng và dịch vụ của " + hoaDon.getNoiDung());
            phieu.setNgayThu(LocalDate.now());
            phieu.setTrangThai(com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai.hoatDong);
            phieuThus.add(phieu);
            tienConLai = tienConLai.subtract(soTienTru);
        }
        hoaDonRepository.saveAll(hoaDonList);
        phieuThuRepository.saveAll(phieuThus);

        return phieuThus.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void printPhieuThu(Integer id, HttpServletResponse response){
        // Fetch PhieuThu
        PhieuThu phieuThu = phieuThuRepository.findById(id)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy phiếu thu với id: " + id));
        
        // Fetch related entities
        HoaDon hoaDon = phieuThu.getHoaDon();
        KhachThue khachThue = phieuThu.getKhachThue();
        
        // Fetch HopDongPhong through HoaDon
        HopDongPhong hopDongPhong = hopDongPhongRepo.findById(hoaDon.getMaHopDongPhong())
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: " + hoaDon.getMaHopDongPhong()));
        
        // Fetch Phong
        Phong phong = phongRepository.findById(hopDongPhong.getMaPhong())
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy phòng với id: " + hopDongPhong.getMaPhong()));
        
        // Fetch TaiKhoan (landlord)
        TaiKhoan taiKhoan = taiKhoanRepository.findById(hopDongPhong.getMaTaiKhoan())
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy tài khoản với id: " + hopDongPhong.getMaTaiKhoan()));
        
        // Create export data object
        PhieuThuExportData exportData = new PhieuThuExportData();
        exportData.setMaPhieuThu(phieuThu.getMaPhieuThu());
        exportData.setMaHoaDon(hoaDon.getMaHoaDon());
        exportData.setMaKhachThue(khachThue.getMaKhach());
        exportData.setTenKhachThue(khachThue.getHoTen());
        exportData.setTenChuTro(taiKhoan.getHoTen());
        exportData.setDiaChiPhong(phong.getDiaChi());
        exportData.setNgayThu(phieuThu.getNgayThu());
        exportData.setSoTienThu(phieuThu.getSoTienThu());
        exportData.setTongTienHoaDon(hoaDon.getTongTien());
        exportData.setThang(hoaDon.getThang());
        exportData.setNam(hoaDon.getNam());
        
        try {
            java.nio.file.Path temp = java.nio.file.Files.createTempFile("PhieuThu_" + id + "_", ".docx");
            boolean useTextFallback = false;
            
            // Log POI version for debugging
            try {
                String poiVersion = org.apache.poi.Version.getVersion();
                System.out.println("Using Apache POI version: " + poiVersion);
            } catch (Exception e) {
                System.out.println("Could not determine POI version: " + e.getMessage());
            }
            
            // Try to export using POI first
            try {
                PhieuThuExporter.exportPhieuThu(temp.toAbsolutePath().toString(), exportData);
                
                // Set response headers for DOCX download
                response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                response.setHeader("Content-Disposition", "attachment; filename=\"PhieuThu_" + id + ".docx\"");
                
            } catch (Exception poiError) {
                // If POI fails, use simple text fallback
                System.err.println("POI export failed, using text fallback: " + poiError.getMessage());
                if (poiError.getCause() instanceof NoSuchMethodError) {
                    System.err.println("This appears to be a POI/Commons IO version compatibility issue.");
                    System.err.println("Please run 'mvn clean compile' to refresh dependencies to POI 5.3.0+ and Commons IO 2.16.1+");
                }
                poiError.printStackTrace();
                
                // Create text file instead
                java.nio.file.Path textTemp = java.nio.file.Files.createTempFile("PhieuThu_" + id + "_", ".txt");
                SimpleReceiptExporter.exportReceiptAsText(textTemp.toAbsolutePath().toString(), exportData);
                
                // Use text file path
                temp = textTemp;
                useTextFallback = true;
                
                // Set response headers for text download
                response.setContentType("text/plain; charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename=\"PhieuThu_" + id + ".txt\"");
            }

            // Stream file to response
            try (java.io.InputStream in = java.nio.file.Files.newInputStream(temp);
                 java.io.OutputStream out = response.getOutputStream()) {
                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
                out.flush();
            }

            java.nio.file.Files.deleteIfExists(temp);
            
            // Log success
            if (useTextFallback) {
                System.out.println("✓ Receipt exported successfully as text file due to POI compatibility issue");
            } else {
                System.out.println("✓ Receipt exported successfully as DOCX file");
            }
            
        } catch (IOException e) {
            System.err.println("Failed to export receipt: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xuất phiếu thu: " + e.getMessage(), e);
        }
    }
}
