package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.MyHopDongDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.exception.SuDungDichVuAlreadyExist;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.MyHopDongDichVuRepository;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.SuDungDichVuRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuDungDichVuService implements ISuDungDichVuService{
    private final SuDungDichVuRepository suDungDichVuRepository;
    private final MyHopDongDichVuRepository hopDongDichVuRepository;

    public SuDungDichVuService(SuDungDichVuRepository suDungDichVuRepository, MyHopDongDichVuRepository hopDongDichVuRepository) {
        this.suDungDichVuRepository = suDungDichVuRepository;
        this.hopDongDichVuRepository = hopDongDichVuRepository;
    }


    @Override
    public List<SuDungDichVuResponse> getAllSuDungDichVu() {
        return suDungDichVuRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private SuDungDichVuResponse mapToResponse(SuDungDichVu suDungDichVu) {
        SuDungDichVuResponse response = new SuDungDichVuResponse();
        response.setMaHopDongDichVu(suDungDichVu.getHopDongDichVu().getId());
        response.setChiSoCu(suDungDichVu.getChiSoCu());
        response.setChiSoMoi(suDungDichVu.getChiSoMoi());
        response.setThangNam(suDungDichVu.getThangNam());
        return response;
    }

    @Override
    public SuDungDichVuResponse createSuDungDichVu(SuDungDichVuRequest req) {
        if(suDungDichVuRepository.findByHopDongDichVuIdAndThangNam(
                req.getMaHopDongDichVu(),
                req.getThangNam().getMonth(),
                req.getThangNam().getYear())!=null){
            throw new SuDungDichVuAlreadyExist("sử dụng dịch vụ đã tồn tại");
        }
        MyHopDongDichVu hopDongDichVu=hopDongDichVuRepository.findById(req.getMaHopDongDichVu())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ id: "+req.getMaHopDongDichVu()));
        SuDungDichVu suDungDichVu=new SuDungDichVu();
        suDungDichVu.setHopDongDichVu(hopDongDichVu);
        suDungDichVu.setChiSoCu(req.getChiSoCu());
        suDungDichVu.setChiSoMoi(req.getChiSoMoi());
        suDungDichVu.setThangNam(req.getThangNam());
        return mapToResponse(suDungDichVuRepository.save(suDungDichVu));
    }

    @Override
    public SuDungDichVuResponse updateSuDungDichVu(Integer id, SuDungDichVuRequest req) {
        SuDungDichVu suDungDichVu=suDungDichVuRepository.findById(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy sử dụng dịch vụ id: "+id));
        suDungDichVu.setChiSoCu(req.getChiSoCu());
        suDungDichVu.setChiSoMoi(req.getChiSoMoi());
        return mapToResponse(suDungDichVuRepository.save(suDungDichVu));
    }

    @Override
    public SuDungDichVuResponse getSuDungDichVu(Integer id) {
        return suDungDichVuRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow( ()->new ReseourceNotFoundException("không tìm thấy sử dụng dịch vụ id: "+id));
    }
}
