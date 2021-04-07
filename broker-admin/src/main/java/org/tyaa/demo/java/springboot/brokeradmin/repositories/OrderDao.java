package org.tyaa.demo.java.springboot.brokeradmin.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.demo.java.springboot.brokeradmin.models.Order;

@Repository
public interface OrderDao extends ReactiveMongoRepository<Order, String> {
}