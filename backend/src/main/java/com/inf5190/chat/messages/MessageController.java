package com.inf5190.chat.messages;

import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

import javax.servlet.ServletContext;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.ServletContextAware;

/**
 * Contrôleur qui gère l'API de messages.
 * 
 * Implémente ServletContextAware pour recevoir le contexte de la requête HTTP.
 */
@RestController
public class MessageController implements ServletContextAware {
    public static final String ROOT_PATH = "/messages";

    private MessageRepository messageRepository;
    private WebSocketManager webSocketManager;
    private ServletContext servletContext;
    private SessionDataAccessor sessionDataAccessor;

    public MessageController(MessageRepository messageRepository,
            WebSocketManager webSocketManager,
            SessionDataAccessor sessionDataAccessor) {
        this.messageRepository = messageRepository;
        this.webSocketManager = webSocketManager;
        this.sessionDataAccessor = sessionDataAccessor;
    }

    // À faire...

    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }
}
