package com.inf5190.chat.auth.session;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Repository;

import javax.crypto.SecretKey;

/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();
    private static final String SECRET_KEY_BASE64 = "ZUUuPDo1zw1K9dCBuU+VetaGi3VhfmJE9y15NTaWWjs=";
    private final SecretKey secretKey;
    private final JwtParser jwtParser;

    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parserBuilder().setSigningKey(this.secretKey).build();
    }

    public String addSession(SessionData authData) {
        final String token = this.generateToken(authData.username());
        this.sessions.put(token, authData);
        return token;
    }

    public void removeSession(String token) {
        this.sessions.remove(token);
    }

    public SessionData getSession(String token) {
        try {
            Jws<Claims> jws = jwtParser.parseClaimsJws(token);
            return this.sessions.get(token);
        } catch (JwtException ex) {
            return null;
        }
    }

    private String generateToken(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(7200);

        return Jwts.builder()
                //.setAudience("localhost")
                .setIssuedAt(new Date(now.toEpochMilli()))
                .setSubject(username)
                .setExpiration(new Date(expiration.toEpochMilli()))
                .signWith(this.secretKey)
                .compact();
    }

}
