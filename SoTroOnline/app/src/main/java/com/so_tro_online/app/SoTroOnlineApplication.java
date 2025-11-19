package com.so_tro_online.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.so_tro_online.app",
        "com.so_tro_online.quan_ly_tai_khoan",
        "com.so_tro_online.quan_ly_khach_thue",
        "com.so_tro_online.quan_ly_dich_vu_phong",
        "com.so_tro_online.quan_ly_phong",
        "com.so_tro_online.quan_ly_hop_dong_phong",
        "com.so_tro_online.quan_ly_hop_dong_dich_vu",
        "com.so_tro_online.quan_ly_hoa_don",
        "com.so_tro_online.quan_ly_phieu_thu",
        "com.so_tro_online.dung_chung"
})
@EnableJpaRepositories(basePackages = {
        "com.so_tro_online.quan_ly_tai_khoan.repository",
        "com.so_tro_online.quan_ly_khach_thue.repository",
        "com.so_tro_online.quan_ly_dich_vu_phong.repository",
        "com.so_tro_online.quan_ly_phong.repository",
        "com.so_tro_online.quan_ly_hop_dong_phong.repository",
        "com.so_tro_online.quan_ly_hop_dong_dich_vu.repository",
        "com.so_tro_online.quan_ly_hoa_don.repository",
        "com.so_tro_online.quan_ly_phieu_thu.repository",
})
@EntityScan(basePackages = {
        "com.so_tro_online.quan_ly_tai_khoan.entity",
        "com.so_tro_online.quan_ly_khach_thue.entity",
        "com.so_tro_online.quan_ly_dich_vu_phong.entity",
        "com.so_tro_online.quan_ly_phong.entity",
        "com.so_tro_online.quan_ly_hop_dong_phong.enity",
        "com.so_tro_online.quan_ly_hop_dong_dich_vu.entity",
        "com.so_tro_online.quan_ly_hoa_don.entity",
        "com.so_tro_online.quan_ly_phieu_thu.entity",
})
public class SoTroOnlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoTroOnlineApplication.class, args);
	}

}
