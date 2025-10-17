package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.exception.SuDungDichVuAlreadyExist;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.SuDungDichVuRepository;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuDungDichVuService implements ISuDungDichVuService {
    private final SuDungDichVuRepository suDungDichVuRepository;
    private final PhongRepository phongRepository;

    public SuDungDichVuService(SuDungDichVuRepository suDungDichVuRepository, PhongRepository phongRepository) {
        this.suDungDichVuRepository = suDungDichVuRepository;

        this.phongRepository = phongRepository;
    }


    @Override
    public List<SuDungDichVuResponse> getAllSuDungDichVu() {
        return suDungDichVuRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }
@Override
    public SuDungDichVuResponse mapToResponse(SuDungDichVu suDungDichVu) {
        SuDungDichVuResponse response = new SuDungDichVuResponse();
        response.setId(suDungDichVu.getId());
        response.setChiSoDienCu(suDungDichVu.getChiSoDienCu());
        response.setChiSoDienMoi(suDungDichVu.getChiSoDienMoi());
        response.setChiSoNuocCu(suDungDichVu.getChiSoNuocCu());
        response.setChiSoNuocMoi(suDungDichVu.getChiSoNuocMoi());
        response.setMaPhong(suDungDichVu.getPhong().getMaPhong());
        response.setTenPhong(suDungDichVu.getPhong().getTenPhong());
        response.setThangNam(suDungDichVu.getThangNam());
        response.setTrangThai(suDungDichVu.getTrangThai());

        return response;
    }

    @Override
    public SuDungDichVuResponse createSuDungDichVu(SuDungDichVuRequest req) {
        LocalDate localDate = req.getThangNam();

        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Phong phong=phongRepository.findById(req.getMaPhong())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng id: "+req.getMaPhong()));
        if (suDungDichVuRepository.findByPhongAndThangNam(
                req.getMaPhong(),
                month,
                year, TrangThai.hoatDong).isPresent()) {
            throw new SuDungDichVuAlreadyExist("chỉ số điện nước ở tháng này đã tồn tại");
        }
        SuDungDichVu suDungDichVu=new SuDungDichVu();
        suDungDichVu.setThangNam(req.getThangNam());
        suDungDichVu.setChiSoDienCu(req.getChiSoDienCu());
        suDungDichVu.setChiSoDienMoi(req.getChiSoDienMoi());
        suDungDichVu.setChiSoNuocCu(req.getChiSoNuocCu());
        suDungDichVu.setChiSoNuocMoi(req.getChiSoNuocMoi());
        suDungDichVu.setTrangThai(req.getTrangThai());
        suDungDichVu.setPhong(phong);
        return mapToResponse(suDungDichVuRepository.save(suDungDichVu));
    }

    @Override
    public SuDungDichVuResponse updateSuDungDichVu(Integer id, SuDungDichVuRequest req) {
        SuDungDichVu suDungDichVu=suDungDichVuRepository.findById(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy sử dụng dịch vụ id: "+id));
        suDungDichVu.setChiSoDienCu(req.getChiSoDienCu());
        suDungDichVu.setChiSoDienMoi(req.getChiSoDienMoi());
        suDungDichVu.setChiSoNuocCu(req.getChiSoNuocCu());
        suDungDichVu.setChiSoNuocMoi(req.getChiSoNuocMoi());
        return mapToResponse(suDungDichVuRepository.save(suDungDichVu));
    }

    @Override
    public SuDungDichVuResponse getSuDungDichVu(Integer id) {
        return suDungDichVuRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow( ()->new ReseourceNotFoundException("không tìm thấy sử dụng dịch vụ id: "+id));
    }

    @Override
    public void deleteSuDungDichVu(Integer id) {
        SuDungDichVu suDungDichVu=suDungDichVuRepository.findById(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy sử dụng dịch vụ id: "+id));
        suDungDichVu.setTrangThai(TrangThai.daXoa);
        suDungDichVuRepository.save(suDungDichVu);
    }

    @Override
    public List<SuDungDichVuResponse> getAllSuDungDichVuActiveByPhong(Integer maPhong) {
        return suDungDichVuRepository.findByPhongMaPhongAndTrangThaiOrderByThangNamDesc(maPhong,TrangThai.hoatDong).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }
}
