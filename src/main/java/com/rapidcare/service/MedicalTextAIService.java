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

    public Map<String, Object> analyzeMedicalText(String text) {

        AnalyzeHealthcareEntitiesResultCollection results =
                client.beginAnalyzeHealthcareEntities(
                        Collections.singletonList(text),
                        "en",
                        null
                ).getFinalResult()
                 .iterator()
                 .next();

        List<String> symptoms = new ArrayList<>();
        String severity = "LOW";

        for (AnalyzeHealthcareEntitiesResult doc : results) {
            if (doc.isError()) continue;

            for (HealthcareEntity entity : doc.getEntities()) {

                if ("SymptomOrSign".equals(entity.getCategory().toString())) {
                    symptoms.add(entity.getText());

                    String value = entity.getText().toLowerCase();

                    if (value.contains("chest")
                            || value.contains("heart")
                            || value.contains("breathing")
                            || value.contains("stroke")
                            || value.contains("unconscious")) {
                        severity = "HIGH";
                    } 
                    else if (!"HIGH".equals(severity)) {
                        severity = "MEDIUM";
                    }
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("symptoms", symptoms);
        response.put("severity", severity);

        return response;
    }
}
