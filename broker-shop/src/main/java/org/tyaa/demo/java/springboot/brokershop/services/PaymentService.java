package org.tyaa.demo.java.springboot.brokershop.services;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.BrokerShopApplication;
import org.tyaa.demo.java.springboot.brokershop.messaging.EventDispatcher;
import org.tyaa.demo.java.springboot.brokershop.messaging.OrderCompletedEvent;
import org.tyaa.demo.java.springboot.brokershop.models.Cart;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    private EventDispatcher eventDispatcher;
    private APIContext apiContext;

    /* public PaymentService(EventDispatcher eventDispatcher, APIContext apiContext) {
        this.eventDispatcher = eventDispatcher;
        this.apiContext = apiContext;
    } */

    /* @Autowired
    public APIContext apiContext; */

    // public APIContext apiContext;

    /* @PostConstruct
    private void postConstruct () {
        apiContext =
            BrokerShopApplication.applicationContext.getBean("apiContext", APIContext.class);
    } */

    /** Создание объекта платежа и отправка запроса на агрегатор
     * для получения его веб-фронтенда */
    @Transactional
    public Payment createPayment(
            Cart cart,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        // установка названия валюты
        amount.setCurrency(currency);
        // установка полной суммы платежа в формате строки с двумя знаками после запаятой
        final Double totalPrice =
                BigDecimal.valueOf(
                        cart.getCartItems().stream()
                                .map(cartItem -> cartItem.getPrice().doubleValue() * cartItem.getQuantity())
                                .reduce(0d, (previousValue, currentValue) -> previousValue + currentValue)
                ).setScale(2, RoundingMode.HALF_UP).doubleValue();
        amount.setTotal(String.format("%.2f", totalPrice));
        // сбор данных о сумме, валюте и комментарии платежа в модель транзакции
        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        // формирование списка транзакций
        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);
        // модель плательщика с установкой режима платежа
        Payer payer = new Payer();
        payer.setPaymentMethod(method);
        // модель платежа включает все выше подготовленные настройки
        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);
        // открытие транзакции платежа и получение в синхронном режиме
        // веб-фронтенда агрегатора
        // System.out.println(BrokerShopApplication.applicationContext);
        // System.out.println(BrokerShopApplication.applicationContext.getBean("apiContext", APIContext.class));
        apiContext =
            BrokerShopApplication.applicationContext.getBean("apiContext", APIContext.class);
        return payment.create(apiContext);
    }

    /** Реакция на получение ответа и перенаправления от агрегатора
     * - второй запрос с просьбой закрыть транзакцию */
    @Transactional
    public ResponseModel executePayment(String paymentId, String payerId, Cart cart) throws PayPalRESTException{
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);
        apiContext =
                BrokerShopApplication.applicationContext.getBean("apiContext", APIContext.class);
        payment = payment.execute(apiContext, paymentExecute);
        if (payment.getState().equals("approved")) {
            eventDispatcher =
                    BrokerShopApplication.applicationContext.getBean("eventDispatcher", EventDispatcher.class);
            // отправка асинхронного сообщения об оплаченном заказе
            // в очередь RabbitMQ для микросервиса broker
            eventDispatcher.send(
                    OrderCompletedEvent.builder()
                            .orderId(paymentId)
                            .cart(cart)
                            .build()
            );
            return ResponseModel.builder()
                    .status("success")
                    .message("Payment successful with id: " + payment.getId())
                    .build();
        } else {
            return ResponseModel.builder()
                    .status("fail")
                    .message("Payment fail with message: " + payment.getFailureReason())
                    .build();
        }
    }
}
