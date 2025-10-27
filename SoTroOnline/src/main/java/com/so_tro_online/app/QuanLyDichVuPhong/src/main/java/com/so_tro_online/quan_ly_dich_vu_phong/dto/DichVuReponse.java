package com.so_tro_online.quan_ly_dich_vu_phong.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;

public class DichVuReponse {
        private Integer maDichVu;
        private BigDecimal donGiaDien;
        private BigDecimal donGiaNuoc;
        private BigDecimal donGiaRac;
        private BigDecimal donGiaWifi;
        private BigDecimal donGiaCap;
        private BigDecimal donGiaKhac;

        public Integer getMaDichVu() {
                return maDichVu;
        }

        public void setMaDichVu(Integer maDichVu) {
                this.maDichVu = maDichVu;
        }

        public BigDecimal getDonGiaDien() {
                return donGiaDien;
        }

        public void setDonGiaDien(BigDecimal donGiaDien) {
                this.donGiaDien = donGiaDien;
        }

        public BigDecimal getDonGiaNuoc() {
                return donGiaNuoc;
        }

        public void setDonGiaNuoc(BigDecimal donGiaNuoc) {
                this.donGiaNuoc = donGiaNuoc;
        }

        public BigDecimal getDonGiaRac() {
                return donGiaRac;
        }

        public void setDonGiaRac(BigDecimal donGiaRac) {
                this.donGiaRac = donGiaRac;
        }

        public BigDecimal getDonGiaWifi() { return donGiaWifi; }

        public void setDonGiaWifi(BigDecimal donGiaWifi) { this.donGiaWifi = donGiaWifi; }

        public BigDecimal getDonGiaCap() { return donGiaCap; }

        public void setDonGiaCap(BigDecimal donGiaCap) { this.donGiaCap = donGiaCap; }

        public BigDecimal getDonGiaKhac() { return donGiaKhac; }

        public void setDonGiaKhac(BigDecimal donGiaKhac) { this.donGiaKhac = donGiaKhac; }
}


