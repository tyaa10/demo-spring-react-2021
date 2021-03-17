package org.tyaa.demo.java.springboot.brokershop.repositories.criteria;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/* Структура шага поискового запроса query dsl */
@Getter
@Setter
@AllArgsConstructor
public class SearchCriteria {
    private String key; // имя поля сущности
    private String operation; // знак операции
    private Object value; // значение для сравнения со значением поля сущности
}
