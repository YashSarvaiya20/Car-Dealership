package com.incubyte.dealership.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.dealership.dto.request.LoginRequest;
import com.incubyte.dealership.dto.request.RegisterRequest;
import com.incubyte.dealership.dto.response.LoginResponse;
import com.incubyte.dealership.dto.response.UserResponse;
import com.incubyte.dealership.entity.Role;
import com.incubyte.dealership.exception.DuplicateEmailException;
import org.springframework.security.authentication.BadCredentialsException;
import com.incubyte.dealership.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {
        MongoAutoConfiguration.class,
        MongoDataAutoConfiguration.class,
        MongoRepositoriesAutoConfiguration.class
})
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @WithMockUser
    void register_ShouldReturnCreated_WhenPayloadIsValid() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        UserResponse response = UserResponse.builder()
                .id("1")
                .name("John Doe")
                .email("john@example.com")
                .role(Role.USER)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @WithMockUser
    void register_ShouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("invalid-email")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details[0]").value("Invalid email format"));
    }

    @Test
    @WithMockUser
    void register_ShouldReturnConflict_WhenEmailAlreadyExists() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new DuplicateEmailException("Email already exists"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    @WithMockUser
    void login_ShouldReturnOk_WhenCredentialsAreValid() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        LoginResponse response = LoginResponse.builder()
                .token("mock-jwt-token")
                .email("john@example.com")
                .role(Role.USER)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @WithMockUser
    void login_ShouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("invalid-email")
                .password("password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details[0]").value("Invalid email format"));
    }

    @Test
    @WithMockUser
    void login_ShouldReturnUnauthorized_WhenCredentialsAreWrong() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("wrongpassword")
                .build();

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
