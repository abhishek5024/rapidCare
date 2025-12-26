package com.rapidcare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.dto.ClinicRecommendRequest;
import com.rapidcare.dto.ClinicRecommendResponse;
import com.rapidcare.service.ClinicRecommendationService;

@RestController
@RequestMapping("/api/clinic")
@CrossOrigin(origins = "http://localhost:5173")
public class ClinicRecommendationController {

    private final ClinicRecommendationService clinicRecommendationService;

    public ClinicRecommendationController(ClinicRecommendationService clinicRecommendationService) {
        this.clinicRecommendationService = clinicRecommendationService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<ClinicRecommendResponse> recommend(@RequestBody ClinicRecommendRequest payload) {
        return ResponseEntity.ok(clinicRecommendationService.recommend(payload));
    }
}
