package com.rapidcare.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.Hospital;

public interface HospitalRepository extends MongoRepository<Hospital, String> {
}
