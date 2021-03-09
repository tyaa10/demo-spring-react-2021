package org.tyaa.demo.java.springboot.brokershop.services;

import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.RoleDao;
import org.tyaa.demo.java.springboot.brokershop.services.interfaces.IAuthService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService implements IAuthService {

    private final RoleDao roleDao;

    public AuthService(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public ResponseModel getRoles() {
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message("All the roles fetched successfully")
                .data(
                        roleDao.findAll()
                                .stream().map(
                                roleEntity -> RoleModel.builder()
                                        .id(roleEntity.getId())
                                        .name(roleEntity.getName())
                                        .build()

                        ).collect(Collectors.toList())
                )
                .build();
    }
}
