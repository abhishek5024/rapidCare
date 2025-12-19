package com.rapidcare.model;
import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "emergency_requests")
@Data
public class EmergencyRequest {

    @Id
    private String id;

    private String patientName;
    private String symptoms;
    private String severity;
    private String status; // PENDING, ACCEPTED, REJECTED, PREPARING

    private String hospitalId;
    private Instant createdAt = Instant.now();
    private List<String> aiReasons;
    private List<String> aiEntities;

}
