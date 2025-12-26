package com.rapidcare.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.Hospital;

public interface HospitalRepository extends MongoRepository<Hospital, String> {
Optional<Hospital> findByPhone(String phone);
}