package org.tyaa.demo.java.springboot.brokershop.ui;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.tyaa.demo.java.springboot.brokershop.ui.pagefactory.IndexPage;

import java.util.concurrent.TimeUnit;

public abstract class AbstractPageTest {

    protected static WebDriver driver;
    protected IndexPage indexPage;

    @BeforeAll
    private static void setupAll() {
        // обращение к JVM: установить значение свойства webdriver.gecko.driver
        // в driver/geckodriver
        System.setProperty("webdriver.gecko.driver", "driver/geckodriver");
    }

    @BeforeEach
    private void setupEach() {
        // запускаем браузер
        driver = new FirefoxDriver();
        // устанавливаем глобальную настройку ожидания:
        // всегда после выполнения действий с представлением ожидать 5 секунд,
        // и если последствия действий еще не проявились на странице - ждать дополнительно
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        // развернуть окно браузера на весь экран
        driver.manage().window().maximize();
        // выполнить http-get запрос в браузере по указанному адресу
        driver.get("http://localhost:3000/shop/");
        indexPage = new IndexPage(driver);
    }

    @AfterEach
    private void disposeEach() {
        // после окончания каждого тест-кейса закрывать браузер
        driver.quit();
    }
}
