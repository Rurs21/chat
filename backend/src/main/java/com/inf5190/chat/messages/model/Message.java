package com.inf5190.chat.messages.model;

/**
 * Représente un message.
 */
public record Message(Long id, String username, Long timestamp, String text) {
    public Message withId(Long id) {
        return new Message(id, username(), timestamp(), text());
    }
}
