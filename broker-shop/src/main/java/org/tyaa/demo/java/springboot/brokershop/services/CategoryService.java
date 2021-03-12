package org.tyaa.demo.java.springboot.brokershop.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.entities.Category;
import org.tyaa.demo.java.springboot.brokershop.models.CategoryModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.CategoryDao;
import org.tyaa.demo.java.springboot.brokershop.services.interfaces.ICategoryService;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService implements ICategoryService {

    private final CategoryDao categoryDao;

    // private final ProductDao productDao;

    public CategoryService(CategoryDao categoryDao/* , ProductDao productDao */) {
        this.categoryDao = categoryDao;
        // this.productDao = productDao;
    }

    // создать новую категорию на основе полученной модели
    public ResponseModel create(CategoryModel categoryModel) {
        // преобразование из модели в сущность
        Category category =
            Category.builder().name(categoryModel.getName().trim()).build();
        // вызов метода сохранения сущности экземпляром репозитория
        categoryDao.save(category);
        // Demo Logging
        System.out.println(String.format("Category %s Created", category.getName()));
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("Category %s Created", category.getName()))
            .build();
    }

    public ResponseModel update(CategoryModel categoryModel) {
        Category category =
            Category.builder()
                .id(categoryModel.getId())
                .name(categoryModel.getName())
                .build();
        categoryDao.save(category);
        // Demo Logging
        System.out.println(String.format("Category %s Updated", category.getName()));
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Category %s Updated", category.getName()))
                .build();
    }

    public ResponseModel getAll() {
        List<Category> categories = categoryDao.findAll(Sort.by("id").descending());
        List<CategoryModel> categoryModels =
            categories.stream()
            .map(c ->
                CategoryModel.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .build()
            )
            .collect(Collectors.toList());
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .data(categoryModels)
            .build();
    }

    public ResponseModel delete(Long id) {
        Optional<Category> categoryOptional = categoryDao.findById(id);
        if (categoryOptional.isPresent()){
            Category category = categoryOptional.get();
            // System.out.println(productDao.countProductsByCategory(category) == 0);
            // if(productDao.countProductsByCategory(category) == 0) {
                categoryDao.delete(category);
                return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Category #%s Deleted", category.getName()))
                    .build();
            /* } else {
                return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("Can't delete the category #%s. There are some products in this category.", category.getName()))
                    .build();
            } */
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Category #%d Not Found", id))
                .build();
        }
    }
}
