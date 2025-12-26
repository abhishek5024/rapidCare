package com.rapidcare.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.service.AiMedicalService;

@RestController
@RequestMapping("/api/ai/medical")
@CrossOrigin(origins = "http://localhost:5173")
public class AiMedicalController {

    private final AiMedicalService aiMedicalService;

    public AiMedicalController(AiMedicalService aiMedicalService) {
        this.aiMedicalService = aiMedicalService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyze(@RequestBody Map<String, Object> payload) {
        String symptoms = payload.get("symptoms") == null ? null : String.valueOf(payload.get("symptoms"));
        String duration = payload.get("duration") == null ? null : String.valueOf(payload.get("duration"));
        String severity = payload.get("severity") == null ? null : String.valueOf(payload.get("severity"));

        Map<String, Object> result = aiMedicalService.analyze(symptoms, duration, severity);
        return ResponseEntity.ok(result);
    }
}
