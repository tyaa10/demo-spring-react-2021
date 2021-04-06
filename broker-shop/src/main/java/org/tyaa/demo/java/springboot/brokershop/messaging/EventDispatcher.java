package org.tyaa.demo.java.springboot.brokershop.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EventDispatcher {

    private RabbitTemplate rabbitTemplate;
    private String orderExchange;
    private String orderCompletedRoutingKey;

    public EventDispatcher(
            final RabbitTemplate rabbitTemplate,
            @Value("${rabbitmq.order.exchange}") final String orderExchange,
            @Value("${rabbitmq.order.completed.key}") final String orderCompletedRoutingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.orderExchange = orderExchange;
        this.orderCompletedRoutingKey = orderCompletedRoutingKey;
    }

    public void send(final OrderCompletedEvent orderCompletedEvent) {
        // отправка сообщения на обменник, работающий на движке RabbitMQ
        rabbitTemplate.convertAndSend(
                orderExchange, // имя обменника
                orderCompletedRoutingKey, // ключ события - какого оно типа
                orderCompletedEvent // модель сообщения
        );
    }
}