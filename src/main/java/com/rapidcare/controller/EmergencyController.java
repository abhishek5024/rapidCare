package com.rapidcare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/all")
    public List<EmergencyRequest> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EmergencyRequest getById(@PathVariable String id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }
}
