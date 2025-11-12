package com.so_tro_online.app;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication(scanBasePackages = {
		"com.so_tro_online",
})
@EntityScan(basePackages = "com.so_tro_online")
@EnableJpaRepositories(basePackages = "com.so_tro_online")
@EnableScheduling
public class SoTroOnlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoTroOnlineApplication.class, args);
	}

}
