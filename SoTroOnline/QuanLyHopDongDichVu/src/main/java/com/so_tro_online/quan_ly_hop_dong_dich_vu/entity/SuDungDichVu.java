package com.so_tro_online.quan_ly_hop_dong_dich_vu.entity;

import com.so_tro_online.quan_ly_phong.entity.Phong;

import jakarta.persistence.*;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "su_dung_dich_vu")
public class SuDungDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    private Phong phong;

    @Column(name = "thang_nam")
    private LocalDate thangNam;

    @Column(name = "chi_so_dien_cu")
    private Integer chiSoDienCu;

    @Column(name = "chi_so_dien_moi")
    private Integer chiSoDienMoi;

    @Column(name = "chi_so_nuoc_cu")
    private Integer chiSoNuocCu;

    @Column(name = "chi_so_nuoc_moi")
    private Integer chiSoNuocMoi;

    @Column(name = "trang_thai")
    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Phong getPhong() {
        return phong;
    }

    public void setPhong(Phong phong) {
        this.phong = phong;
    }

    public LocalDate getThangNam() {
        return thangNam;
    }

    public void setThangNam(LocalDate thangNam) {
        this.thangNam = thangNam;
    }

    public Integer getChiSoDienCu() {
        return chiSoDienCu;
    }

    public void setChiSoDienCu(Integer chiSoDienCu) {
        this.chiSoDienCu = chiSoDienCu;
    }

    public Integer getChiSoDienMoi() {
        return chiSoDienMoi;
    }

    public void setChiSoDienMoi(Integer chiSoDienMoi) {
        this.chiSoDienMoi = chiSoDienMoi;
    }

    public Integer getChiSoNuocCu() {
        return chiSoNuocCu;
    }

    public void setChiSoNuocCu(Integer chiSoNuocCu) {
        this.chiSoNuocCu = chiSoNuocCu;
    }

    public Integer getChiSoNuocMoi() {
        return chiSoNuocMoi;
    }

    public void setChiSoNuocMoi(Integer chiSoNuocMoi) {
        this.chiSoNuocMoi = chiSoNuocMoi;
    }
}
