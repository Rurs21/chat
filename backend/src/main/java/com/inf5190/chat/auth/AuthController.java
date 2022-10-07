package com.inf5190.chat.auth;

import javax.servlet.ServletContext;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.ServletContextAware;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.auth.session.SessionManager;

/**
 * Contrôleur qui gère l'API de login et logout.
 * 
 * Implémente ServletContextAware pour recevoir le contexte de la requête HTTP.
 */
@RestController()
public class AuthController implements ServletContextAware {

    private final SessionManager sessionManager;
    private final SessionDataAccessor sessionDataAccessor;
    private ServletContext servletContext;

    public AuthController(SessionManager sessionManager, SessionDataAccessor sessionDataAccessor) {
        this.sessionManager = sessionManager;
        this.sessionDataAccessor = sessionDataAccessor;
    }

    @PostMapping("auth/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        // À faire...
        return null;
    }

    @PostMapping("auth/logout")
    public void logout() {
        // À faire...
        return;
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }
}
