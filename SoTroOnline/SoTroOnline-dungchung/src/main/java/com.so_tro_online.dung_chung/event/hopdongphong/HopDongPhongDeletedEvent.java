package com.so_tro_online.dung_chung.event.hopdongphong;

public class HopDongPhongDeletedEvent {
    private final Integer hopDongPhongId;

    public HopDongPhongDeletedEvent(Integer hopDongPhongId) {
        this.hopDongPhongId = hopDongPhongId;
    }

    public Integer getHopDongPhongId() {
        return hopDongPhongId;
    }
}
