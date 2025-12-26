package com.rapidcare.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

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
    public List<EmergencyRequest> getForHospital(
            @PathVariable String hospitalId) {
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
    public EmergencyRequest refer(@PathVariable String id) {
        return service.refer(id);
    }
}
