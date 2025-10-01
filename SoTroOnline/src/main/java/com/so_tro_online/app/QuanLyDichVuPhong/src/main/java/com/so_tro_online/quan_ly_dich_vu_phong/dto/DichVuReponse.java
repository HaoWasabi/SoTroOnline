package com.so_tro_online.quan_ly_dich_vu_phong.dto;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai;

import java.math.BigDecimal;

public class DichVuReponse {
        private Integer maDichVu;
        private Integer maQuanLy;
        private String tenQuanLy;
        private String tenDichVu;
        private BigDecimal donGiaCoBan;
        private String donViCoBan;
        private String moTa;
        private TrangThai trangThai;
        public DichVuReponse(Integer maDichVu, Integer maQuanLy, String tenQuanLy, String tenDichVu, BigDecimal donGiaCoBan, String donViCoBan, String moTa, TrangThai trangThai) {
                this.maDichVu = maDichVu;
                this.maQuanLy = maQuanLy;
                this.tenQuanLy = tenQuanLy;
                this.tenDichVu = tenDichVu;
                this.donGiaCoBan = donGiaCoBan;
                this.donViCoBan = donViCoBan;
                this.moTa = moTa;
                this.trangThai = trangThai;
        }
        public DichVuReponse(){

        }

        public Integer getMaDichVu() {
                return maDichVu;
        }

        public void setMaDichVu(Integer maDichVu) {
                this.maDichVu = maDichVu;
        }

        public Integer getMaQuanLy() {
                return maQuanLy;
        }

        public void setMaQuanLy(Integer maQuanLy) {
                this.maQuanLy = maQuanLy;
        }

        public String getTenQuanLy() {
                return tenQuanLy;
        }

        public void setTenQuanLy(String tenQuanLy) {
                this.tenQuanLy = tenQuanLy;
        }

        public String getTenDichVu() {
                return tenDichVu;
        }

        public void setTenDichVu(String tenDichVu) {
                this.tenDichVu = tenDichVu;
        }

        public BigDecimal getDonGiaCoBan() {
                return donGiaCoBan;
        }

        public void setDonGiaCoBan(BigDecimal donGiaCoBan) {
                this.donGiaCoBan = donGiaCoBan;
        }

        public String getDonViCoBan() {
                return donViCoBan;
        }

        public void setDonViCoBan(String donViCoBan) {
                this.donViCoBan = donViCoBan;
        }

        public String getMoTa() {
                return moTa;
        }

        public void setMoTa(String moTa) {
                this.moTa = moTa;
        }

        public TrangThai getTrangThai() {
                return trangThai;
        }

        public void setTrangThai(TrangThai trangThai) {
                this.trangThai = trangThai;
        }

        @Override
        public String toString() {
                return "DichVuReponse{" +
                        "maDichVu='" + maDichVu + '\'' +
                        ", maQuanLy='" + maQuanLy + '\'' +
                        ", tenQuanLy='" + tenQuanLy + '\'' +
                        ", tenDichVu='" + tenDichVu + '\'' +
                        ", donGiaCoBan=" + donGiaCoBan +
                        ", donViCoBan='" + donViCoBan + '\'' +
                        ", moTa='" + moTa + '\'' +
                        ", trangThai=" + trangThai +
                        '}';
        }
}


