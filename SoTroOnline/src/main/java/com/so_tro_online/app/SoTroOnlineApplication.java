package com.so_tro_online.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.so_tro_online.app",
        "com.so_tro_online.quan_ly_tai_khoan"
})
@EnableJpaRepositories(basePackages = "com.so_tro_online.quan_ly_tai_khoan.repository")
@EntityScan(basePackages = "com.so_tro_online.quan_ly_tai_khoan.entity")
public class SoTroOnlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoTroOnlineApplication.class, args);
	}

}
