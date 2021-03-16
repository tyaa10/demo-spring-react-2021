package org.tyaa.demo.java.springboot.brokershop.application.requests.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.tyaa.demo.java.springboot.brokershop.BrokerShopApplication;
import org.tyaa.demo.java.springboot.brokershop.models.CategoryModel;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

// включение режима теста приложения с запуском на реальном веб-сервере
// и с доступом к контексту приложения
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = BrokerShopApplication.class
)
// режим создания одиночного экземпляра класса тестов для всех кейсов
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
// активация контейнера выполнения кейсов согласно пользовательской нумерации
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CategoryControllerTest {

    // внедрение зависимости готового веб-клиента для тестовых запросов
    @Autowired
    private TestRestTemplate testRestTemplate;

    final String BASE_URL = "/api";

    @Order(1)
    @Test
    public void givenCategoriesUriWhenRequestThenResponseModelWithCategoriesList () {
        // http get запрос от тестового веб-клиента на REST-API
        // с ожиданием получения JSON Body со структурой ResponseModel
        ResponseEntity<ResponseModel> response =
            testRestTemplate.getForEntity(
                BASE_URL + "/categories",
                ResponseModel.class
            );
        // проверка, что http-ответ на запрос вернул статус-код 200
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // проверка, что из тела отклика серверного приложения
        // можно извлечь данные - список всех категорий товаров
        ArrayList categories =
                (ArrayList) response.getBody().getData();
        // проверку, что в поле данных модели отклика сервера содержится
        // какой-то список, возможно, пустой
        assertNotNull(categories);
        // в списке должно быть три объекта типа Категория
        assertEquals(3, categories.size());
        // сложный тестовый веб-клиент testRestTemplate десериализует множество данных моделей
        // как список словарей, поэтому нужно явное преобразование в список моделей CategoryModel
        List<CategoryModel> categoryModels =
            (new ObjectMapper())
                .convertValue(categories, new TypeReference<>() { });
        // среди моделей категорий должны быть только такие, у которых
        // название равно либо stock, crypto, e-money
        categoryModels.forEach(category -> {
            if (!(category.getName().equals("stock")
                    || category.getName().equals("crypto")
                    || category.getName().equals("e-money"))
            ) {
                fail(String.format("Expected stock or crypto or e-money but got %s", category.getName()));
            }
        });
    }
}
