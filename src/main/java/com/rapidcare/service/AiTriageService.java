package com.rapidcare.service;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import com.azure.ai.textanalytics.TextAnalyticsClient;

@Service
public class AiTriageService {

    /**
     * Optional Azure client. If not configured, fall back to heuristic severity detection.
     */
    private final @Nullable TextAnalyticsClient client;

    public AiTriageService(@Nullable TextAnalyticsClient client) {
        this.client = client;
    }

    public String detectSeverity(String symptoms) {
        // Heuristic fallback (works in tests/local without Azure).
        String text = (symptoms == null ? "" : symptoms).toLowerCase();

        if (text.contains("chest pain") || text.contains("breathing")) {
            return "HIGH";
        }
        if (text.contains("fever") || text.contains("vomiting")) {
            return "MEDIUM";
        }
        return "LOW";
    }
}
