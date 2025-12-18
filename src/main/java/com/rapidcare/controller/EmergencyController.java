package com.rapidcare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.model.EmergencyRequest;
import com.rapidcare.service.EmergencyService;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    @Autowired
    private EmergencyService service;

    @PostMapping("/request")
    public EmergencyRequest create(@RequestBody EmergencyRequest request) {
        return service.create(request);
    }
    @GetMapping("/hospital/{hospitalId}")
    public List<EmergencyRequest> getByHospital(@PathVariable String hospitalId) {
        return service.getByHospitalId(hospitalId);
    }

    @PutMapping("/{id}/accept")
    public EmergencyRequest accept(@PathVariable String id) {
        return service.accept(id);
    }

    @PutMapping("/{id}/reject")
    public EmergencyRequest reject(@PathVariable String id) {
        return service.reject(id);
    }

    @GetMapping("/all")
    public List<EmergencyRequest> getAll() {
        return service.getAll();
    }
    @PutMapping("/{id}/refer/{newHospitalId}")
public EmergencyRequest refer(
        @PathVariable String id,
        @PathVariable String newHospitalId) {
    return service.refer(id, newHospitalId);
}

    @PutMapping("/{id}/in-transit")
public EmergencyRequest inTransit(@PathVariable String id) {
    return service.inTransit(id);
}

@PutMapping("/{id}/admit")
public EmergencyRequest admit(@PathVariable String id) {
    return service.admit(id);
}


    @GetMapping("/{id}")
    public EmergencyRequest getById(@PathVariable String id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }
}
