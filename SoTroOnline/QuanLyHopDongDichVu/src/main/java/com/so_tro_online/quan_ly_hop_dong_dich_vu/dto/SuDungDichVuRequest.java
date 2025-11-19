package com.so_tro_online.quan_ly_hop_dong_dich_vu.dto;

import java.time.LocalDate;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;


public class SuDungDichVuRequest {

    private Integer maPhong;
    private LocalDate thangNam; // ví dụ: 2025-10-01
    private Integer chiSoDienCu;
    private Integer chiSoDienMoi;
    private Integer chiSoNuocCu;
    private Integer chiSoNuocMoi;
    private TrangThai trangThai;

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getMaPhong() {
        return maPhong;
    }

    public void setMaPhong(Integer maPhong) {
        this.maPhong = maPhong;
    }

    public LocalDate getThangNam() {
        return thangNam;
    }

    public void setThangNam(LocalDate thangNam) {
        this.thangNam = thangNam;
    }

    public Integer getChiSoDienCu() {
        return chiSoDienCu;
    }

    public void setChiSoDienCu(Integer chiSoDienCu) {
        this.chiSoDienCu = chiSoDienCu;
    }

    public Integer getChiSoDienMoi() {
        return chiSoDienMoi;
    }

    public void setChiSoDienMoi(Integer chiSoDienMoi) {
        this.chiSoDienMoi = chiSoDienMoi;
    }

    public Integer getChiSoNuocCu() {
        return chiSoNuocCu;
    }

    public void setChiSoNuocCu(Integer chiSoNuocCu) {
        this.chiSoNuocCu = chiSoNuocCu;
    }

    public Integer getChiSoNuocMoi() {
        return chiSoNuocMoi;
    }

    public void setChiSoNuocMoi(Integer chiSoNuocMoi) {
        this.chiSoNuocMoi = chiSoNuocMoi;
    }

    public String toString() {
        return "SuDungDichVuRequest{maPhong=" + maPhong + ", thangNam=" + thangNam + ", chiSoDienCu=" + chiSoDienCu
                + ", chiSoDienMoi=" + chiSoDienMoi + ", chiSoNuocCu=" + chiSoNuocCu + ", chiSoNuocMoi=" + chiSoNuocMoi
                + ", trangThai=" + trangThai + "}";
    }

    public static SuDungDichVuRequest fromGeminiJson(String json, Integer maPhong, LocalDate thangNam,
                                                     TrangThai trangThai) {
        if (json == null || json.isBlank()) {
            throw new IllegalArgumentException("Empty JSON input");
        }

        JsonObject obj = JsonParser.parseString(json).getAsJsonObject();

        if (obj.has("error")) {
            String err = obj.get("error").getAsString();
            throw new IllegalArgumentException("Gemini returned error: " + err);
        }

        String meterType = obj.has("meter_type") ? obj.get("meter_type").getAsString() : "";

        double reading = 0.0;
        if (obj.has("reading")) {
            try {
                reading = obj.get("reading").getAsDouble();
            } catch (Exception ignored) {
            }
        }

        int integerPart = 0;
        if (obj.has("integer_part")) {
            try {
                integerPart = obj.get("integer_part").getAsInt();
            } catch (Exception ignored) {
                integerPart = (int) Math.floor(reading);
            }
        } else {
            integerPart = (int) Math.floor(reading);
        }

        // decimal part is available in the raw JSON if needed; we do not store
        // fractional values in the integer index fields of this request object.

        SuDungDichVuRequest req = new SuDungDichVuRequest();
        req.setMaPhong(maPhong);
        req.setThangNam(thangNam);
        req.setTrangThai(trangThai);

        if ("electricity".equalsIgnoreCase(meterType)) {
            req.setChiSoDienMoi(Integer.valueOf(integerPart));
        } else if ("water".equalsIgnoreCase(meterType)) {
            req.setChiSoNuocMoi(Integer.valueOf(integerPart));
        }

        // If caller wants to keep decimal information, include it in the toString
        // or log separately. We choose not to store decimals in integer fields.

        return req;
    }

    /** Convenience overload when maPhong/thangNam/trangThai are not available. */
    public static SuDungDichVuRequest fromGeminiJson(String json) {
        return fromGeminiJson(json, null, null, null);
    }
}
