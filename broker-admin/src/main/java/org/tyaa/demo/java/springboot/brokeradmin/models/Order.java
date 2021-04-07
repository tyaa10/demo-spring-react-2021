package org.tyaa.demo.java.springboot.brokeradmin.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/* Оплаченный заказ */
@AllArgsConstructor
@Data
@Builder
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document
public class Order {
    @Id
    private String id;
    private String orderId;
    private List<CartItem> items;
    public Order () {
        this.items = new ArrayList<>();
    }
}
