package com.so_tro_online.quan_ly_hop_dong_dich_vu.entity;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import jakarta.persistence.*;

@Entity
public class MyHopDongDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private HopDongPhong hopDong;
    @ManyToOne
    private DichVu dichVu;
    private Integer soLuong;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public HopDongPhong getHopDong() {
        return hopDong;
    }

    public void setHopDong(HopDongPhong hopDong) {
        this.hopDong = hopDong;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }

    public Integer getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }
}
