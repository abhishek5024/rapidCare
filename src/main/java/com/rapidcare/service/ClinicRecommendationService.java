package com.rapidcare.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rapidcare.dto.ClinicRecommendRequest;
import com.rapidcare.dto.ClinicRecommendResponse;
import com.rapidcare.model.Hospital;
import com.rapidcare.repository.HospitalRepository;
import com.rapidcare.util.GeoUtil;

@Service
public class ClinicRecommendationService {

    private final MedicalTextAIService medicalTextAIService;
    private final HospitalRepository hospitalRepository;

    public ClinicRecommendationService(MedicalTextAIService medicalTextAIService, HospitalRepository hospitalRepository) {
        this.medicalTextAIService = medicalTextAIService;
        this.hospitalRepository = hospitalRepository;
    }

    public ClinicRecommendResponse recommend(ClinicRecommendRequest req) {
        if (req == null) {
            throw new IllegalArgumentException("payload is required");
        }
        if (req.getDisease() == null || req.getDisease().isBlank()) {
            throw new IllegalArgumentException("disease is required");
        }
        if (req.getLat() == null || req.getLng() == null) {
            throw new IllegalArgumentException("lat/lng is required");
        }

        String combined = req.getDisease();
        if (req.getSymptoms() != null && !req.getSymptoms().isBlank()) {
            combined = combined + ". Symptoms: " + req.getSymptoms();
        }

        Map<String, Object> ai = medicalTextAIService.analyzeMedicalText(combined);
        String severity = String.valueOf(ai.getOrDefault("severity", "LOW"));

        String specialization = inferSpecialization(ai, combined);

        // For clinic finder, if AI says HIGH, we still return clinics but also steer user toward emergency.
        // (UI can show a banner "Consider Emergency".)
        @SuppressWarnings("unused")
        boolean emergencySuggested = "HIGH".equalsIgnoreCase(severity);

        List<Hospital> all = hospitalRepository.findAll();

        double maxKm = specialization.equalsIgnoreCase("Emergency") ? 20.0 : 10.0;

        List<ScoredHospital> withinRadius = new ArrayList<>();
        for (Hospital h : all) {
            // skip if we don't have geo coordinates
            double hLat = h.getLatitude();
            double hLng = h.getLongitude();
            if (hLat == 0.0 && hLng == 0.0) {
                continue;
            }

            double dKm = GeoUtil.distanceKm(req.getLat(), req.getLng(), hLat, hLng);
            if (dKm <= maxKm) {
                double rating = 4.2; // fallback until ratings exist in DB
                double score = scoreHospital(dKm, rating, specialization, h);
                withinRadius.add(new ScoredHospital(h, dKm, rating, score));
            }
        }

        List<ClinicRecommendResponse.ClinicResult> clinics = withinRadius.stream()
                .sorted(Comparator.comparingDouble(ScoredHospital::score).reversed())
                .limit(10)
                .map(s -> new ClinicRecommendResponse.ClinicResult(
                        s.hospital().getId(),
                        safeName(s.hospital()),
                        safeAddress(s.hospital()),
                        safePhone(s.hospital()),
                        round1(s.distanceKm()),
                        s.rating(),
                        s.hospital().getLatitude(),
                        s.hospital().getLongitude()))
                .collect(Collectors.toList());

        return new ClinicRecommendResponse(specialization, clinics);
    }

    private static String inferSpecialization(Map<String, Object> ai, String text) {
        // If the upstream AI already returns a domain/specialization in the future, prefer it.
        Object domain = ai.get("specialization");
        if (domain != null) {
            String s = String.valueOf(domain).trim();
            if (!s.isEmpty()) return s;
        }

        String t = text.toLowerCase(Locale.ROOT);
        if (t.contains("skin") || t.contains("rash") || t.contains("itch") || t.contains("acne")) return "Dermatology";
        if (t.contains("knee") || t.contains("joint") || t.contains("bone") || t.contains("fracture")) return "Orthopedic";
        if (t.contains("ear") || t.contains("throat") || t.contains("nose") || t.contains("sinus")) return "ENT";
        if (t.contains("tooth") || t.contains("dental") || t.contains("gum")) return "Dental";
        if (t.contains("pregnan") || t.contains("period") || t.contains("gynec")) return "Gynecology";
        if (t.contains("chest") || t.contains("breath") || t.contains("heart")) return "Cardiology";
        return "General Physician";
    }

    private static double scoreHospital(double distanceKm, double rating, String specialization, Hospital h) {
        // Simple weighted ranking:
        // - distance (closer is better)
        // - rating (higher is better)
        // - match bonus: if hospital 'type/location/name' hints at specialization (best-effort)
        double distanceScore = Math.max(0, 10.0 - distanceKm); // 0..10
        double ratingScore = Math.max(0, Math.min(5.0, rating)); // 0..5

        String hay = (safeName(h) + " " + safeLocation(h) + " " + safeType(h)).toLowerCase(Locale.ROOT);
        double matchBonus = hay.contains(specialization.toLowerCase(Locale.ROOT)) ? 2.0 : 0.0;

        return (distanceScore * 1.6) + (ratingScore * 1.2) + matchBonus;
    }

    private static String safeName(Hospital h) {
        if (h == null) return "Hospital";
        if (h.getName() != null && !h.getName().isBlank()) return h.getName();
        if (h.getHospitalName() != null && !h.getHospitalName().isBlank()) return h.getHospitalName();
        return "Hospital";
    }

    private static String safePhone(Hospital h) {
        return h != null && h.getPhone() != null ? h.getPhone() : "";
    }

    private static String safeAddress(Hospital h) {
        if (h == null) return "";
        if (h.getAddress() != null && !h.getAddress().isBlank()) return h.getAddress();
        return safeLocation(h);
    }

    private static String safeLocation(Hospital h) {
        return h != null && h.getLocation() != null ? h.getLocation() : "";
    }

    private static String safeType(Hospital h) {
        return h != null && h.getType() != null ? h.getType() : "";
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private record ScoredHospital(Hospital hospital, double distanceKm, double rating, double score) {
    }
}
