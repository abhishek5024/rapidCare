package com.rapidcare.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.model.Patient;
import com.rapidcare.service.PatientAuthService;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientAuthController {

    @Autowired
    private PatientAuthService service;

    // ✅ Register
    @PostMapping("/register")
    public Patient register(@RequestBody Patient patient) {
        return service.register(patient);
    }

    // ✅ Login
    @PostMapping("/login")
    public Patient login(@RequestBody Map<String, String> payload) {
        return service.login(
                payload.get("phone"),
                payload.get("password")
        );
    }
}
