package com.autodeal.ShreeGaneshAutodeal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

@Component
public class AdminApiKeyFilter extends OncePerRequestFilter {

    @Value("${admin.api-key}")
    private String adminApiKey;

    private boolean isValidKey(String providedKey) {

        if (providedKey == null) {
            return false;
        }

        return MessageDigest.isEqual(
                providedKey.getBytes(StandardCharsets.UTF_8),
                adminApiKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (!path.startsWith("/api/admin/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedKey =
                request.getHeader("X-ADMIN-KEY");

        if (!isValidKey(providedKey)) {
            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
            return;
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        "admin",
                        null,
                        List.of(
                                new SimpleGrantedAuthority("ROLE_ADMIN")
                        )
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
