package com.rapidcare.dto;

import java.util.List;

public class ClinicRecommendResponse {

    private String recommendedSpecialization;
    private List<ClinicResult> clinics;

    public ClinicRecommendResponse() {
    }

    public ClinicRecommendResponse(String recommendedSpecialization, List<ClinicResult> clinics) {
        this.recommendedSpecialization = recommendedSpecialization;
        this.clinics = clinics;
    }

    public String getRecommendedSpecialization() {
        return recommendedSpecialization;
    }

    public void setRecommendedSpecialization(String recommendedSpecialization) {
        this.recommendedSpecialization = recommendedSpecialization;
    }

    public List<ClinicResult> getClinics() {
        return clinics;
    }

    public void setClinics(List<ClinicResult> clinics) {
        this.clinics = clinics;
    }

    public static class ClinicResult {
        private String id;
        private String name;
        private String address;
        private String contact;
        private double distanceKm;
        private double rating;
        private Double lat;
        private Double lng;

        public ClinicResult() {
        }

        public ClinicResult(String id, String name, String address, String contact, double distanceKm, double rating, Double lat, Double lng) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.contact = contact;
            this.distanceKm = distanceKm;
            this.rating = rating;
            this.lat = lat;
            this.lng = lng;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getContact() {
            return contact;
        }

        public void setContact(String contact) {
            this.contact = contact;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public void setDistanceKm(double distanceKm) {
            this.distanceKm = distanceKm;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
        }

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLng() {
            return lng;
        }

        public void setLng(Double lng) {
            this.lng = lng;
        }
    }
}
