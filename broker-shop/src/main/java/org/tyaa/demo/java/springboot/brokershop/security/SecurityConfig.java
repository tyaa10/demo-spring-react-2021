package org.tyaa.demo.java.springboot.brokershop.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@Order(1)
public class SecurityConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer {

    private final HibernateWebAuthProvider authProvider;

    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    private final SavedReqAwareAuthSuccessHandler savedReqAwareAuthSuccessHandler;

    public SecurityConfig(HibernateWebAuthProvider authProvider, RestAuthenticationEntryPoint restAuthenticationEntryPoint, SavedReqAwareAuthSuccessHandler savedReqAwareAuthSuccessHandler) {
        this.authProvider = authProvider;
        this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
        this.savedReqAwareAuthSuccessHandler = savedReqAwareAuthSuccessHandler;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // отключение проверки токена csrf в связи с тем,
        // что веб-запросы отправлются не из веб-страниц в формами,
        // а кодом ajax на языке javascript
        http.csrf().disable()
            .cors()
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(restAuthenticationEntryPoint)
            .and()
            // раздел отображений: адрес запроса -> настройки доступа
            .authorizeRequests()
            // разрешить всем
            .antMatchers(HttpMethod.GET, "/api/auth/users/**").permitAll()
            // разрешить всем
            .antMatchers(HttpMethod.POST, "/api/auth/users/**").permitAll()
            // разрешить только аутентифицированным пользователям с любой ролью
            .antMatchers(HttpMethod.DELETE, "/api/auth/users/**").authenticated()
                .antMatchers("/api/auth/roles").permitAll()
            .antMatchers(HttpMethod.GET, "/api/auth/role/**").permitAll()
            .antMatchers("/api/cart/**").authenticated()
            // настройки доступов по шаблонам адресов к группам веб-страниц:
            // разделяемой (общие веб-страницы) и административной (веб-страницы только для администраторов)
            .antMatchers("/shared/**").permitAll()
            // только для пользователей с ролью ROLE_ADMIN
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/api/**/admin/**").hasRole("ADMIN")
            .and()
            // раздел настройки ответов после попытки авторизации
            .formLogin()
            .successHandler(savedReqAwareAuthSuccessHandler)
            .failureUrl("/api/auth/users/onerror")
            // установка пользовательского URI, на который должен обратиться клиент
            // для попытки входа в учетную запись -
            // не производится, потому что в Spring Security
            // предустановлен URI /login,
            // на который необходимо отправлять POST-запрос с телом
            // в формате x-www-form-urlencoded,
            // держащим два строковых параметра:
            // username и password
            .and()
            // раздел настройки выхода из учетной записи
            .logout()
            // умолчание: очищать объект аутентификации после выхода из учетной записи
            .clearAuthentication(true)
            // установка пользовательского URI, на который должен обратиться клиент
            // для выхода из учетной записи
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            // адрес перенаправления на бэкенде в случае успешного выхода из учетной записи
            .logoutSuccessUrl("/api/auth/users/signedout");

        // Auth demo
        // 1. /login (POST)
        //username=user2&password=2 - admin
        //username=user1&password=1 - user
        // 2. /shared/pages/testpublic.html (GET)
        // 3. /admin/pages/testadmin.html (GET)
        // 4. /api/user (GET)
        // 5. /api/role (GET)
        // 6. /logout (GET)
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // разрешаем обращаться к любым адресам
                .allowedOrigins("http://localhost:3000") // клиентам, полученным с указанного адреса
                .allowedMethods("*") // все методы http-запросов разрешены
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(8600);
    }
}
