package com.so_tro_online.quan_ly_phieu_thu.event;

import com.so_tro_online.dung_chung.event.hopdongphong.HopDongPhongDeletedEvent;
import com.so_tro_online.quan_ly_hop_dong_phong.service.HopDongPhongService;
import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThai;
import com.so_tro_online.quan_ly_phieu_thu.repository.PhieuThuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PhieuThuEventListener {

    private static final Logger logger = LoggerFactory.getLogger(PhieuThuEventListener.class);

    @Autowired
    private PhieuThuRepository phieuThuRepository;

    @EventListener
    public void handleHopDongDeleted(HopDongPhongDeletedEvent event) {

        Integer hopDongPhongId = event.getHopDongPhongId();

        List<PhieuThu> receipts =
                phieuThuRepository.findByHoaDon_HopDongPhong(hopDongPhongId);

        for (PhieuThu receipt : receipts) {
            receipt.setTrangThai(TrangThai.daXoa);
            logger.info("Trạng thái phiếu thu " + receipt.getMaPhieuThu() + "/t" + receipt.getTrangThai());
        }

        phieuThuRepository.saveAll(receipts);

        System.out.println(
                "Đã đánh dấu DA_XOA cho " + receipts.size() + " phiếu thu của hợp đồng " + hopDongPhongId
        );
    }
}
