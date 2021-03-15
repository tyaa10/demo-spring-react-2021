package org.tyaa.demo.java.springboot.brokershop.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.entities.Category;
import org.tyaa.demo.java.springboot.brokershop.entities.Product;
import org.tyaa.demo.java.springboot.brokershop.models.CategoryModel;
import org.tyaa.demo.java.springboot.brokershop.models.ProductFilterModel;
import org.tyaa.demo.java.springboot.brokershop.models.ProductModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.CategoryDao;
import org.tyaa.demo.java.springboot.brokershop.repositories.ProductDao;
import org.tyaa.demo.java.springboot.brokershop.services.interfaces.IProductService;

import javax.transaction.Transactional;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService implements IProductService {

    private final ProductDao productDao;

    private final CategoryDao categoryDao;

    public ProductService(ProductDao productDao, CategoryDao categoryDao) {
        this.productDao = productDao;
        this.categoryDao = categoryDao;
    }

    public ResponseModel create(ProductModel productModel) {
        Optional<Category> categoryOptional
                = categoryDao.findById(productModel.getCategoryId());
        if(categoryOptional.isPresent()){
            Product product =
                Product.builder()
                    .name(productModel.getTitle())
                    .description(productModel.getDescription())
                    .price(productModel.getPrice())
                    .quantity(productModel.getQuantity())
                    .image(productModel.getImage())
                    .category(categoryOptional.get())
                    .build();
            productDao.save(product);
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Product %s Created", product.getName()))
                    .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Category #%d Not Found", productModel.getCategoryId()))
                .build();
        }
    }

    public ResponseModel update(ProductModel productModel) {
        Optional<Category> categoryOptional
                = categoryDao.findById(productModel.getCategoryId());
        if(categoryOptional.isPresent()){
            Product product =
                Product.builder()
                    .id(productModel.getId())
                    .name(productModel.getTitle())
                    .description(productModel.getDescription())
                    .price(productModel.getPrice())
                    .quantity(productModel.getQuantity())
                    .category(categoryOptional.get())
                    .image(productModel.getImage())
                    .build();
            productDao.save(product);
            // Demo Logging
            System.out.println(String.format("Category %s Updated", product.getName()));
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Product %s Updated", product.getName()))
                    .build();
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("Category #%d Not Found", productModel.getCategoryId()))
                    .build();
        }
    }

    public ResponseModel getAll() {
        List<Product> products = productDao.findAll(Sort.by("id").descending());
        List<ProductModel> productModels =
            products.stream()
                .map(p ->
                    ProductModel.builder()
                        .id(p.getId())
                        .title(p.getName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .quantity(p.getQuantity())
                        .image(p.getImage())
                        .category(
                            CategoryModel.builder()
                                .id(p.getCategory().getId())
                                .name(p.getCategory().getName())
                                .build()
                        )
                        .build()
                )
                .collect(Collectors.toList());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(productModels)
                .build();
    }

    public ResponseModel delete(Long id) {
        Optional<Product> productOptional = productDao.findById(id);
        if (productOptional.isPresent()){
            Product product = productOptional.get();
            productDao.delete(product);
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Product #%s Deleted", product.getName()))
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Product #%d Not Found", id))
                .build();
        }
    }

    public ResponseModel getProductsPriceBounds() {
        Map<String, Integer> maxAndMin = new LinkedHashMap<>();
        maxAndMin.put("min", productDao.findMinimum().intValue());
        maxAndMin.put("max", productDao.findTop1ByOrderByPriceDesc().getPrice().intValue());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(maxAndMin)
                .build();
    }

    public ResponseModel getProductsQuantityBounds() {
        Map<String, Integer> maxAndMin = new LinkedHashMap<>();
        maxAndMin.put("min", productDao.findTop1ByOrderByQuantityAsc().getQuantity());
        maxAndMin.put("max", productDao.findTop1ByOrderByQuantityDesc().getQuantity());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(maxAndMin)
                .build();
    }

    public ResponseModel getFiltered(ProductFilterModel filter) {
        List<Product> products =
                productDao.findByCategoryIds(
                        filter.categories,
                        Sort.by(filter.sortingDirection, filter.orderBy)
                );
        return getResponseModelFromEntities(products);
    }

    private ResponseModel getResponseModelFromEntities(List<Product> products) {
        List<ProductModel> productModels =
            products.stream()
                .map((p)->
                    ProductModel.builder()
                        .id(p.getId())
                        .title(p.getName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .quantity(p.getQuantity())
                        .image(p.getImage())
                        .category(
                            CategoryModel.builder()
                                .id(p.getCategory().getId())
                                .name(p.getCategory().getName())
                                .build()
                        )
                        .build()
                )
                .collect(Collectors.toList());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(productModels)
                .build();
    }
}
