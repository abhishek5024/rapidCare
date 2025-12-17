package com.rapidcare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.model.RequestStatus;
import com.rapidcare.repository.EmergencyRequestRepository;

@Service
public class EmergencyService {

    @Autowired
    private EmergencyRequestRepository repository;

    public EmergencyRequest create(EmergencyRequest request) {
        request.setStatus(RequestStatus.PENDING.name());
        return repository.save(request);
    }

    public Optional<EmergencyRequest> getById(String id) {
        return repository.findById(id);
    }

    public List<EmergencyRequest> getAll() {
        return repository.findAll();
    }
}
