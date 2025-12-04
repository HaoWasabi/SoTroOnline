package com.so_tro_online.quan_ly_hop_dong_dich_vu.util;


public class MeterReadOptions {
    private String meterType; // "water" hoặc "electricity"
    private String language; // "vi" hoặc "en"
    private double confidenceThreshold; // 0.0 - 1.0
    private boolean includeNotes; // có bao gồm ghi chú hay không
    private String imageDescription; // mô tả ảnh tùy chọn

    // Constructor mặc định
    public MeterReadOptions() {
        this.meterType = "water";
        this.language = "vi";
        this.confidenceThreshold = 0.5;
        this.includeNotes = true;
        this.imageDescription = "";
    }

    // Builder pattern
    public static MeterReadOptions builder() {
        return new MeterReadOptions();
    }

    public MeterReadOptions withMeterType(String type) {
        this.meterType = type;
        return this;
    }

    public MeterReadOptions withLanguage(String lang) {
        this.language = lang;
        return this;
    }

    public MeterReadOptions withConfidenceThreshold(double threshold) {
        this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
        return this;
    }

    public MeterReadOptions withIncludeNotes(boolean include) {
        this.includeNotes = include;
        return this;
    }

    public MeterReadOptions withImageDescription(String desc) {
        this.imageDescription = desc != null ? desc : "";
        return this;
    }

    // Getters
    public String getMeterType() {
        return meterType;
    }

    public String getLanguage() {
        return language;
    }

    public double getConfidenceThreshold() {
        return confidenceThreshold;
    }

    public boolean isIncludeNotes() {
        return includeNotes;
    }

    public String getImageDescription() {
        return imageDescription;
    }

    public String getUnit() {
        return "water".equalsIgnoreCase(meterType) ? "m3" : "kWh";
    }
}
