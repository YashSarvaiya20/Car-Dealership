package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.request.LoginRequest;
import com.incubyte.dealership.dto.request.RegisterRequest;
import com.incubyte.dealership.dto.response.LoginResponse;
import com.incubyte.dealership.dto.response.UserResponse;
import org.springframework.security.authentication.BadCredentialsException;
import java.util.Optional;
import com.incubyte.dealership.entity.Role;
import com.incubyte.dealership.entity.User;
import com.incubyte.dealership.exception.DuplicateEmailException;
import com.incubyte.dealership.repository.UserRepository;
import com.incubyte.dealership.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldRegisterUserSuccessfully_WhenEmailIsUnique() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("plainPassword")
                .build();

        User savedUser = User.builder()
                .id("some-id")
                .name("John Doe")
                .email("john@example.com")
                .password("hashedPassword")
                .role(Role.USER)
                .build();

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("some-id", response.getId());
        assertEquals("John Doe", response.getName());
        assertEquals("john@example.com", response.getEmail());
        assertEquals(Role.USER, response.getRole());

        verify(userRepository).existsByEmail("john@example.com");
        verify(passwordEncoder).encode("plainPassword");
        verify(userRepository).save(argThat(user -> 
            user.getName().equals("John Doe") &&
            user.getEmail().equals("john@example.com") &&
            user.getPassword().equals("hashedPassword") &&
            user.getRole() == Role.USER
        ));
    }

    @Test
    void register_ShouldThrowDuplicateEmailException_WhenEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("plainPassword")
                .build();

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateEmailException.class, () -> authService.register(request));

        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldAuthenticateSuccessfully_WhenPasswordAndEmailMatch() {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("plainPassword")
                .build();

        User user = User.builder()
                .id("some-id")
                .name("John Doe")
                .email("john@example.com")
                .password("hashedPassword")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plainPassword", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("john@example.com", Role.USER)).thenReturn("mock-jwt-token");

        // Act
        LoginResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("john@example.com", response.getEmail());
        assertEquals(Role.USER, response.getRole());
        assertNotNull(response.getToken());

        verify(userRepository).findByEmail("john@example.com");
        verify(passwordEncoder).matches("plainPassword", "hashedPassword");
    }

    @Test
    void login_ShouldThrowBadCredentialsException_WhenEmailNotFound() {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("notfound@example.com")
                .password("plainPassword")
                .build();

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(userRepository).findByEmail("notfound@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_ShouldThrowBadCredentialsException_WhenPasswordDoesNotMatch() {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("wrongPassword")
                .build();

        User user = User.builder()
                .id("some-id")
                .name("John Doe")
                .email("john@example.com")
                .password("hashedPassword")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(userRepository).findByEmail("john@example.com");
        verify(passwordEncoder).matches("wrongPassword", "hashedPassword");
    }
}
