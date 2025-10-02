package com.so_tro_online.quan_ly_phieu_thu.entity;

public enum TrangThaiPhieuThu {
        HOAT_DONG("hoatDong"),
        DA_HUY("daHuy");

        private final String value;

        TrangThaiPhieuThu(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }