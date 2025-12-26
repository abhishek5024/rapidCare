package com.rapidcare.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class AiMedicalService {

    private final MedicalTextAIService medicalTextAIService;

    public AiMedicalService(MedicalTextAIService medicalTextAIService) {
        this.medicalTextAIService = medicalTextAIService;
    }

    public Map<String, Object> analyze(String symptoms, String duration, String selfSeverity) {
        if (symptoms == null || symptoms.isBlank()) {
            throw new IllegalArgumentException("symptoms is required");
        }

        Map<String, Object> ai = medicalTextAIService.analyzeMedicalText(symptoms);

        String riskLevel = String.valueOf(ai.getOrDefault("severity", "LOW"));

        @SuppressWarnings("unchecked")
        List<String> entities = (List<String>) ai.getOrDefault("entities", List.of());

        boolean emergency = "HIGH".equalsIgnoreCase(riskLevel);

        String recommendation;
        if ("LOW".equalsIgnoreCase(riskLevel)) {
            recommendation = "Self-care advice: rest, hydrate, and monitor symptoms.";
        } else if ("MEDIUM".equalsIgnoreCase(riskLevel)) {
            recommendation = "Consult a general physician/clinic if symptoms persist or worsen.";
        } else {
            recommendation = "Urgent care recommended. Consider requesting emergency assistance.";
        }

        Map<String, Object> out = new HashMap<>();
        out.put("riskLevel", riskLevel);
        out.put("entities", entities);
        out.put("duration", duration);
        out.put("selfReportedSeverity", selfSeverity);
        out.put("recommendation", recommendation);
        out.put("emergency", emergency);

        return out;
    }
}
