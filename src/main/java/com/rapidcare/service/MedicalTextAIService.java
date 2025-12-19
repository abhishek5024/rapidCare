package com.rapidcare.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.azure.ai.textanalytics.TextAnalyticsClient;
import com.azure.ai.textanalytics.models.AnalyzeHealthcareEntitiesResult;
import com.azure.ai.textanalytics.models.HealthcareEntity;
import com.azure.ai.textanalytics.util.AnalyzeHealthcareEntitiesResultCollection;

@Service
public class MedicalTextAIService {

    @Autowired
    private TextAnalyticsClient client;

    public Map<String, Object> analyzeSymptoms(String text) {

        AnalyzeHealthcareEntitiesResultCollection results =
                client.beginAnalyzeHealthcareEntities(
                        Collections.singletonList(text),
                        "en",
                        null
                ).getFinalResult()
                 .iterator()
                 .next();

        String severity = "LOW";
        List<String> reasons = new ArrayList<>();
        List<String> detectedEntities = new ArrayList<>();

        for (AnalyzeHealthcareEntitiesResult doc : results) {
            if (doc.isError()) continue;

            for (HealthcareEntity entity : doc.getEntities()) {

                String category = entity.getCategory().toString();
                String value = entity.getText().toLowerCase();

                detectedEntities.add(entity.getText());

                if (category.equals("DiseaseDisorder")
                        || value.contains("heart")
                        || value.contains("stroke")
                        || value.contains("breathing")
                        || value.contains("chest")) {

                    severity = "HIGH";
                    reasons.add("Critical symptom detected: " + entity.getText());
                }
                else if (category.equals("SymptomOrSign")
                        && !"HIGH".equals(severity)) {

                    severity = "MEDIUM";
                    reasons.add("Medical symptom detected: " + entity.getText());
                }
            }
        }

        if (reasons.isEmpty()) {
            reasons.add("No critical medical entities detected by AI");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("severity", severity);
        response.put("reasons", reasons);
        response.put("entities", detectedEntities);

        return response;
    }
}
