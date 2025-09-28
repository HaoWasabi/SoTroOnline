package com.so_tro_online.quan_ly_hoa_don.entity;

public enum TrangThaiChiTietHoaDonDichVu {
        HOAT_DONG("hoatDong"),
        DA_HUY("daHuy");

        private String value;

        TrangThaiChiTietHoaDonDichVu(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
}