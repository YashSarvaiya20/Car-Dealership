package com.incubyte.dealership.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {

    private String id;
    private String make;
    private String model;
    private String category;
    private Double price;
    private Integer quantity;
    private String imageUrl;
}
