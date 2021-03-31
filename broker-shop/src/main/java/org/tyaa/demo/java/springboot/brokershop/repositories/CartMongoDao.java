package org.tyaa.demo.java.springboot.brokershop.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.demo.java.springboot.brokershop.models.Cart;

@Repository
public interface CartMongoDao extends MongoRepository<Cart, String> {
    // расширяем стандартный набор методов работы с хранилищем
    // методом получения одного объекта Cart по ИД пользователя,
    // которому пренадлежит эта корзина
    Cart findCartByUserId(Long userId);
}
