package com.so_tro_online.quan_ly_dich_vu_phong.service;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.exception.RoomAldreadyExist;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai;

import java.util.Arrays;
import java.util.List;

@Service
public class DichVuService implements IDichVuService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Autowired
    private DichVuRepository dichVuRepository;
    @Override
    public List<DichVuReponse> getAllDichVu() {
        return dichVuRepository.findAll().stream().map(this::mapToDichVuResponse).toList();
    }

    @Override
    public List<DichVuReponse> getAllDichVuActive() {

        return dichVuRepository.findByTrangThai(TrangThai.hoatDong)
                .stream().map(this::mapToDichVuResponse).toList();
    }
    @Override
    public DichVuReponse getDichVuById(Integer id) {
        return dichVuRepository.findById(id).map(this::mapToDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
    }

    @Override
    public DichVuReponse getDichVuActiveById(Integer id) {
        return dichVuRepository.findByMaDichVuAndTrangThai(id, TrangThai.hoatDong)
                .map(this::mapToDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
    }

    @Override
    public DichVuReponse createDichVu(DichVuRequest dichVuRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(dichVuRequest.getMaQuanLy(),com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+dichVuRequest.getMaQuanLy()));
        if(dichVuRepository.existsByTenDichVuAndTrangThai(dichVuRequest.getTenDichVu(),TrangThai.hoatDong)){
            throw new RoomAldreadyExist("dịch vụ phòng đã tồn tại: "+dichVuRequest.getTenDichVu());
        }
        DichVu dichVu = getDichVu(dichVuRequest, taiKhoan);
        return mapToDichVuResponse(dichVuRepository.save(dichVu));
    }

    private DichVu getDichVu(DichVuRequest dichVuRequest, TaiKhoan taiKhoan) {
        DichVu dichVu = new DichVu();
        dichVu.setTenDichVu(dichVuRequest.getTenDichVu());
        dichVu.setDonGiaCoBan(dichVuRequest.getDonGiaCoBan());
        dichVu.setDonViCoBan(dichVuRequest.getDonViCoBan());
        dichVu.setMoTa(dichVuRequest.getMoTa());
        dichVu.setTrangThai(dichVuRequest.getTrangThai());
        dichVu.setTaiKhoan(taiKhoan);
        return dichVu;
    }

    @Override
    public DichVuReponse updateDichVu(Integer id, DichVuRequest dichVuRequest) {
        DichVu dichVu= dichVuRepository.findByMaDichVuAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
        if(dichVuRepository.existsByTenDichVuAndMaDichVuNotAndTrangThai(dichVuRequest.getTenDichVu(),id,TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+dichVuRequest.getTenDichVu());
        }
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(dichVuRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+ dichVuRequest.getMaQuanLy()));
        dichVu.setTenDichVu(dichVuRequest.getTenDichVu());
        dichVu.setMoTa(dichVuRequest.getMoTa());
        dichVu.setTrangThai(dichVuRequest.getTrangThai());
        dichVu.setDonViCoBan(dichVuRequest.getDonViCoBan());
        dichVu.setTaiKhoan(taiKhoan);
        return mapToDichVuResponse(dichVuRepository.save(dichVu));
    }

    @Override
    public void deleteDichVu(Integer id) {
        DichVu dichVu= dichVuRepository.findByMaDichVuAndTrangThai(id, TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
        dichVu.setTrangThai(TrangThai.daXoa);
        dichVuRepository.save(dichVu);
    }
    public DichVuReponse mapToDichVuResponse(DichVu dichVu) {
        DichVuReponse response = new DichVuReponse();
        response.setMaDichVu(dichVu.getMaDichVu());
        response.setTenDichVu(dichVu.getTenDichVu());
        response.setDonGiaCoBan(dichVu.getDonGiaCoBan());
        response.setDonViCoBan(dichVu.getDonViCoBan());
        response.setMoTa(dichVu.getMoTa());
        response.setTrangThai(dichVu.getTrangThai());
        response.setMaQuanLy(dichVu.getTaiKhoan().getMaTaiKhoan());
        response.setTenQuanLy(dichVu.getTaiKhoan().getHoTen());
        return response;
    }
}
