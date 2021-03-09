package org.tyaa.demo.java.springboot.brokershop.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name="Roles")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;
}
