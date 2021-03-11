package org.tyaa.demo.java.springboot.brokershop.services.interfaces;

import org.springframework.security.core.Authentication;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;
import org.tyaa.demo.java.springboot.brokershop.models.UserModel;

import java.util.List;

public interface IAuthService {
    ResponseModel getRoles();
    ResponseModel createRole(RoleModel roleModel);
    ResponseModel getRoleUsers(Long roleId);
    ResponseModel createUser(UserModel userModel);
    ResponseModel deleteUser(Long id);
    ResponseModel makeUserAdmin(Long id) throws Exception;
    ResponseModel check(Authentication authentication);
    ResponseModel onSignOut();
    ResponseModel onError();
}
