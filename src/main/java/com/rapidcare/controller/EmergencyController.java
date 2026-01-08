package com.rapidcare.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.service.EmergencyService;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "http://localhost:5173")
public class EmergencyController {

    private final EmergencyService service;

    public EmergencyController(EmergencyService service) {
        this.service = service;
    }

    /* ========= PATIENT ========= */

    @PostMapping("/request")
    public EmergencyRequest create(@RequestBody EmergencyRequest request) {
        return service.create(request);
    }

    // NEW: latest emergency for a patient (used by getMyLatestEmergency in frontend)
    @GetMapping("/patient/{patientId}/latest")
public ResponseEntity<EmergencyRequest> getLatestForPatient(@PathVariable String patientId) {
    return service.getLatestForPatient(patientId)
            .map(ResponseEntity::ok)
            // when none exists, return 200 with null body
            .orElseGet(() -> ResponseEntity.ok(null));
}

    @GetMapping("/{id}")
    public EmergencyRequest getById(@PathVariable String id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @GetMapping("/all")
    public List<EmergencyRequest> getAll() {
        return service.getAll();
    }

    /* ========= HOSPITAL ========= */

    @GetMapping("/hospital/{hospitalId}")
    public List<EmergencyRequest> getForHospital(@PathVariable String hospitalId) {
        return service.getForHospital(hospitalId);
    }

    @PutMapping("/{id}/accept")
    public EmergencyRequest accept(
            @PathVariable String id,
            @RequestParam String hospitalId,
            @RequestParam String hospitalName) {

        return service.accept(id, hospitalId, hospitalName);
    }

    @PutMapping("/{id}/reject")
    public EmergencyRequest reject(
            @PathVariable String id,
            @RequestParam(defaultValue = "No beds available") String reason) {

        return service.reject(id, reason);
    }

    @PutMapping("/{id}/in-transit")
    public EmergencyRequest inTransit(@PathVariable String id) {
        return service.inTransit(id);
    }

    @PutMapping("/{id}/admit")
    public EmergencyRequest admit(@PathVariable String id) {
        return service.admit(id);
    }

   @PutMapping("/{id}/refer")
public EmergencyRequest refer(
        @PathVariable String id,
        @RequestParam String hospitalId
) {
    return service.refer(id, hospitalId);
}

    @PutMapping("/{id}/arriving")
    public EmergencyRequest arriving(@PathVariable String id) {
        return service.arriving(id);
    }

    @PutMapping("/{id}/picked-up")
    public EmergencyRequest pickedUp(@PathVariable String id) {
        return service.pickedUp(id);
    }
}