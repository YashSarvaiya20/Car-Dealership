package com.incubyte.dealership.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.security.CustomUserDetailsService;
import com.incubyte.dealership.security.JwtUtil;
import com.incubyte.dealership.security.JwtFilter;
import com.incubyte.dealership.security.SecurityConfig;
import com.incubyte.dealership.service.VehicleService;
import org.springframework.context.annotation.Import;
import org.junit.jupiter.api.BeforeEach;
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

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = VehicleController.class, excludeAutoConfiguration = {
        MongoAutoConfiguration.class,
        MongoDataAutoConfiguration.class,
        MongoRepositoriesAutoConfiguration.class
})
@Import({SecurityConfig.class, JwtFilter.class})
class VehicleControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private VehicleRequest validRequest;
    private VehicleResponse validResponse;

    @BeforeEach
    void setUp() {
        validRequest = VehicleRequest.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(30000.0)
                .quantity(5)
                .build();

        validResponse = VehicleResponse.builder()
                .id("vehicle-id")
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(30000.0)
                .quantity(5)
                .build();
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void createVehicle_ShouldReturnCreated_WhenUserIsAdminAndPayloadIsValid() throws Exception {
        when(vehicleService.createVehicle(any(VehicleRequest.class))).thenReturn(validResponse);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("vehicle-id"))
                .andExpect(jsonPath("$.make").value("Toyota"));

        verify(vehicleService).createVehicle(any(VehicleRequest.class));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void createVehicle_ShouldReturnForbidden_WhenUserIsStandardUser() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());

        verify(vehicleService, never()).createVehicle(any(VehicleRequest.class));
    }

    @Test
    void createVehicle_ShouldReturnUnauthorized_WhenUserIsAnonymous() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());

        verify(vehicleService, never()).createVehicle(any(VehicleRequest.class));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void createVehicle_ShouldReturnBadRequest_WhenPayloadIsInvalid() throws Exception {
        VehicleRequest invalidRequest = VehicleRequest.builder()
                .make("")
                .model("Camry")
                .category("Sedan")
                .price(-10.0)
                .quantity(-5)
                .build();

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details").isArray());

        verify(vehicleService, never()).createVehicle(any(VehicleRequest.class));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void updateVehicle_ShouldReturnOk_WhenUserIsAdminAndPayloadIsValid() throws Exception {
        when(vehicleService.updateVehicle(eq("vehicle-id"), any(VehicleRequest.class))).thenReturn(validResponse);

        mockMvc.perform(put("/api/vehicles/vehicle-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("vehicle-id"));

        verify(vehicleService).updateVehicle(eq("vehicle-id"), any(VehicleRequest.class));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void updateVehicle_ShouldReturnForbidden_WhenUserIsStandardUser() throws Exception {
        mockMvc.perform(put("/api/vehicles/vehicle-id")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());

        verify(vehicleService, never()).updateVehicle(anyString(), any(VehicleRequest.class));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void deleteVehicle_ShouldReturnNoContent_WhenUserIsAdmin() throws Exception {
        doNothing().when(vehicleService).deleteVehicle("vehicle-id");

        mockMvc.perform(delete("/api/vehicles/vehicle-id")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(vehicleService).deleteVehicle("vehicle-id");
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void deleteVehicle_ShouldReturnForbidden_WhenUserIsStandardUser() throws Exception {
        mockMvc.perform(delete("/api/vehicles/vehicle-id")
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(vehicleService, never()).deleteVehicle(anyString());
    }

    @Test
    void getAllVehicles_ShouldReturnOk_WhenUserIsAnonymous() throws Exception {
        when(vehicleService.getAllVehicles()).thenReturn(Collections.singletonList(validResponse));

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("vehicle-id"));

        verify(vehicleService).getAllVehicles();
    }

    @Test
    void searchVehicles_ShouldReturnOk_WhenUserIsAnonymous() throws Exception {
        when(vehicleService.searchVehicles("Toyota", "Camry", "Sedan", 10000.0, 40000.0, 1))
                .thenReturn(Collections.singletonList(validResponse));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "Toyota")
                        .param("model", "Camry")
                        .param("category", "Sedan")
                        .param("minPrice", "10000.0")
                        .param("maxPrice", "40000.0")
                        .param("minQuantity", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("vehicle-id"));

        verify(vehicleService).searchVehicles("Toyota", "Camry", "Sedan", 10000.0, 40000.0, 1);
    }
}
