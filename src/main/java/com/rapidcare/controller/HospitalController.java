package com.rapidcare.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rapidcare.model.Hospital;
import com.rapidcare.service.HospitalService;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @PostMapping
    public Hospital create(@RequestBody Hospital hospital) {
        return service.create(hospital);
    }

    @GetMapping
    public List<Hospital> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/prepare-bed")
    public Hospital prepareBed(@PathVariable String id) {
        return service.prepareBed(id);
    }
    
}
