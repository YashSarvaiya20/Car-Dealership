package com.incubyte.dealership.controller;

import com.incubyte.dealership.dto.request.VehicleRequest;
import com.incubyte.dealership.dto.response.VehicleResponse;
import com.incubyte.dealership.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse createVehicle(@Valid @RequestBody VehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @PutMapping("/{id}")
    public VehicleResponse updateVehicle(@PathVariable String id, @Valid @RequestBody VehicleRequest request) {
        return vehicleService.updateVehicle(id, request);
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
