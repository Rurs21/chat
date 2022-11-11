package com.inf5190.chat.messages;

import com.google.cloud.Timestamp;
import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.FirestoreMessage;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

import javax.servlet.ServletContext;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.ServletContextAware;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

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

    @GetMapping(ROOT_PATH)
    public List<Message> getMessages(@RequestParam Optional<String> fromId) throws ExecutionException, InterruptedException {
        return messageRepository.getMessages(fromId);
    }

    @PostMapping(ROOT_PATH)
    public void createMessage(@RequestBody Message createMessageRequest) throws ExecutionException, InterruptedException {
        FirestoreMessage newMessage = new FirestoreMessage(createMessageRequest.username(), Timestamp.now(), createMessageRequest.text());
        messageRepository.createMessage(newMessage);
        webSocketManager.notifySessions();
    }

    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }
}
