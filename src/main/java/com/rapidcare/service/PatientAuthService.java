package com.rapidcare.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rapidcare.model.Patient;
import com.rapidcare.repository.PatientRepository;

@Service
public class PatientAuthService {

    @Autowired
    private PatientRepository repository;

    public Patient register(Patient patient) {

        Optional<Patient> existing = repository.findByPhone(patient.getPhone());
        if (existing.isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        return repository.save(patient);
    }

    public Patient login(String phone, String password) {

        Patient patient = repository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return patient;
    }
}
