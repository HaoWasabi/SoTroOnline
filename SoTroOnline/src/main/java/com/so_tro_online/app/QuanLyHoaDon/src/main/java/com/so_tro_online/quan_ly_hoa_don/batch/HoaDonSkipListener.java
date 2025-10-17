package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import org.springframework.batch.core.SkipListener;
import org.springframework.stereotype.Component;

@Component
public class HoaDonSkipListener implements SkipListener<HopDongPhong, HoaDon> {
    @Override
    public void onSkipInProcess(HopDongPhong item, Throwable t) {
        System.out.println("Lỗi khi xử lý hợp đồng: " + item.getMaHopDongPhong() + ", lỗi: " + t.getMessage());
    }
}
