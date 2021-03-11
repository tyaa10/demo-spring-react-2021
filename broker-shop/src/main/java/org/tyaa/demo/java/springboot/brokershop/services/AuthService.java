package org.tyaa.demo.java.springboot.brokershop.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.tyaa.demo.java.springboot.brokershop.entities.Role;
import org.tyaa.demo.java.springboot.brokershop.entities.User;
import org.tyaa.demo.java.springboot.brokershop.models.ResponseModel;
import org.tyaa.demo.java.springboot.brokershop.models.RoleModel;
import org.tyaa.demo.java.springboot.brokershop.models.UserModel;
import org.tyaa.demo.java.springboot.brokershop.repositories.RoleDao;
import org.tyaa.demo.java.springboot.brokershop.repositories.UserDao;
import org.tyaa.demo.java.springboot.brokershop.services.interfaces.IAuthService;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService implements IAuthService {

    private final RoleDao roleDao;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public AuthService(RoleDao roleDao, UserDao userDao, PasswordEncoder passwordEncoder) {
        this.roleDao = roleDao;
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
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

    @Override
    public ResponseModel createRole(RoleModel roleModel) {
        roleDao.save(Role.builder().name(roleModel.name).build());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Role %s created", roleModel.name))
                .build();
    }

    @Override
    public ResponseModel createUser(UserModel userModel) {
        User user =
                User.builder()
                        .name(userModel.getName().trim())
                        .password(passwordEncoder.encode(userModel.getPassword()))
                        .role(roleDao.findRoleByName("ROLE_USER"))
                        .build();
        userDao.save(user);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("User %s created", user.getName()))
                .build();
    }

    @Override
    @Transactional
    public ResponseModel getRoleUsers(Long roleId) {
        Optional<Role> roleOptional = roleDao.findById(roleId);
        if (roleOptional.isPresent()) {
            Role role = roleOptional.get();
            List<UserModel> userModels =
                    role.getUsers().stream().map(user ->
                            UserModel.builder()
                                    .name(user.getName())
                                    .roleId(user.getRole().getId())
                                    .build()
                    )
                            .collect(Collectors.toList());
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("List of %s Role Users Retrieved Successfully", role.getName()))
                    .data(userModels)
                    .build();
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("No Users: Role #%d Not Found", roleId))
                    .build();
        }
    }

    public ResponseModel deleteUser(Long id) {
        userDao.deleteById(id);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("User #%d Deleted", id))
                .build();
    }

    public ResponseModel makeUserAdmin(Long id) throws Exception {
        // Получаем из БД объект роли администратора
        Role role = roleDao.findRoleByName("ROLE_ADMIN");
        Optional<User> userOptional = userDao.findById(id);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setRole(role);
            userDao.save(user);
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Admin %s created successfully", user.getName()))
                    .build();
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("User #%d Not Found", id))
                    .build();
        }
    }

    // получение подтверждения, что клиент
    // сейчас аутентифицирован,
    // и возврат информации об учетной записи
    public ResponseModel check(Authentication authentication) {
        ResponseModel response = new ResponseModel();
        // если пользователь из текущего http-сеанса аутентифицирован
        if (authentication != null && authentication.isAuthenticated()) {
            UserModel userModel = UserModel.builder()
                    .name(authentication.getName())
                    .roleName(
                            authentication.getAuthorities().stream()
                                    .findFirst()
                                    .get()
                                    .getAuthority()
                    )
                    .build();
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage(String.format("User %s Signed In", userModel.name));
            response.setData(userModel);
        } else {
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage("User is a Guest");
        }
        return response;
    }

    public ResponseModel onSignOut() {
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message("Signed out")
                .build();
    }

    public ResponseModel onError() {
        return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message("Auth error")
                .build();
    }
}
