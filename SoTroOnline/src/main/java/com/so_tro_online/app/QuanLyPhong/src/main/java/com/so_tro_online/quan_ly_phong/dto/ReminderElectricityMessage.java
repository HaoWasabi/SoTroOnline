package com.so_tro_online.quan_ly_phong.dto;

import java.util.List;

public class ReminderElectricityMessage {
    private Integer month;
    private Integer year;
    private List<String>phongList;

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public List<String> getPhongList() {
        return phongList;
    }

    public void setPhongList(List<String> phongList) {
        this.phongList = phongList;
    }
}
