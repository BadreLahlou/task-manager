package com.badrelahlou.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain; 

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                .requestMatchers("/api/users/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/tasks/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_PROJECT_MANAGER", "ROLE_TEAM_LEADER", "ROLE_TEAM_MEMBER")
                .requestMatchers("/api/reports/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_PROJECT_MANAGER", "ROLE_TEAM_LEADER", "ROLE_EXTERNAL_VIEWER")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
            .formLogin(form -> form.disable()) 
            .httpBasic(Customizer.withDefaults()); 

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
