package com.rapidcare.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.model.RequestStatus;
import com.rapidcare.repository.EmergencyRequestRepository;

@Service
public class EmergencyService {

    private final EmergencyRequestRepository repository;

    @Autowired
    public EmergencyService(EmergencyRequestRepository repository) {
        this.repository = repository;
    }

    @Autowired
private MedicalTextAIService aiService;

public EmergencyRequest create(EmergencyRequest request) {

    Map<String, Object> aiResult =
            aiService.analyzeSymptoms(request.getSymptoms());

    request.setSeverity((String) aiResult.get("severity"));
    request.setAiReasons((List<String>) aiResult.get("reasons"));
    request.setAiEntities((List<String>) aiResult.get("entities"));
    request.setStatus(RequestStatus.PENDING.name());

    return repository.save(request);
}

    public List<EmergencyRequest> getAll() {
        return repository.findAll();
    }

    public Optional<EmergencyRequest> getById(String id) {
        return repository.findById(id);
    }

    public List<EmergencyRequest> getByHospitalId(String hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }
    public EmergencyRequest accept(String id) {
    EmergencyRequest req = repository.findById(id).orElseThrow();
    req.setStatus(RequestStatus.ACCEPTED.name());
    return repository.save(req);
}

public EmergencyRequest reject(String id) {
    EmergencyRequest req = repository.findById(id).orElseThrow();
    req.setStatus(RequestStatus.REJECTED.name());
    return repository.save(req);
}
public List<EmergencyRequest> getByHospital(String hospitalId) {
    return repository.findByHospitalId(hospitalId);
}
public EmergencyRequest inTransit(String id) {
    EmergencyRequest req = repository.findById(id).orElseThrow();
    req.setStatus(RequestStatus.IN_TRANSIT.name());
    return repository.save(req);
}
public EmergencyRequest refer(String requestId, String newHospitalId) {
    EmergencyRequest req = repository.findById(requestId).orElseThrow();
    req.setHospitalId(newHospitalId);
    req.setStatus(RequestStatus.PENDING.name());
    return repository.save(req);
}

public EmergencyRequest admit(String id) {
    EmergencyRequest req = repository.findById(id).orElseThrow();
    req.setStatus(RequestStatus.ADMITTED.name());
    return repository.save(req);
}

}
