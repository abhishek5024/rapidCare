package com.rapidcare.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.rapidcare.controller.EmergencySseController;
import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.model.RequestStatus;
import com.rapidcare.repository.EmergencyRequestRepository;

@Service
public class EmergencyService {

    private static final String BROADCAST_HOSPITAL_ID = "BROADCAST";

    private final EmergencyRequestRepository repository;
    private final MedicalTextAIService aiService;
    private final EmergencySseController sseController;

    public EmergencyService(
            EmergencyRequestRepository repository,
            MedicalTextAIService aiService,
            EmergencySseController sseController
    ) {
        this.repository = repository;
        this.aiService = aiService;
        this.sseController = sseController;
    }

    /* =========================
       PATIENT → CREATE REQUEST
    ========================= */
    public EmergencyRequest create(EmergencyRequest request) {

        Map<String, Object> aiResult =
                aiService.analyzeMedicalText(request.getSymptoms());

        request.setSeverity((String) aiResult.get("severity"));

        @SuppressWarnings("unchecked")
        List<String> entities = (List<String>) aiResult.get("entities");
        @SuppressWarnings("unchecked")
        List<String> reasons = (List<String>) aiResult.get("reasons");

        request.setAiEntities(entities);
        request.setAiReasons(reasons);

        request.setStatus(RequestStatus.PENDING.name());

        // Cosmos DB Mongo API: shard key must be present on every write
        // Keep it immutable for this document.
        if (request.getHospitalId() == null || request.getHospitalId().isBlank()) {
            request.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        // 🔑 IMPORTANT: broadcast (do NOT assign hospital here)
        request.setAcceptedHospitalId(null);
        request.setAcceptedHospitalName(null);
        request.setAcceptedHospitalAddress(null);
        request.setCreatedAt(Instant.now());

        EmergencyRequest saved = repository.save(request);

        // 🔔 Notify all hospitals
        sseController.notifyNewRequest(saved);

        return saved;
    }

    /* =========================
       COMMON
    ========================= */
    public Optional<EmergencyRequest> getById(String id) {
        return repository.findById(id);
    }

    public List<EmergencyRequest> getAll() {
        return repository.findAll();
    }

    /* =========================
       HOSPITAL VIEW
       - All PENDING
       - ACCEPTED by this hospital
    ========================= */
    public List<EmergencyRequest> getForHospital(String hospitalId) {
        List<EmergencyRequest> pending = repository.findByStatus(RequestStatus.PENDING.name());
        List<EmergencyRequest> accepted = repository.findByAcceptedHospitalId(hospitalId);
        pending.addAll(accepted);
        return pending;
    }

    /* =========================
       ACCEPT (FIRST WINS)
    ========================= */
    public synchronized EmergencyRequest accept(
            String requestId,
            String hospitalId,
            String hospitalName
    ) {
        EmergencyRequest req = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!RequestStatus.PENDING.name().equals(req.getStatus())) {
            throw new RuntimeException("Request already handled");
        }

        // Ensure shard key stays present (and unchanged)
        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            req.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        req.setStatus(RequestStatus.ACCEPTED.name());
        req.setAcceptedHospitalId(hospitalId);
        req.setAcceptedHospitalName(hospitalName);

        EmergencyRequest saved = repository.save(req);
        sseController.notifyStatus(requestId, saved);

        return saved;
    }

    /* =========================
       REJECT
    ========================= */
    public EmergencyRequest reject(String requestId, String reason) {
        EmergencyRequest req = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            req.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        req.setStatus(RequestStatus.REJECTED.name());
        req.setRejectionReason(reason);

        EmergencyRequest saved = repository.save(req);
        sseController.notifyStatus(requestId, saved);

        return saved;
    }

    /* =========================
       IN TRANSIT
    ========================= */
    public EmergencyRequest inTransit(String requestId) {
        EmergencyRequest req = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            req.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        req.setStatus(RequestStatus.IN_TRANSIT.name());

        EmergencyRequest saved = repository.save(req);
        sseController.notifyStatus(requestId, saved);
        return saved;
    }

    /* =========================
       ADMIT
    ========================= */
    public EmergencyRequest admit(String requestId) {
        EmergencyRequest req = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            req.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        req.setStatus(RequestStatus.ADMITTED.name());

        EmergencyRequest saved = repository.save(req);
        sseController.notifyStatus(requestId, saved);
        return saved;
    }

    /* =========================
       REFER (REBROADCAST)
    ========================= */
    public EmergencyRequest refer(String requestId) {
        EmergencyRequest req = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            req.setHospitalId(BROADCAST_HOSPITAL_ID);
        }

        req.setStatus(RequestStatus.PENDING.name());
        req.setAcceptedHospitalId(null);
        req.setAcceptedHospitalName(null);
        req.setAcceptedHospitalAddress(null);

        EmergencyRequest saved = repository.save(req);
        sseController.notifyNewRequest(saved);

        return saved;
    }
}
