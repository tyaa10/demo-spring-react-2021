package org.tyaa.demo.java.springboot.brokershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.demo.java.springboot.brokershop.entities.User;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    User findUserByName(String name);
}
