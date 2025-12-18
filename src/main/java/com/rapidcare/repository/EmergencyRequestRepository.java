package com.rapidcare.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.model.RequestStatus;

public interface EmergencyRequestRepository 
    extends MongoRepository<EmergencyRequest, String> {
        List<EmergencyRequest> findByHospitalId(String hospitalId);
        // List<EmergencyRequest> findByHospitalId(String hospitalId);
        List<EmergencyRequest> findByStatus(RequestStatus status);

}
