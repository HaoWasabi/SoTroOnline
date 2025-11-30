package com.so_tro_online.quan_ly_hoa_don.event;

import com.so_tro_online.dung_chung.event.hopdongphong.HopDongPhongDeletedEvent;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThai;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HoaDonEventListener {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @EventListener
    public void handleHopDongDeleted(HopDongPhongDeletedEvent event) {

        Integer hopDongPhongId = event.getHopDongPhongId();

        // Lấy tất cả hóa đơn thuộc hợp đồng này
        List<HoaDon> invoices =
                hoaDonRepository.findByHopDongPhong(hopDongPhongId);

        for (HoaDon invoice : invoices) {
            invoice.setTrangThai(TrangThai.DA_XOA);
        }

        hoaDonRepository.saveAll(invoices);

        System.out.println("Đã đánh dấu DA_XOA cho " + invoices.size()
                + " hóa đơn của hợp đồng " + hopDongPhongId);
    }
}
