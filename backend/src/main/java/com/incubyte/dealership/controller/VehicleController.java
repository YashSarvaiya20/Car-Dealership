package com.incubyte.dealership.controller;

import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse createVehicle(
            @ModelAttribute @Valid VehicleRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return vehicleService.createVehicle(request, image);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VehicleResponse updateVehicle(
            @PathVariable String id,
            @ModelAttribute @Valid VehicleRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return vehicleService.updateVehicle(id, request, image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicle(@PathVariable String id) {
        vehicleService.deleteVehicle(id);
    }

    @GetMapping
    public List<VehicleResponse> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/search")
    public List<VehicleResponse> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minQuantity) {
        return vehicleService.searchVehicles(make, model, category, minPrice, maxPrice, minQuantity);
    }

    @PostMapping("/{id}/purchase")
    public VehicleResponse purchaseVehicle(@PathVariable String id) {
        return vehicleService.purchaseVehicle(id);
    }
}
