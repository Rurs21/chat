package com.inf5190.chat.auth.session;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Repository;

/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();

    public String addSession(SessionData authData) {
        final String token = this.generateToken();
        this.sessions.put(token, authData);
        return token;
    }

    public void removeSession(String token) {
        this.sessions.remove(token);
    }

    public SessionData getSession(String token) {
        return this.sessions.get(token);
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

}
