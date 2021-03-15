package org.tyaa.demo.java.springboot.brokershop.services.interfaces;

import org.tyaa.demo.java.springboot.brokershop.models.ProductFilterModel;
import org.tyaa.demo.java.springboot.brokershop.models.ProductModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;

public interface IProductService {
    ResponseModel create(ProductModel productModel);
    ResponseModel update(ProductModel productModel);
    ResponseModel getAll();
    ResponseModel delete(Long id);
    ResponseModel getFiltered(ProductFilterModel filter);
}
