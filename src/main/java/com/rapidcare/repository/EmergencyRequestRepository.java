package com.rapidcare.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.EmergencyRequest;

public interface EmergencyRequestRepository
        extends MongoRepository<EmergencyRequest, String> {

    // Accepted by a specific hospital
    List<EmergencyRequest> findByAcceptedHospitalId(String hospitalId);

    // All requests with a given status (PENDING / ACCEPTED / etc.)
    List<EmergencyRequest> findByStatus(String status);
}
