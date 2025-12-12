package com.taskmanager.config;

import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Create demo user if not exists
            if (!userRepository.existsByEmail("demo@taskmanager.com")) {
                User demoUser = User.builder()
                        .firstName("Demo")
                        .lastName("User")
                        .email("demo@taskmanager.com")
                        .password(passwordEncoder.encode("demo123"))
                        .role(Role.USER)
                        .build();
                userRepository.save(demoUser);
                log.info("Demo user created: demo@taskmanager.com / demo123");
            }
            
            // Create admin user if not exists
            if (!userRepository.existsByEmail("admin@taskmanager.com")) {
                User adminUser = User.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@taskmanager.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(adminUser);
                log.info("Admin user created: admin@taskmanager.com / admin123");
            }
        };
    }
}
