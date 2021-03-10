package org.tyaa.demo.java.springboot.brokershop.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;
import org.tyaa.demo.java.springboot.brokershop.services.interfaces.IAuthService;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/roles")
    public ResponseEntity<ResponseModel> getRoles () {
        ResponseModel responseModel = authService.getRoles();
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.OK;
        } else {
            httpStatus = HttpStatus.BAD_GATEWAY;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }

    @PostMapping("/roles")
    public ResponseEntity<ResponseModel> createRole (@RequestBody RoleModel roleModel) {
        ResponseModel responseModel = authService.createRole(roleModel);
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.CREATED;
        } else if (responseModel.getMessage().equals("This name is already taken")) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.BAD_GATEWAY;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }
}
