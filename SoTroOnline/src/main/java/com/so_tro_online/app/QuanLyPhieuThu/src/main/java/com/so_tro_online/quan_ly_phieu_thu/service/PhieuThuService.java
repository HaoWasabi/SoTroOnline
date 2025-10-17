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

import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.exception.BusinessException;
import com.so_tro_online.quan_ly_phieu_thu.repository.PhieuThuRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class PhieuThuService implements IPhieuThuService{
    private final PhieuThuRepository phieuThuRepository;
    private final HoaDonRepository hoaDonRepository;
    private final KhachThueRepository khachThueRepository;
    private final HopDongPhongRepository hopDongPhongRepo;
    public PhieuThuService(PhieuThuRepository phieuThuRepository, HoaDonRepository hoaDonRepository, KhachThueRepository khachThueRepository, HopDongPhongRepository hopDongPhongRepo) {
        this.phieuThuRepository = phieuThuRepository;
        this.hoaDonRepository = hoaDonRepository;
        this.khachThueRepository = khachThueRepository;
        this.hopDongPhongRepo = hopDongPhongRepo;
    }

    @Override
    public List<PhieuThuResponse> getAllPhieuThu() {
        return phieuThuRepository.findAll().stream()
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
        KhachThue khach = hopDong.getKhachThue();

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
            phieu.setKhachThue(khach);
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
}
