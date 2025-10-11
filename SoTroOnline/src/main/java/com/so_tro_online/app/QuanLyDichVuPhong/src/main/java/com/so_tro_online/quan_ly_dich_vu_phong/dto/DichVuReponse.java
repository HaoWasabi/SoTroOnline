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
}


