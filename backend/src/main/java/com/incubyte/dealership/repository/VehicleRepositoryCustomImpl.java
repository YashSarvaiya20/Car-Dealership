package com.incubyte.dealership.repository;

import com.incubyte.dealership.entity.Vehicle;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class VehicleRepositoryCustomImpl implements VehicleRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    public VehicleRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<Vehicle> searchVehicles(String make, String model, String category, Double minPrice, Double maxPrice, Integer minQuantity) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (make != null && !make.trim().isEmpty()) {
            criteriaList.add(Criteria.where("make").regex(make, "i"));
        }
        if (model != null && !model.trim().isEmpty()) {
            criteriaList.add(Criteria.where("model").regex(model, "i"));
        }
        if (category != null && !category.trim().isEmpty()) {
            criteriaList.add(Criteria.where("category").regex("^" + category + "$", "i"));
        }

        if (minPrice != null || maxPrice != null) {
            Criteria priceCriteria = Criteria.where("price");
            if (minPrice != null) {
                priceCriteria.gte(minPrice);
            }
            if (maxPrice != null) {
                priceCriteria.lte(maxPrice);
            }
            criteriaList.add(priceCriteria);
        }

        if (minQuantity != null) {
            criteriaList.add(Criteria.where("quantity").gte(minQuantity));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Vehicle.class);
    }
}
