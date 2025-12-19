package com.rapidcare.service;

import org.springframework.stereotype.Service;

import com.azure.ai.textanalytics.TextAnalyticsClient;

@Service
public class AiTriageService {

    private final TextAnalyticsClient client;

    public AiTriageService(TextAnalyticsClient client) {
        this.client = client;
    }

    public String detectSeverity(String symptoms) {
        String text = symptoms.toLowerCase();

        if (text.contains("chest pain") || text.contains("breathing")) {
            return "HIGH";
        }
        if (text.contains("fever") || text.contains("vomiting")) {
            return "MEDIUM";
        }
        return "LOW";
    }
}
