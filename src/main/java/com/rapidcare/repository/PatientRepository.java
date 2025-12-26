package com.rapidcare.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rapidcare.model.Patient;

public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Patient> findByPhone(String phone);
}
