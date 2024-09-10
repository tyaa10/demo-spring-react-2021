package org.tyaa.demo.java.springboot.brokershop.junit.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.tyaa.demo.java.springboot.brokershop.entities.Product;
import org.tyaa.demo.java.springboot.brokershop.entities.User;
import org.tyaa.demo.java.springboot.brokershop.models.Cart;
import org.tyaa.demo.java.springboot.brokershop.models.CartItem;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.CartMongoDao;
import org.tyaa.demo.java.springboot.brokershop.repositories.ProductDao;
import org.tyaa.demo.java.springboot.brokershop.repositories.UserDao;
import org.tyaa.demo.java.springboot.brokershop.services.CartService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private ProductDao productDao;

    @Mock
    private UserDao userDao;

    @Mock
    private CartMongoDao cartMongoDao;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCartTest() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userDao.findUserByName(any())).thenReturn(new User());
        when(cartMongoDao.findCartByUserId(any())).thenReturn(new Cart());
        Cart cart = cartService.getCart(authentication);
        assertEquals(cart.getClass(), Cart.class);
        assertEquals(cart.getCartItems().size(), 0);
        assertEquals(cart.getId() , null);
    }

    @Test
    void getCartItemsTest() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userDao.findUserByName(any())).thenReturn(new User());
        when(cartMongoDao.findCartByUserId(any())).thenReturn(new Cart());
        ResponseModel responseModel = cartService.getCartItems(authentication);
        assertEquals(responseModel.getStatus(), ResponseModel.SUCCESS_STATUS);
    }

    @Test
    void changeCartItemCountTest() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userDao.findUserByName(any())).thenReturn(new User());
        when(cartMongoDao.findCartByUserId(any())).thenReturn(new Cart());
        when(productDao.findById(any())).thenReturn(Optional.of(new Product()));
        ResponseModel responseModel = cartService.changeCartItemCount(authentication, 1L, CartItem.Action.ADD);
        assertEquals(responseModel.getStatus(), ResponseModel.SUCCESS_STATUS);
    }

    @Test
    void clearCartItemsTest() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userDao.findUserByName(any())).thenReturn(new User());
        when(cartMongoDao.findCartByUserId(any())).thenReturn(new Cart());
        cartService.clearCartItems(authentication);
    }
}
