package com.rapidcare.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.EmergencyRequest;

public interface EmergencyRequestRepository 
    extends MongoRepository<EmergencyRequest, String> {
}
