package org.tyaa.demo.java.springboot.brokershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyaa.demo.java.springboot.brokershop.models.ProductFilterModel;
import org.tyaa.demo.java.springboot.brokershop.models.ProductModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.services.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public ResponseEntity<ResponseModel> getAll() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @PostMapping("/products")
    public ResponseEntity<ResponseModel> create(@RequestBody ProductModel product) {
        return new ResponseEntity<>(service.create(product), HttpStatus.CREATED);
    }

    @PatchMapping(value = "/products/{id}")
    public ResponseEntity<ResponseModel> update(@PathVariable Long id, @RequestBody ProductModel product) {
        product.setId(id);
        return new ResponseEntity<>(service.update(product), HttpStatus.OK);
    }

    @GetMapping("/products/price-bounds")
    public ResponseEntity<ResponseModel> getProductsPriceBounds() {
        return new ResponseEntity<>(
                service.getProductsPriceBounds(),
                HttpStatus.OK
        );
    }

    @GetMapping("/products/quantity-bounds")
    public ResponseEntity<ResponseModel> getProductsQuantityBounds() {
        return new ResponseEntity<>(
                service.getProductsQuantityBounds(),
                HttpStatus.OK
        );
    }

    @DeleteMapping(value = "/products/{id}")
    public ResponseEntity<ResponseModel> deleteProduct(@PathVariable Long id) {
        ResponseModel responseModel = service.delete(id);
        return new ResponseEntity<>(responseModel, HttpStatus.NO_CONTENT);
    }

    // пользовательское правило для составления адресной строки:
    // :: разделяет пары "ключ-значение";
    // : разделяет ключи и значения
    @GetMapping("/categories/{categoryIds}/products::orderBy:{orderBy}::sortingDirection:{sortingDirection}")
    public ResponseEntity getByCategories(
        @PathVariable List<Long> categoryIds,
        @PathVariable String orderBy,
        @PathVariable Sort.Direction sortingDirection
    ) {
        return new ResponseEntity<>(
                service.getFiltered(
                        new ProductFilterModel(categoryIds, orderBy, sortingDirection)
                ),
                HttpStatus.OK
        );
    }
}
