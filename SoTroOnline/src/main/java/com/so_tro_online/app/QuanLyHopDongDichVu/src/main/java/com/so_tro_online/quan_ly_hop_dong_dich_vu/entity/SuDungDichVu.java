package com.so_tro_online.quan_ly_hop_dong_dich_vu.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
public class SuDungDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private MyHopDongDichVu hopDongDichVu;
    private Date thangNam;  // ví dụ: 2025-10-01
    private BigDecimal chiSoCu;
    private BigDecimal chiSoMoi;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MyHopDongDichVu getHopDongDichVu() {
        return hopDongDichVu;
    }
    public void setHopDongDichVu(MyHopDongDichVu hopDongDichVu) {
        this.hopDongDichVu = hopDongDichVu;
    }
    public Date getThangNam() {
        return thangNam;
    }
    public void setThangNam(Date thangNam) {
        this.thangNam = thangNam;
    }
    public BigDecimal getChiSoCu() {
        return chiSoCu;
    }

    public void setChiSoCu(BigDecimal chiSoCu) {
        this.chiSoCu = chiSoCu;
    }

    public BigDecimal getChiSoMoi() {
        return chiSoMoi;
    }

    public void setChiSoMoi(BigDecimal chiSoMoi) {
        this.chiSoMoi = chiSoMoi;
    }

}
