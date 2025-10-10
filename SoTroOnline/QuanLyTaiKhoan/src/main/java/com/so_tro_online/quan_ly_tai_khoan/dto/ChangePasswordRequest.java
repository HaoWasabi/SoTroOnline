package com.so_tro_online.quan_ly_tai_khoan.dto;

public class ChangePasswordRequest {

    private int maTaiKhoan;
    private String matKhauMoi;

    public ChangePasswordRequest() {
    }

    public ChangePasswordRequest(int maTaiKhoan, String matKhauMoi) {
        this.maTaiKhoan = maTaiKhoan;
        this.matKhauMoi = matKhauMoi;
    }

    public int getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(int maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getMatKhauMoi() {
        return matKhauMoi;
    }

    public void setMatKhauMoi(String matKhauMoi) {
        this.matKhauMoi = matKhauMoi;
    }
}
