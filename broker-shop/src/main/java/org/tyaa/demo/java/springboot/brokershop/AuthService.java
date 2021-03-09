package org.tyaa.demo.java.springboot.brokershop;

import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.RoleDao;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final RoleDao roleDao;

    public AuthService(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    public List<RoleModel> getRoles () {
        return roleDao.findAll()
                .stream().map(
                        roleEntity -> RoleModel.builder()
                                .id(roleEntity.getId())
                                .name(roleEntity.getName())
                                .build()

                ).collect(Collectors.toList());
    }
}
