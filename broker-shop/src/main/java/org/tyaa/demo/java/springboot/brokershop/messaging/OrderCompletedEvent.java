package org.tyaa.demo.java.springboot.brokershop.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tyaa.demo.java.springboot.brokershop.models.Cart;

import java.io.Serializable;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderCompletedEvent implements Serializable {
    private String orderId;
    private Cart cart;
}
