package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.entity.Vehicle;
import com.incubyte.dealership.exception.ResourceNotFoundException;
import com.incubyte.dealership.exception.InsufficientStockException;
import com.incubyte.dealership.repository.VehicleRepository;
import org.springframework.web.multipart.MultipartFile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTests {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private VehicleService vehicleService;

    private VehicleRequest request;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        request = VehicleRequest.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(30000.0)
                .quantity(5)
                .build();

        vehicle = Vehicle.builder()
                .id("vehicle-id")
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(30000.0)
                .quantity(5)
                .build();
    }

    @Test
    void createVehicle_ShouldReturnSavedVehicle() {
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleResponse response = vehicleService.createVehicle(request);

        assertNotNull(response);
        assertEquals("vehicle-id", response.getId());
        assertEquals("Toyota", response.getMake());
        assertEquals("Camry", response.getModel());
        assertEquals("Sedan", response.getCategory());
        assertEquals(30000.0, response.getPrice());
        assertEquals(5, response.getQuantity());

        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_ShouldReturnUpdatedVehicle_WhenIdExists() {
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleResponse response = vehicleService.updateVehicle("vehicle-id", request);

        assertNotNull(response);
        assertEquals("vehicle-id", response.getId());
        verify(vehicleRepository).findById("vehicle-id");
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_ShouldThrowResourceNotFoundException_WhenIdDoesNotExist() {
        when(vehicleRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
                vehicleService.updateVehicle("non-existent", request));

        verify(vehicleRepository).findById("non-existent");
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void deleteVehicle_ShouldDelete_WhenIdExists() {
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
        doNothing().when(vehicleRepository).delete(vehicle);

        assertDoesNotThrow(() -> vehicleService.deleteVehicle("vehicle-id"));

        verify(vehicleRepository).findById("vehicle-id");
        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void deleteVehicle_ShouldThrowResourceNotFoundException_WhenIdDoesNotExist() {
        when(vehicleRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
                vehicleService.deleteVehicle("non-existent"));

        verify(vehicleRepository).findById("non-existent");
        verify(vehicleRepository, never()).delete(any(Vehicle.class));
    }

    @Test
    void getAllVehicles_ShouldReturnList() {
        when(vehicleRepository.findAll()).thenReturn(Arrays.asList(vehicle));

        List<VehicleResponse> responses = vehicleService.getAllVehicles();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("vehicle-id", responses.get(0).getId());
        verify(vehicleRepository).findAll();
    }

    @Test
    void searchVehicles_ShouldReturnList() {
        when(vehicleRepository.searchVehicles("Toyota", "Camry", "Sedan", 10000.0, 40000.0, 1))
                .thenReturn(java.util.Arrays.asList(vehicle));

        List<VehicleResponse> responses = vehicleService.searchVehicles("Toyota", "Camry", "Sedan", 10000.0, 40000.0, 1);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("vehicle-id", responses.get(0).getId());
        verify(vehicleRepository).searchVehicles("Toyota", "Camry", "Sedan", 10000.0, 40000.0, 1);
    }

    @Test
    void purchaseVehicle_ShouldDecrementQuantityByOne_WhenStockIsAvailable() {
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleResponse response = vehicleService.purchaseVehicle("vehicle-id");

        assertNotNull(response);
        assertEquals(4, vehicle.getQuantity()); // decremented from 5 to 4
        verify(vehicleRepository).findById("vehicle-id");
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void purchaseVehicle_ShouldThrowInsufficientStockException_WhenQuantityIsZero() {
        vehicle.setQuantity(0);
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));

        assertThrows(InsufficientStockException.class, () -> 
                vehicleService.purchaseVehicle("vehicle-id"));

        verify(vehicleRepository).findById("vehicle-id");
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void createVehicle_WithValidImage_ShouldSaveImageAndStoreUrl() {
        MultipartFile mockImage = mock(MultipartFile.class);
        when(imageService.saveImage(mockImage)).thenReturn("/uploads/test-image.jpg");
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> {
            Vehicle v = invocation.getArgument(0);
            v.setId("vehicle-id");
            return v;
        });

        VehicleResponse response = vehicleService.createVehicle(request, mockImage);

        assertNotNull(response);
        assertEquals("/uploads/test-image.jpg", response.getImageUrl());
        verify(imageService).saveImage(mockImage);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_WithNewImage_ShouldDeleteOldImageAndSaveNewImage() {
        vehicle.setImageUrl("/uploads/old-image.jpg");
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
        
        MultipartFile mockImage = mock(MultipartFile.class);
        when(mockImage.isEmpty()).thenReturn(false);
        when(imageService.saveImage(mockImage)).thenReturn("/uploads/new-image.jpg");
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        VehicleResponse response = vehicleService.updateVehicle("vehicle-id", request, mockImage);

        assertNotNull(response);
        verify(imageService).deleteImage("/uploads/old-image.jpg");
        verify(imageService).saveImage(mockImage);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void deleteVehicle_ShouldDeleteImage_WhenImageExists() {
        vehicle.setImageUrl("/uploads/test-image.jpg");
        when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
        doNothing().when(vehicleRepository).delete(vehicle);

        assertDoesNotThrow(() -> vehicleService.deleteVehicle("vehicle-id"));

        verify(imageService).deleteImage("/uploads/test-image.jpg");
        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void purchaseVehicle_ShouldThrowResourceNotFoundException_WhenVehicleDoesNotExist() {
        when(vehicleRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                vehicleService.purchaseVehicle("non-existent"));

        verify(vehicleRepository).findById("non-existent");
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void purchaseVehicle_ShouldThrowAccessDeniedException_WhenUserIsAdmin() {
        org.springframework.security.core.Authentication authentication = mock(org.springframework.security.core.Authentication.class);
        org.springframework.security.core.GrantedAuthority authority = () -> "ROLE_ADMIN";
        doReturn(java.util.Collections.singletonList(authority)).when(authentication).getAuthorities();

        org.springframework.security.core.context.SecurityContext securityContext = mock(org.springframework.security.core.context.SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        org.springframework.security.core.context.SecurityContextHolder.setContext(securityContext);

        try {
            assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
                    vehicleService.purchaseVehicle("vehicle-id"));
            verify(vehicleRepository, never()).findById(anyString());
            verify(vehicleRepository, never()).save(any(Vehicle.class));
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }

    @Test
    void purchaseVehicle_ShouldSucceed_WhenUserIsCustomer() {
        org.springframework.security.core.Authentication authentication = mock(org.springframework.security.core.Authentication.class);
        org.springframework.security.core.GrantedAuthority authority = () -> "ROLE_CUSTOMER";
        doReturn(java.util.Collections.singletonList(authority)).when(authentication).getAuthorities();

        org.springframework.security.core.context.SecurityContext securityContext = mock(org.springframework.security.core.context.SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        org.springframework.security.core.context.SecurityContextHolder.setContext(securityContext);

        try {
            vehicle.setQuantity(5);
            when(vehicleRepository.findById("vehicle-id")).thenReturn(Optional.of(vehicle));
            when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

            VehicleResponse response = vehicleService.purchaseVehicle("vehicle-id");

            assertNotNull(response);
            assertEquals(4, vehicle.getQuantity());
            verify(vehicleRepository).save(vehicle);
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }
}
