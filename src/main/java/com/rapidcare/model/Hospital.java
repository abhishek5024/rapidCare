package com.rapidcare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hospitals")
public class Hospital {

    @Id
    private String id;

    private String name;
    private String type; // GOVT, PRIVATE_EXPENSIVE, PRIVATE_CHEAP
    private int availableBeds;
    private boolean emergencyReady;
    private String location;

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(int availableBeds) { this.availableBeds = availableBeds; }

    public boolean isEmergencyReady() { return emergencyReady; }
    public void setEmergencyReady(boolean emergencyReady) { this.emergencyReady = emergencyReady; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
