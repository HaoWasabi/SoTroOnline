package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
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
            LocalDate now = LocalDate.now().minusMonths(1);
            YearMonth currentMonth = YearMonth.of(now.getYear(), now.getMonth());
            List<HopDongPhong> list = hopDongPhongRepository.findByTrangThai(TrangThai.hoatDong).stream()
                    .filter(hd->{
                        YearMonth ngayBatDau=YearMonth.of(hd.getNgayBatDau().getYear(),hd.getNgayBatDau().getMonth());
                        YearMonth ngayKetThuc=YearMonth.of(hd.getNgayKetThuc().getYear(),hd.getNgayKetThuc().getMonth());
                        return (ngayBatDau.isBefore(currentMonth) || ngayBatDau.equals(currentMonth)) &&
                                (ngayKetThuc.isAfter(currentMonth) || ngayKetThuc.equals(currentMonth));
                    }).toList();
            iterator = list.iterator();
        }
        return iterator.hasNext() ? iterator.next() : null;
    }
}
