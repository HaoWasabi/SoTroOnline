package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuReponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.HopDongDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.HopDongDichVuRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;

import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class HopDongDichVuService implements IHopDongDichVu{
    private final TaiKhoanRepository taiKhoanRepository;
    private final HopDongDichVuRepository hopDongDichVuRepository;
    private final KhachThueRepository khachThueRepository;
    private final DichVuRepository dichVuRepository;

    public HopDongDichVuService(TaiKhoanRepository taiKhoanRepository, HopDongDichVuRepository hopDongDichVuRepository, KhachThueRepository khachThueRepository, DichVuRepository dichVuRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.hopDongDichVuRepository = hopDongDichVuRepository;
        this.khachThueRepository = khachThueRepository;
        this.dichVuRepository = dichVuRepository;
    }


    @Override
    public List<HopDongDichVuReponse> getAllHopDongDichVu() {
        return hopDongDichVuRepository.findAll().stream().map(this::mapToHopDongDichVuResponse).toList();
    }

    @Override
    public List<HopDongDichVuReponse> getAllHopDongDichVuActive() {
        return hopDongDichVuRepository.findByTrangThai(TrangThai.hoatDong)
                .stream().map(this::mapToHopDongDichVuResponse).toList();
    }

    @Override
    public HopDongDichVuReponse getHopDongDichVuById(Integer id) {
        return hopDongDichVuRepository.findById(id).map(this::mapToHopDongDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ với id: "+id));

    }

    @Override
    public HopDongDichVuReponse getHopDongDichVuActiveById(Integer id) {
        return hopDongDichVuRepository.findByMaHopDongDichVuAndTrangThai(id,TrangThai.hoatDong)
                .map(this::mapToHopDongDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng  với id: "+id));

    }

    @Override
    public HopDongDichVuReponse createHopDongDichVu(HopDongDichVuRequest hopDongDichVuRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(hopDongDichVuRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+hopDongDichVuRequest.getMaQuanLy()));
        KhachThue khachThue=khachThueRepository.findByMaKhachAndTrangThai(hopDongDichVuRequest.getMaKhachDaiDien(), com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm khách thuê  với id: "+hopDongDichVuRequest.getMaKhachDaiDien()));
        DichVu dichVu = dichVuRepository.findByMaDichVuAndTrangThai(hopDongDichVuRequest.getMaDichVu(), com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm dịch vụ với id: "+hopDongDichVuRequest.getMaDichVu()));
        if (hopDongDichVuRequest.getDonGia() == null || hopDongDichVuRequest.getDonGia().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Đơn giá phải > 0");
        }
        if (hopDongDichVuRequest.getNgayBatDau().after(hopDongDichVuRequest.getNgayKetThuc())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
        }
        boolean exists = hopDongDichVuRepository.existsByKhachThue_MaKhachAndDichVu_MaDichVuAndNgayBatDauBeforeAndNgayKetThucAfter(hopDongDichVuRequest.getMaKhachDaiDien(),hopDongDichVuRequest.getMaDichVu(),hopDongDichVuRequest.getNgayBatDau(),hopDongDichVuRequest.getNgayKetThuc());
        if (exists) {
            throw new IllegalStateException("Khách đã có hợp đồng dịch vụ này trong thời gian đã chọn");
        }

        // 4. Tạo entity
        HopDongDichVu entity = new HopDongDichVu();
        entity.setTaiKhoan(taiKhoan);
        entity.setKhachThue(khachThue);
        entity.setDichVu(dichVu);
        entity.setDonGia(hopDongDichVuRequest.getDonGia());
        entity.setDonVi(hopDongDichVuRequest.getDonVi());
        entity.setNgayBatDau(hopDongDichVuRequest.getNgayBatDau());
        entity.setNgayKetThuc(hopDongDichVuRequest.getNgayKetThuc());
        entity.setNgayTao(new Date());
        entity.setTrangThai(TrangThai.hoatDong);
        return mapToHopDongDichVuResponse(hopDongDichVuRepository.save(entity));
    }

    @Override
    public HopDongDichVuReponse updateHopDongDichVu(Integer id, HopDongDichVuRequest hopDongDichVuRequest) {
        HopDongDichVu entity = hopDongDichVuRepository.findByMaHopDongDichVuAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(() -> new ReseourceNotFoundException("Không tìm thấy hợp đồng dịch vụ với id: " + id));

        // (b) Kiểm tra khóa ngoại (nếu thay đổi)
        if (!entity.getTaiKhoan().getMaTaiKhoan().equals(hopDongDichVuRequest.getMaQuanLy())) {
            TaiKhoan quanLy = taiKhoanRepository.findByMaTaiKhoanAndTrangThai(hopDongDichVuRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                    .orElseThrow(() -> new ReseourceNotFoundException("Không tìm thấy quản lý"));
            entity.setTaiKhoan(quanLy);
        }
        if (!entity.getKhachThue().getMaKhach().equals(hopDongDichVuRequest.getMaKhachDaiDien())) {
            KhachThue khach = khachThueRepository.findByMaKhachAndTrangThai(hopDongDichVuRequest.getMaKhachDaiDien(), com.so_tro_online.quan_ly_khach_thue.entity.TrangThai.hoatDong)
                    .orElseThrow(() -> new ReseourceNotFoundException("Không tìm thấy khách thuê"));
            entity.setKhachThue(khach);
        }
        if (!entity.getDichVu().getMaDichVu().equals(hopDongDichVuRequest.getMaDichVu())) {
            DichVu dichVu = dichVuRepository.findByMaDichVuAndTrangThai(hopDongDichVuRequest.getMaDichVu(), com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai.hoatDong)
                    .orElseThrow(() -> new ReseourceNotFoundException("Không tìm thấy dịch vụ"));
            entity.setDichVu(dichVu);
        }

        // (c) Kiểm tra dữ liệu
        if (hopDongDichVuRequest.getDonGia() == null || hopDongDichVuRequest.getDonGia().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Đơn giá phải > 0");
        }
        if (hopDongDichVuRequest.getNgayBatDau().after(hopDongDichVuRequest.getNgayKetThuc())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // (d) Kiểm tra trùng lặp
        boolean exists = hopDongDichVuRepository.existsByKhachThue_MaKhachAndDichVu_MaDichVuAndNgayBatDauBeforeAndNgayKetThucAfterAndMaHopDongDichVuNot(
                hopDongDichVuRequest.getMaKhachDaiDien(), hopDongDichVuRequest.getMaDichVu(),
                hopDongDichVuRequest.getNgayKetThuc(), hopDongDichVuRequest.getNgayBatDau(),
                id
        );
        if (exists) {
            throw new IllegalStateException("Hợp đồng bị trùng lặp với hợp đồng khác");
        }

        // (e) Update dữ liệu
        entity.setDonGia(hopDongDichVuRequest.getDonGia());
        entity.setDonVi(hopDongDichVuRequest.getDonVi());
        entity.setNgayBatDau(hopDongDichVuRequest.getNgayBatDau());
        entity.setNgayKetThuc(hopDongDichVuRequest.getNgayKetThuc());
        entity.setTrangThai(hopDongDichVuRequest.getTrangThai());

        return mapToHopDongDichVuResponse(hopDongDichVuRepository.save(entity));
    }

    @Override
    public void deleteHopDongDichVu(Integer id) {
        HopDongDichVu hopDongDichVu= hopDongDichVuRepository.findByMaHopDongDichVuAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ với id: "+id));
        hopDongDichVu.setTrangThai(TrangThai.daXoa);
        hopDongDichVuRepository.save(hopDongDichVu);
    }
    private HopDongDichVuReponse mapToHopDongDichVuResponse(HopDongDichVu entity) {
        HopDongDichVuReponse response = new HopDongDichVuReponse();
        response.setMaHopDongDichVu(entity.getMaHopDongDichVu());
        response.setMaQuanLy(entity.getTaiKhoan().getMaTaiKhoan());
        response.setTenQuanLy(entity.getTaiKhoan().getHoTen());
        response.setMaKhachDaiDien(entity.getKhachThue().getMaKhach());
        response.setTenKhachDaiDien(entity.getKhachThue().getHoTen());
        response.setDonGia(entity.getDonGia());
        response.setDonVi(entity.getDonVi());
        response.setNgayBatDau(entity.getNgayBatDau());
        response.setNgayKetThuc(entity.getNgayKetThuc());
        response.setNgayTao(entity.getNgayTao());
        response.setTrangThai(entity.getTrangThai());
        return response;
    }

}
