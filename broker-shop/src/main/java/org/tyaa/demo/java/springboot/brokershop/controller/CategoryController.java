package org.tyaa.demo.java.springboot.brokershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyaa.demo.java.springboot.brokershop.models.CategoryModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.services.CategoryService;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/categories")
    public ResponseEntity<ResponseModel> getAll() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @PostMapping("/categories")
    public ResponseEntity<ResponseModel> create(@RequestBody CategoryModel category) {
        return new ResponseEntity<>(service.create(category), HttpStatus.CREATED);
    }

    @PatchMapping(value = "/categories/{id}")
    public ResponseEntity<ResponseModel> update(@PathVariable Long id, @RequestBody CategoryModel category) {
        category.setId(id);
        return new ResponseEntity<>(service.update(category), HttpStatus.OK);
    }

    @DeleteMapping(value = "/categories/{id}")
    public ResponseEntity<ResponseModel> deleteCategory(@PathVariable Long id) {
        ResponseModel responseModel = service.delete(id);
        return new ResponseEntity<>(responseModel, HttpStatus.OK);
    }
}
