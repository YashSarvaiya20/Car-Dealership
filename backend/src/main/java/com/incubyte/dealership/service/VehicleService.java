package com.incubyte.dealership.service;

import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.entity.Vehicle;
import com.incubyte.dealership.exception.ResourceNotFoundException;
import com.incubyte.dealership.exception.InsufficientStockException;
import com.incubyte.dealership.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ImageService imageService;

    public VehicleService(VehicleRepository vehicleRepository, ImageService imageService) {
        this.vehicleRepository = vehicleRepository;
        this.imageService = imageService;
    }

    public VehicleResponse createVehicle(VehicleRequest request) {
        return createVehicle(request, null);
    }

    public VehicleResponse createVehicle(VehicleRequest request, MultipartFile image) {
        String imageUrl = null;
        if (image != null) {
            imageUrl = imageService.saveImage(image);
        }

        Vehicle vehicle = Vehicle.builder()
                .make(request.getMake())
                .model(request.getModel())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(imageUrl)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    public VehicleResponse updateVehicle(String id, VehicleRequest request) {
        return updateVehicle(id, request, null);
    }

    public VehicleResponse updateVehicle(String id, VehicleRequest request, MultipartFile image) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (image != null && !image.isEmpty()) {
            if (vehicle.getImageUrl() != null) {
                imageService.deleteImage(vehicle.getImageUrl());
            }
            String imageUrl = imageService.saveImage(image);
            vehicle.setImageUrl(imageUrl);
        }

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setPrice(request.getPrice());
        vehicle.setQuantity(request.getQuantity());

        Vehicle updated = vehicleRepository.save(vehicle);
        return mapToResponse(updated);
    }

    public void deleteVehicle(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getImageUrl() != null) {
            imageService.deleteImage(vehicle.getImageUrl());
        }

        vehicleRepository.delete(vehicle);
    }

    public List<VehicleResponse> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<VehicleResponse> responses = new ArrayList<>();
        for (Vehicle v : vehicles) {
            responses.add(mapToResponse(v));
        }
        return responses;
    }

    public List<VehicleResponse> searchVehicles(String make, String model, String category, Double minPrice, Double maxPrice, Integer minQuantity) {
        List<Vehicle> vehicles = vehicleRepository.searchVehicles(make, model, category, minPrice, maxPrice, minQuantity);
        List<VehicleResponse> responses = new ArrayList<>();
        for (Vehicle v : vehicles) {
            responses.add(mapToResponse(v));
        }
        return responses;
    }

    public VehicleResponse purchaseVehicle(String id) {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (isAdmin) {
                throw new org.springframework.security.access.AccessDeniedException("Administrators cannot purchase vehicles. Please use a customer account.");
            }
        }

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getQuantity() <= 0) {
            throw new InsufficientStockException("Vehicle is out of stock");
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);
        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .category(vehicle.getCategory())
                .price(vehicle.getPrice())
                .quantity(vehicle.getQuantity())
                .imageUrl(vehicle.getImageUrl())
                .build();
    }
}
