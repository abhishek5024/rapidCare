package com.rapidcare.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.rapidcare.model.EmergencyRequest;

@RestController
@RequestMapping("/api/stream")
public class EmergencySseController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping("/emergency/{id}")
    public SseEmitter stream(@PathVariable String id) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.put(id, emitter);

        emitter.onCompletion(() -> emitters.remove(id));
        emitter.onTimeout(() -> emitters.remove(id));

        return emitter;
    }

    public void notifyStatus(String id, EmergencyRequest req) {
        SseEmitter emitter = emitters.get(id);
        if (emitter != null) {
            try {
                emitter.send(req);
            } catch (Exception e) {
                emitters.remove(id);
            }
        }
    }
}
