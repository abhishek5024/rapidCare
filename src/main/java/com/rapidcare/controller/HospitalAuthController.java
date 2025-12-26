package com.rapidcare.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.model.Hospital;
import com.rapidcare.service.HospitalAuthService;

@RestController
@RequestMapping("/api/hospital/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class HospitalAuthController {

    @Autowired
    private HospitalAuthService service;

    /* Register */
    @PostMapping("/register")
    public Hospital register(@RequestBody Hospital hospital) {
        return service.register(hospital);
    }

    /* Login */
    @PostMapping("/login")
    public Hospital login(@RequestBody Map<String, String> body) {
        return service.login(
                body.get("phone"),
                body.get("password")
        );
    }
}
