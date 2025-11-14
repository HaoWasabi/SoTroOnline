package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.so_tro_online.dung_chung.dto.PagedResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.enity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.exception.HopDongAlreadyExists;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;

import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;

@Service
public class HopDongPhongService implements IHopDongPhongService {
    public HopDongPhongService(KhachThueRepository khachThueRepository, PhongRepository phongRepository, TaiKhoanRepository taiKhoanRepository, HopDongPhongRepository hopDongPhongRepository) {
        this.khachThueRepository = khachThueRepository;
        this.phongRepository = phongRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }

    private final KhachThueRepository khachThueRepository;
    private final PhongRepository phongRepository;
    private  final TaiKhoanRepository taiKhoanRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    @Override
    public List<HopDongPhongResponse> getAllHopDongPhong() {
        return hopDongPhongRepository.findAll().stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongActive() {
        return hopDongPhongRepository.findByTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public PagedResponse<HopDongPhongResponse> getAllHopDongPhongActivePaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HopDongPhong> hopDongPage = hopDongPhongRepository.findByTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong, pageable);
        List<HopDongPhongResponse> hopDongResponses = hopDongPage.getContent().stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
        return new PagedResponse<>(hopDongResponses, page, size, hopDongPage.getTotalElements());
    }

    private HopDongPhongResponse mapToHopDongPhongResponse(HopDongPhong hopDongPhong) {
        return new HopDongPhongResponse(hopDongPhong.getMaHopDongPhong(),
                hopDongPhong.getTaiKhoan().getMaTaiKhoan(),
                hopDongPhong.getTaiKhoan().getHoTen(),
                hopDongPhong.getKhachThue().getMaKhach(),
                hopDongPhong.getKhachThue().getHoTen(),
                hopDongPhong.getPhong().getMaPhong(),
                hopDongPhong.getPhong().getTenPhong(),
                hopDongPhong.getTienPhong(),
                hopDongPhong.getTienCoc(),
                Date.from(hopDongPhong.getNgayBatDau().atStartOfDay().toInstant(java.time.ZoneOffset.UTC)),
                Date.from(hopDongPhong.getNgayKetThuc().atStartOfDay().toInstant(java.time.ZoneOffset.UTC)),
                Date.from(hopDongPhong.getNgayTao().atStartOfDay().toInstant(ZoneOffset.UTC)),
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
        return hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong)
                .map(this::mapToHopDongPhongResponse)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng  với id: " + id));
    }

    @Override
    public HopDongPhongResponse createHopDongPhong(HopDongPhongRequest hopDongRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(hopDongRequest.getMaTaiKhoan(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+hopDongRequest.getMaTaiKhoan()));
        Phong phong=phongRepository.findByMaPhongAndTrangThai(hopDongRequest.getMaPhong(), TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+hopDongRequest.getMaPhong()));
        KhachThue khachThue=khachThueRepository.findById(hopDongRequest.getMaKhachThue())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy khách hàng với id: "+hopDongRequest.getMaKhachThue()));
        if(hopDongPhongRepository.existsHopDong(phong.getMaPhong(),khachThue.getMaKhach(), com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong)){
            throw new HopDongAlreadyExists("Hop dong phong da ton tai");
        }
        HopDongPhong hopDongPhong=new HopDongPhong();
        hopDongPhong.setPhong(phong);
        hopDongPhong.setTaiKhoan(taiKhoan);
        hopDongPhong.setKhachThue(khachThue);
        hopDongPhong.setTienPhong(hopDongRequest.getTienPhong());
        hopDongPhong.setTienCoc(hopDongRequest.getTienCoc());
        hopDongPhong.setNgayBatDau(LocalDate.ofInstant(hopDongRequest.getNgayBatDau().toInstant(), java.time.ZoneId.systemDefault()));
        hopDongPhong.setNgayKetThuc(LocalDate.ofInstant(hopDongRequest.getNgayKetThuc().toInstant(), java.time.ZoneId.systemDefault()));
        hopDongPhong.setTrangThai(hopDongRequest.getTrangThai());
        hopDongPhong.setNgayTao(LocalDate.now());
        return mapToHopDongPhongResponse(hopDongPhongRepository.save(hopDongPhong));
    }

    @Override
    public HopDongPhongResponse updateHopDongPhong(Integer id, HopDongPhongRequest roomRequest) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
        hopDongPhong.setTienPhong(roomRequest.getTienPhong());
        hopDongPhong.setNgayKetThuc(LocalDate.ofInstant(roomRequest.getNgayKetThuc().toInstant(), java.time.ZoneId.systemDefault()));
        hopDongPhong.setNgayBatDau(LocalDate.ofInstant(roomRequest.getNgayBatDau().toInstant(), java.time.ZoneId.systemDefault()));
        hopDongPhong.setTrangThai(roomRequest.getTrangThai());
        return mapToHopDongPhongResponse(hopDongPhongRepository.save(hopDongPhong));
    }

    @Override
    public void deleteHopDongPhong(Integer id) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
        hopDongPhong.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.enity.TrangThai.daXoa);
        hopDongPhongRepository.save(hopDongPhong);
    }

    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongByMaKhachThue(Integer maKhachThue) {
        return hopDongPhongRepository.findByKhachThueMaKhach(maKhachThue).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }
}