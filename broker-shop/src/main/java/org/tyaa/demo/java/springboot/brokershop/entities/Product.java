package org.tyaa.demo.java.springboot.brokershop.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Products")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "description", nullable = false, length = 2000)
    private String description;
    @Column(name = "price", nullable = false, columnDefinition = "DECIMAL(10,2)")
    private BigDecimal price;
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    @Lob
    @Column(name = "image")
    private String image;
    @ManyToOne
    @JoinColumn(name="category_id", nullable=false)
    private Category category;
}
