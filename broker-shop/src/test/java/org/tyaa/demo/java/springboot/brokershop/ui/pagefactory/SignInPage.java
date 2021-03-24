package org.tyaa.demo.java.springboot.brokershop.ui.pagefactory;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class SignInPage extends AbstractPage {

    private By loginField = By.id("username");
    private By passwordField = By.id("password");
    private By signInButton = By.cssSelector("#signInButton");
    private By errorBlock = By.cssSelector("#errorBlock");

    public SignInPage(WebDriver driver) {
        super(driver);
        System.out.println("SignInPage Loaded");
    }

    // симуляция ввода пользователем имени в форму входа
    public SignInPage typeUserName(String userName) {
        driver.findElement(loginField).sendKeys(userName);
        return this;
    }

    // симуляция ввода пользователем пароля в форму входа
    public SignInPage typePassword(String password) {
        driver.findElement(passwordField).sendKeys(password);
        return this;
    }

    // ввод имени и пароля,
    // и затем - симуляция клика пользователя по кнопке отправки формы входа
    // (для неверных учетных данных)
    public SignInPage loginWithInvalidCredentials(String userName, String password) {
        this.typeUserName(userName);
        this.typePassword(password);
        driver.findElement(signInButton).click();
        return new SignInPage(driver);
    }

    // ввод имени и пароля,
    // и затем - симуляция клика пользователя по кнопке отправки формы входа
    // (для верных учетных данных)
    public HomePage loginWithValidCredentials(String userName, String password) {
        this.typeUserName(userName);
        this.typePassword(password);
        driver.findElement(signInButton).click();
        return new HomePage(driver);
    }

    // попытка предоставления текста из модального окна
    // отображения ошибок
    public String getErrorText() {
        List<WebElement> errorBlockElements = driver.findElements(errorBlock);
        System.out.println(errorBlockElements);
        return !errorBlockElements.isEmpty() ? errorBlockElements.get(0).getText() : null;
    }
}
