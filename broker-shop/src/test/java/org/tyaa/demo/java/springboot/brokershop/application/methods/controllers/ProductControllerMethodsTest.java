package org.tyaa.demo.java.springboot.brokershop.application.methods.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.tyaa.demo.java.springboot.brokershop.controller.ProductController;
import org.tyaa.demo.java.springboot.brokershop.models.ProductFilterModel;
import org.tyaa.demo.java.springboot.brokershop.models.ProductModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductControllerMethodsTest {

    private Long lastId = Long.MAX_VALUE;

    @Autowired
    private ProductController productController;

    @Test
    public void givenCategoryIdsWhenGetByCategoriesThenReturnProductsByCategories () {
        final ProductFilterModel filter =
            ProductFilterModel.builder()
                    .categories(Arrays.asList(1L, 2L))
                    .orderBy("id")
                    .sortingDirection(Sort.Direction.DESC)
                    .build();
        ResponseEntity responseEntityFiltered
            = productController.getByCategories(
                filter.categories,
                filter.orderBy,
                filter.sortingDirection
        );
        assertNotNull(responseEntityFiltered);
        assertEquals(responseEntityFiltered.getStatusCode(), HttpStatus.OK);
        ((List<ProductModel>)((ResponseModel)responseEntityFiltered.getBody())
                .getData())
        .forEach(productModel -> {
            if (!(productModel.getCategory().getId().equals(1L)
                || productModel.getCategory().getId().equals(2L))) {
                fail("Expected Category id equals 1L or 2L, but got " + productModel.getCategoryId());
            }
            if (productModel.getId() > lastId) {
                fail("Expected DESC sort, but got ASC one");
            }
            lastId = productModel.getId();
        });
    }
}
