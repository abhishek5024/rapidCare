package com.rapidcare.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import com.azure.ai.textanalytics.TextAnalyticsClient;
import com.azure.ai.textanalytics.models.AnalyzeHealthcareEntitiesResult;
import com.azure.ai.textanalytics.models.HealthcareEntity;
import com.azure.ai.textanalytics.util.AnalyzeHealthcareEntitiesResultCollection;

@Service
public class MedicalTextAIService {

    /**
     * Optional: only present when AZURE_LANGUAGE_ENDPOINT and AZURE_LANGUAGE_KEY are set.
     */
    @Autowired(required = false)
    @Nullable
    private TextAnalyticsClient client;

    public Map<String, Object> analyzeMedicalText(String text) {
        // Safe fallback for tests / local runs without Azure config.
        if (client == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("severity", "LOW");
            result.put("entities", List.of());
            result.put("reasons", List.of("AI service disabled: missing Azure Language configuration"));
            return result;
        }

        AnalyzeHealthcareEntitiesResultCollection results = client
                .beginAnalyzeHealthcareEntities(Collections.singletonList(text), "en", null)
                .getFinalResult()
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
                } else if (category.equals("SymptomOrSign") && !"HIGH".equals(severity)) {

                    severity = "MEDIUM";
                    reasons.add("Medical symptom detected: " + entity.getText());
                }
            }
        }

        if (reasons.isEmpty()) {
            reasons.add("No critical medical entities detected by AI");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("severity", severity);
        result.put("entities", detectedEntities);
        result.put("reasons", reasons);

        return result;
    }
}
