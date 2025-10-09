package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HoaDonWriter implements ItemWriter<HoaDon> {

    private final HoaDonRepository hoaDonRepository;

    public HoaDonWriter(HoaDonRepository hoaDonRepository) {
        this.hoaDonRepository = hoaDonRepository;
    }


    @Override
    public void write(Chunk<? extends HoaDon> chunk) throws Exception {
        List<? extends HoaDon> hoaDons = chunk.getItems();
        hoaDonRepository.saveAll(hoaDons);
    }
}