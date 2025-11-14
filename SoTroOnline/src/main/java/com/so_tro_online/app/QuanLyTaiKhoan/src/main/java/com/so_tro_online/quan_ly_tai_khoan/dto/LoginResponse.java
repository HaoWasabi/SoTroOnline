
package com.so_tro_online.quan_ly_tai_khoan.dto;

public class LoginResponse{
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private TaiKhoanDto taiKhoanDTO;

    public LoginResponse() {}

    public LoginResponse(String accessToken, String refreshToken, long expiresIn, TaiKhoanDto taiKhoanDTO) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.taiKhoanDTO = taiKhoanDTO;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public TaiKhoanDto getTaiKhoanDTO() {
        return taiKhoanDTO;
    }

    public void setTaiKhoanDTO(TaiKhoanDto taiKhoanDTO) {
        this.taiKhoanDTO = taiKhoanDTO;
    }

}
