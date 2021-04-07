package org.tyaa.demo.java.springboot.brokeradmin.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // активация группы точек назначения topic
        // (место приема асинхронных сообщений от всех клиентов:
        // отправив сообщение в topic клиент продолжает работу,
        // ничего не ожидая в ответ)
        config.enableSimpleBroker("/topic");
        // объявление приставки к имени любой точки назначения
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // объявление конечной точки для подключения клиентов рассылки
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3001");
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3001").withSockJS();
    }
}
