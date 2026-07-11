package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.entity.Vehicle;
import com.incubyte.dealership.exception.ResourceNotFoundException;
import com.incubyte.dealership.repository.VehicleRepository;
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
        when(vehicleRepository.existsById("vehicle-id")).thenReturn(true);
        doNothing().when(vehicleRepository).deleteById("vehicle-id");

        assertDoesNotThrow(() -> vehicleService.deleteVehicle("vehicle-id"));

        verify(vehicleRepository).existsById("vehicle-id");
        verify(vehicleRepository).deleteById("vehicle-id");
    }

    @Test
    void deleteVehicle_ShouldThrowResourceNotFoundException_WhenIdDoesNotExist() {
        when(vehicleRepository.existsById("non-existent")).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> 
                vehicleService.deleteVehicle("non-existent"));

        verify(vehicleRepository).existsById("non-existent");
        verify(vehicleRepository, never()).deleteById(anyString());
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
}
