package com.inf5190.chat.auth;

import javax.servlet.ServletContext;

import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.ServletContextAware;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.auth.session.SessionManager;

import java.util.concurrent.ExecutionException;

/**
 * Contrôleur qui gère l'API de login et logout.
 * 
 * Implémente ServletContextAware pour recevoir le contexte de la requête HTTP.
 */
@RestController()
public class AuthController implements ServletContextAware {

    private UserAccountRepository userAccountRepository;
    private final SessionManager sessionManager;
    private final SessionDataAccessor sessionDataAccessor;
    private ServletContext servletContext;

    public AuthController(UserAccountRepository userAccountRepository, SessionManager sessionManager, SessionDataAccessor sessionDataAccessor) {
        this.userAccountRepository = userAccountRepository;
        this.sessionManager = sessionManager;
        this.sessionDataAccessor = sessionDataAccessor;
    }

    @PostMapping("auth/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) throws ExecutionException, InterruptedException {
        FirestoreUserAccount user = userAccountRepository.getUserAccount(loginRequest.username());
        if (user == null) {
            FirestoreUserAccount newUser = new FirestoreUserAccount(loginRequest.username(), loginRequest.password());
            userAccountRepository.setUserAccount(newUser);
        }

        SessionData userSession = new SessionData(loginRequest.username());
        String token = this.sessionManager.addSession(userSession);
        return new LoginResponse(token);
    }

    @PostMapping("auth/logout")
    public void logout() {
        String token = this.sessionDataAccessor.getToken(this.servletContext);
        this.sessionManager.removeSession(token);
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }
}
