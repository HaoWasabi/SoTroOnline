package com.so_tro_online.quan_ly_phieu_thu.dto;

import java.math.BigDecimal;

public class ThuNoRequest {
    private Integer maHopDongPhong;
    private BigDecimal soTienThu;

    public Integer getMaHopDongPhong() {
        return maHopDongPhong;
    }

    public void setMaHopDongPhong(Integer maHopDongPhong) {
        this.maHopDongPhong = maHopDongPhong;
    }

    public BigDecimal getSoTienThu() {
        return soTienThu;
    }

    public void setSoTienThu(BigDecimal soTienThu) {
        this.soTienThu = soTienThu;
    }
}
