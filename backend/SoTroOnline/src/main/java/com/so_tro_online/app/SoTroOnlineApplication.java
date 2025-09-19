package com.so_tro_online.app;

import com.so_tro_online.quan_ly_phong.entity.Phong;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
		"com.so_tro_online",
})
@EntityScan(basePackages = "com.so_tro_online")
@EnableJpaRepositories(basePackages = "com.so_tro_online")
public class SoTroOnlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoTroOnlineApplication.class, args);
	}

}
