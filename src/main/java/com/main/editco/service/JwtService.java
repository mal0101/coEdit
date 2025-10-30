package com.main.editco.service;

import com.main.editco.dao.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private Long expirationMs;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }
    public boolean validateToken(String token, User user) {
        String email = extractEmail(token);
        return (user.getEmail().equals(email) && !isExpired(token));
    }
    private boolean isExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
    private Claims getClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }
}
