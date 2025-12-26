package com.rapidcare.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.rapidcare.model.Hospital;
import com.rapidcare.repository.HospitalRepository;

@Service
public class HospitalAuthService {

    @Autowired
    private HospitalRepository repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /* Register hospital */
    public Hospital register(Hospital hospital) {

        Optional<Hospital> existing =
                repository.findByPhone(hospital.getPhone());

        if (existing.isPresent()) {
            throw new RuntimeException("Hospital already registered");
        }

        hospital.setPassword(
                encoder.encode(hospital.getPassword())
        );

        return repository.save(hospital);
    }

    /* Login hospital */
    public Hospital login(String phone, String password) {

        Hospital hospital = repository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        if (!encoder.matches(password, hospital.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        hospital.setPassword(null); // do not expose password
        return hospital;
    }
}
