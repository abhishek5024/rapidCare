package com.rapidcare.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.rapidcare.model.Hospital;
import com.rapidcare.repository.HospitalRepository;

@Service
public class HospitalService {

    private final HospitalRepository repository;

    public HospitalService(HospitalRepository repository) {
        this.repository = repository;
    }

    public Hospital create(Hospital hospital) {
        return repository.save(hospital);
    }

    public List<Hospital> getAll() {
        return repository.findAll();
    }

    public Hospital prepareBed(String hospitalId) {
        Hospital hospital = repository.findById(hospitalId).orElseThrow();
        hospital.setEmergencyReady(true);
        hospital.setAvailableBeds(hospital.getAvailableBeds() - 1);
        return repository.save(hospital);
    }
}
