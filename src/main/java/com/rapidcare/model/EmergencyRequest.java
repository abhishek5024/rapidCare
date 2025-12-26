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

    /**
     * Cosmos Mongo sharding requires the shard key to be present on every write.
     * Keep this set for the lifetime of the document.
     * For "broadcast" requests, use a constant value like "BROADCAST".
     */
    private String hospitalId; // ALWAYS "BROADCAST"

    // ✅ ACCEPTED BY
    private String acceptedHospitalId;
    private String acceptedHospitalName;
    private String acceptedHospitalAddress;

    // ❌ REJECTION
    private String rejectionReason;

    private List<String> aiEntities;
    private List<String> aiReasons;

    private Instant createdAt = Instant.now();



    // public void setHospitalAddress(String string) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'setHospitalAddress'");
    // }

}
