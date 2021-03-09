package org.tyaa.demo.java.springboot.brokershop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tyaa.demo.java.springboot.brokershop.AuthService;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/roles")
    public List<RoleModel> getRoles () {
        return authService.getRoles();
    }
}
