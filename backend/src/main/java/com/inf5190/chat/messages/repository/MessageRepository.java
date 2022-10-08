package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.inf5190.chat.messages.model.Message;

import org.springframework.stereotype.Repository;

/**
 * Classe qui gère la persistence des messages.
 * 
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private final List<Message> messages = new ArrayList<Message>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Message> getMessages(Optional<Long> fromId) {
        return this.messages;
    }

    public Message createMessage(Message message) {
        this.messages.add(message);
        return message;
    }

}
