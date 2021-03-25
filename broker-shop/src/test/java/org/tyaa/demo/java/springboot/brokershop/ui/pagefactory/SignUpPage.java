package org.tyaa.demo.java.springboot.brokershop.ui.pagefactory;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class SignUpPage extends AbstractPage {

    private By loginField = By.id("username");
    private By passwordField = By.id("password");
    private By signUpButton = By.cssSelector("#signUpButton");
    private By errorBlock = By.cssSelector("#errorBlock");

    public SignUpPage(WebDriver driver) {
        super(driver);
        System.out.println("SignUpPage Loaded");
    }

    // симуляция ввода пользователем имени в форму входа
    public SignUpPage typeUserName(String userName) {
        driver.findElement(loginField).sendKeys(userName);
        return this;
    }

    // симуляция ввода пользователем пароля в форму входа
    public SignUpPage typePassword(String password) {
        driver.findElement(passwordField).sendKeys(password);
        return this;
    }

    // ввод имени и пароля,
    // и затем - симуляция клика пользователя по кнопке отправки формы регистрации
    // (для неверных учетных данных)
    public SignUpPage signUpWithUniqueNameConstraintViolation(String userName, String password) {
        this.typeUserName(userName);
        this.typePassword(password);
        driver.findElement(signUpButton).click();
        return new SignUpPage(driver);
    }

    // ввод имени и пароля,
    // и затем - симуляция клика пользователя по кнопке отправки формы регистрации
    // (для верных учетных данных)
    public HomePage signUpWithValidCredentials(String userName, String password) {
        this.typeUserName(userName);
        this.typePassword(password);
        driver.findElement(signUpButton).click();
        return new HomePage(driver);
    }

    // попытка предоставления текста из модального окна
    // отображения ошибок
    public String getErrorText() {
        List<WebElement> errorBlockElements = driver.findElements(errorBlock);
        return !errorBlockElements.isEmpty() ? errorBlockElements.get(0).getText() : null;
    }
}
