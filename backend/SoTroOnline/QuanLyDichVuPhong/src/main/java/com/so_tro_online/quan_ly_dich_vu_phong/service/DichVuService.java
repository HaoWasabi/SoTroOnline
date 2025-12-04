package com.so_tro_online.quan_ly_dich_vu_phong.service;


import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DichVuService implements IDichVuService {

    @Autowired
    private DichVuRepository dichVuRepository;

    @Override
    public DichVuReponse getDichVu() {
        // Get the first available record (guaranteed to exist with ID 1)
        DichVu dichVu = dichVuRepository.findFirst()
            .orElseThrow(() -> new ReseourceNotFoundException("Dich vu not found"));
        
        return convertToResponse(dichVu);
    }
    
    // Helper method to convert DichVu entity to DichVuReponse
    private DichVuReponse convertToResponse(DichVu dichVu) {
        DichVuReponse dichVuReponse = new DichVuReponse();
        dichVuReponse.setDonGiaDien(dichVu.getDonGiaDien());
        dichVuReponse.setDonGiaNuoc(dichVu.getDonGiaNuoc());
        dichVuReponse.setDonGiaRac(dichVu.getDonGiaRac());
        dichVuReponse.setMaDichVu(dichVu.getMaDichVu());
        dichVuReponse.setDonGiaCap(dichVu.getDonGiaCap());
        dichVuReponse.setDonGiaKhac(dichVu.getDonGiaKhac());
        dichVuReponse.setDonGiaWifi(dichVu.getDonGiaWifi());

        return dichVuReponse;
    }

    @Override
    public DichVuReponse updateDichVu(Integer id, DichVuRequest dichVuRequest) {
        // Get the first available record instead of searching by ID
        DichVu dichVu = dichVuRepository.findFirst()
            .orElseThrow(() -> new ReseourceNotFoundException("Dich vu not found"));
            
        dichVu.setDonGiaDien(dichVuRequest.getDonGiaDien());
        dichVu.setDonGiaNuoc(dichVuRequest.getDonGiaNuoc());
        dichVu.setDonGiaRac(dichVuRequest.getDonGiaRac());
        dichVu.setDonGiaCap(dichVuRequest.getDonGiaCap());
        dichVu.setDonGiaWifi(dichVuRequest.getDonGiaWifi());
        dichVu.setDonGiaKhac(dichVuRequest.getDonGiaKhac());
        
        dichVuRepository.save(dichVu);
        return convertToResponse(dichVu);
    }


}
