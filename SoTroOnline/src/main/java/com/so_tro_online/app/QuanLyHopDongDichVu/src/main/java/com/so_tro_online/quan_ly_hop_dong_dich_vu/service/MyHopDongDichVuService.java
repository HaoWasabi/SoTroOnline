package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;


import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.MyHopDongDichVu;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.exception.HopDongDichVuAlreadyExists;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.MyHopDongDichVuRepository;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MyHopDongDichVuService implements IMyHopDongDichVu {
    private final MyHopDongDichVuRepository myHopDongDichVuRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    private final DichVuRepository dichVuRepository;

    public MyHopDongDichVuService(MyHopDongDichVuRepository myHopDongDichVuRepository, HopDongPhongRepository hopDongPhongRepository, DichVuRepository dichVuRepository) {
        this.myHopDongDichVuRepository = myHopDongDichVuRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
        this.dichVuRepository = dichVuRepository;
    }


    @Override
    public List<MyHopDongDichVuResponse> getAllHopDongDichVu() {
        return myHopDongDichVuRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private MyHopDongDichVuResponse mapToResponse(MyHopDongDichVu myHopDongDichVu) {
        MyHopDongDichVuResponse response = new MyHopDongDichVuResponse();
        response.setId(myHopDongDichVu.getId());
        response.setMaHopDong(myHopDongDichVu.getHopDong().getMaHopDongPhong());
        response.setMaDichVu(myHopDongDichVu.getDichVu().getMaDichVu());
        response.setSoLuong(myHopDongDichVu.getSoLuong());
        response.setTenDichVu(myHopDongDichVu.getDichVu().getTenDichVu());
        return response;
    }

    @Override
    public MyHopDongDichVuResponse createHopDongDichVu(MyHopDongDichVuRequest req) {
        if(myHopDongDichVuRepository.existsByHopDongMaHopDongPhongAndDichVuMaDichVu(req.getMaHopDong(), req.getMaDichVu())){
            throw new HopDongDichVuAlreadyExists("hợp đồng dịch vụ đã tồn tại");
        }
        HopDongPhong hopDongPhong=hopDongPhongRepository.findById(req.getMaHopDong())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+req.getMaHopDong()));
        DichVu dichVu=dichVuRepository.findById(req.getMaDichVu())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ với id: "+req.getMaDichVu()));
        MyHopDongDichVu myHopDongDichVu=new MyHopDongDichVu();
        myHopDongDichVu.setHopDong(hopDongPhong);
        myHopDongDichVu.setDichVu(dichVu);
        myHopDongDichVu.setSoLuong(req.getSoLuong());
        return mapToResponse(myHopDongDichVuRepository.save(myHopDongDichVu));
    }

    @Override
    public MyHopDongDichVuResponse updateHopDongDichVu(Integer id, MyHopDongDichVuRequest roomRequest) {
        MyHopDongDichVu oldHopDongDichVu=myHopDongDichVuRepository.findById(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ với id: "+id));
        oldHopDongDichVu.setSoLuong(roomRequest.getSoLuong());
        return mapToResponse(myHopDongDichVuRepository.save(oldHopDongDichVu));
    }

    @Override
    public void deleteHopDongDichVu(Integer id) {
        MyHopDongDichVu dichVu=myHopDongDichVuRepository.findById(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ với id: "+id));
        myHopDongDichVuRepository.delete(dichVu);
    }

    @Override
    public MyHopDongDichVuResponse getHopDongDichVuById(Integer id) {
        return myHopDongDichVuRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng dịch vụ với id: "+id));
    }
}
