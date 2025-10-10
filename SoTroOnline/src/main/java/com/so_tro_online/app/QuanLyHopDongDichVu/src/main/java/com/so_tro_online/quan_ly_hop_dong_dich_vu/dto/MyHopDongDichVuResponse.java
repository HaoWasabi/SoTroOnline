package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;


import java.util.List;

public class MyHopDongDichVuResponse {
    private Integer id;
    private Integer maHopDong;

    private Integer maDichVu;
    private  String tenDichVu;
    private Integer soLuong;
    private List<SuDungDichVuResponse> suDungDichVuResponses;

    public List<SuDungDichVuResponse> getSuDungDichVuResponses() {
        return suDungDichVuResponses;
    }

    public void setSuDungDichVuResponses(List<SuDungDichVuResponse> suDungDichVuResponses) {
        this.suDungDichVuResponses = suDungDichVuResponses;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMaHopDong() {
        return maHopDong;
    }

    public void setMaHopDong(Integer maHopDong) {
        this.maHopDong = maHopDong;
    }

    public Integer getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(Integer maDichVu) {
        this.maDichVu = maDichVu;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public Integer getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }
}
