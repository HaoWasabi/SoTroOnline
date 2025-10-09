package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class SuDungDichVuResponse {
    private Integer maHopDongDichVu;
    private Date thangNam;  // ví dụ: 2025-10-01
    private BigDecimal chiSoCu;
    private BigDecimal chiSoMoi;

    public Integer getMaHopDongDichVu() {
        return maHopDongDichVu;
    }

    public void setMaHopDongDichVu(Integer maHopDongDichVu) {
        this.maHopDongDichVu = maHopDongDichVu;
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
