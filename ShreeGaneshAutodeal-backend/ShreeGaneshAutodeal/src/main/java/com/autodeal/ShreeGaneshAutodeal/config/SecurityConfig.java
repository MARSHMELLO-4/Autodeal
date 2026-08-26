package com.autodeal.ShreeGaneshAutodeal.config;

import com.autodeal.ShreeGaneshAutodeal.security.AdminApiKeyFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AdminApiKeyFilter adminApiKeyFilter)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/catalog/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/**"
                        ).authenticated()

                        .anyRequest().permitAll()
                )

                .addFilterBefore(
                        adminApiKeyFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
