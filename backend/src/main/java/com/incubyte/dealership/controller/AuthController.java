package com.incubyte.dealership.controller;

import com.incubyte.dealership.dto.request.LoginRequest;
import com.incubyte.dealership.dto.request.RegisterRequest;
import com.incubyte.dealership.dto.response.LoginResponse;
import com.incubyte.dealership.dto.response.UserResponse;
import com.incubyte.dealership.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return new ResponseEntity<>(authService.login(request), HttpStatus.OK);
    }
}
