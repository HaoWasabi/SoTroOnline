package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

@Component
public class HopDongPhongReader implements ItemReader<HopDongPhong> {

    private final HopDongPhongRepository hopDongPhongRepository;
    private Iterator<HopDongPhong> iterator;

    public HopDongPhongReader(HopDongPhongRepository hopDongPhongRepository) {
        this.hopDongPhongRepository = hopDongPhongRepository;
    }


    @Override
    public HopDongPhong read() {
        if (iterator == null) {
            List<HopDongPhong> list = hopDongPhongRepository.findByTrangThai(TrangThai.hoatDong);
            iterator = list.iterator();
        }
        return iterator.hasNext() ? iterator.next() : null;
    }
}
