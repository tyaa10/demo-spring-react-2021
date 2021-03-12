package org.tyaa.demo.java.springboot.brokershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.demo.java.springboot.brokershop.entities.Category;

@Repository
public interface CategoryDao extends JpaRepository<Category, Long> {
}
