package org.tyaa.demo.java.springboot.brokershop;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.tyaa.demo.java.springboot.brokershop.entities.Role;
import org.tyaa.demo.java.springboot.brokershop.repositories.RoleDao;

@SpringBootApplication
public class BrokerShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrokerShopApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(RoleDao roleDao) {
		return args -> {
			roleDao.save(Role.builder().name("ROLE_ADMIN").build());
			roleDao.save(Role.builder().name("ROLE_USER").build());
		};
	}
}
