package com.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    
    public static AuthResponse of(String token, Long userId, String email, 
                                   String firstName, String lastName) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(userId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .fullName(firstName + " " + lastName)
                .build();
    }
}
