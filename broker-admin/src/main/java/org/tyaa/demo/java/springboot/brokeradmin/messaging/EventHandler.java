package org.tyaa.demo.java.springboot.brokeradmin.messaging;

import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.tyaa.demo.java.springboot.brokeradmin.models.Order;
import org.tyaa.demo.java.springboot.brokeradmin.services.OrderService;

@Component
public class EventHandler {

    private final OrderService orderService;

    public EventHandler(OrderService orderService) {
        this.orderService = orderService;
    }

    @RabbitListener(queues = "${rabbitmq.order.queue}")
    void handleTranslationCompleted(final OrderCompletedEvent event) {
        try {
            System.out.println("*** New Order ***");
            System.out.println("ID = " + event.getOrderId());
            System.out.println("Order Items:");
            event.getCart().getCartItems().forEach(System.out::println);
            orderService.createItem(
                    Order.builder()
                    .orderId(event.getOrderId())
                    .items(event.getCart().getCartItems())
                    .build()
            );
        } catch (final Exception e) {
            throw new AmqpRejectAndDontRequeueException(e);
        }
    }
}
