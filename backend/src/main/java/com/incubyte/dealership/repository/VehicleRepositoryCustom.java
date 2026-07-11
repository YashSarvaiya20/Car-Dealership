package com.incubyte.dealership.repository;

import com.incubyte.dealership.entity.Vehicle;
import java.util.List;

public interface VehicleRepositoryCustom {
    List<Vehicle> searchVehicles(String make, String model, String category, Double minPrice, Double maxPrice, Integer minQuantity);
}
