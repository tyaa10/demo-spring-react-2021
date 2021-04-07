package org.tyaa.demo.java.springboot.brokeradmin.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokeradmin.models.Order;
import org.tyaa.demo.java.springboot.brokeradmin.repositories.OrderDao;

@Service
public class OrderService {

    private final OrderDao orderDao;
    // стандартный простой отправитель сообщений на WebSocket-topic
    private final SimpMessagingTemplate simpMessagingTemplate;

    public OrderService(SimpMessagingTemplate simpMessagingTemplate, OrderDao orderDao) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.orderDao = orderDao;
    }

    public void createItem (Order order) {
        // планирование сохранения объекта order в хранилище
        orderDao.save(order)
                // запуск сохранения с функцией обратного вызова,
                // которая сработает после окончания операции
                .subscribe(orderModel -> {
                    // отправка рассылки объекта orderModel
                    // всем подписчикам адреса /topic/orders
                    simpMessagingTemplate.convertAndSend("/topic/orders", orderModel);
                });
    }
}
