package org.tyaa.demo.java.springboot.brokershop;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.tyaa.demo.java.springboot.brokershop.entities.Role;
import org.tyaa.demo.java.springboot.brokershop.entities.User;
import org.tyaa.demo.java.springboot.brokershop.repositories.RoleDao;
import org.tyaa.demo.java.springboot.brokershop.repositories.UserDao;

@SpringBootApplication
public class BrokerShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrokerShopApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(
			RoleDao roleDao,
			UserDao userDao,
			PasswordEncoder passwordEncoder) {
		return args -> {
			roleDao.save(Role.builder().name("ROLE_ADMIN").build());
			roleDao.save(Role.builder().name("ROLE_USER").build());
			Role adminRole = roleDao.findRoleByName("ROLE_ADMIN");
			Role userRole = roleDao.findRoleByName("ROLE_USER");
			userDao.save(
					User.builder()
							.name("admin")
							.password(passwordEncoder.encode("AdminPassword1"))
							.role(adminRole)
							.build()
			);
			userDao.save(
					User.builder()
							.name("one")
							.password(passwordEncoder.encode("UserPassword1"))
							.role(userRole)
							.build()
			);
			userDao.save(
					User.builder()
							.name("two")
							.password(passwordEncoder.encode("UserPassword2"))
							.role(userRole)
							.build()
			);
			userDao.save(
					User.builder()
							.name("three")
							.password(passwordEncoder.encode("UserPassword3"))
							.role(userRole)
							.build()
			);
		};
	}
}
