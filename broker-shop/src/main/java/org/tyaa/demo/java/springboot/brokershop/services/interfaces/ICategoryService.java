package org.tyaa.demo.java.springboot.brokershop.services.interfaces;

import org.tyaa.demo.java.springboot.brokershop.models.CategoryModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;

public interface ICategoryService {
    ResponseModel create(CategoryModel categoryModel);
    ResponseModel update(CategoryModel categoryModel);
    ResponseModel getAll();
    ResponseModel delete(Long id);
}
