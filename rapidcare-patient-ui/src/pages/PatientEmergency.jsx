import { useEffect, useMemo, useRef, useState } from "react";
import PatientTopBar from "../components/PatientTopBar";
import PatientInfoCard from "../components/PatientInfoCard";
import EmergencyForm from "../components/EmergencyForm";
import { EmergencyResult } from "../components/EmergencyResult";
import LiveStatusCard from "../components/LiveStatusCard";
import AmbulanceMap from "../components/AmbulanceMap";
import { createEmergency, pickedUpRequest } from "../api/emergencyApi";
import "../styles/emergency.css";

export default function PatientEmergency() {
  const [request, setRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const statusRef = useRef(null);
  const lastStatusRef = useRef(null);

  const patient = useMemo(() => {
    const name =
      localStorage.getItem("name") || localStorage.getItem("patientName") || "Patient";
    const phone = localStorage.getItem("phone") || "";
    const patientId = localStorage.getItem("userId") || "";
    return { name, phone, patientId };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const submitEmergency = async ({ symptoms, conscious, lat, lng }) => {
    try {
      if (!symptoms || !symptoms.trim()) {
        showToast("Please enter symptoms");
        return;
      }

      setIsSubmitting(true);
      setRequest(null);

      const res = await createEmergency({
        patientId: patient.patientId || undefined,
        patientName: patient.name,
        patientPhone: patient.phone || undefined,
        symptoms: symptoms.trim(),
        conscious,
        lat,
        lng,
      });

      setRequest(res);
      lastStatusRef.current = res?.status;
      showToast("✅ Emergency request submitted. Notifying nearby hospitals...");

      // auto-scroll to status section
      setTimeout(() => {
        statusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      showToast(err?.message || "Failed to submit emergency request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subscribe to server-sent events for live emergency updates
  useEffect(() => {
    if (!request?.id) return;

    const eventSource = new EventSource(
      `http://localhost:8081/api/stream/emergency/${request.id}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRequest(data);
      } catch {
        // ignore
      }
    };

    eventSource.onerror = () => {
      // Keep quiet; page should stay calm.
    };

    return () => eventSource.close();
  }, [request?.id]);

  // Auto-scroll on status changes
  useEffect(() => {
    const next = request?.status;
    if (!next) return;

    if (lastStatusRef.current && lastStatusRef.current !== next) {
      setTimeout(() => {
        statusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }

    lastStatusRef.current = next;
  }, [request?.status]);

  const onSimulatedAmbulanceUpdate = (patch) => {
    setRequest((prev) => {
      if (!prev) return prev;
      return { ...prev, ...patch };
    });
  };

  const confirmPickedUp = async () => {
    try {
      if (!request?.id) return;
      const updated = await pickedUpRequest(request.id);
      setRequest(updated);
      showToast("✅ Confirmed. Heading to hospital now...");
    } catch (err) {
      showToast(err?.message || "Failed to confirm pickup");
    }
  };

  return (
    <div className="em-page">
      <PatientTopBar />

      <header className="em-hero">
        <div className="em-hero-title">🚑 Emergency Medical Assistance</div>
        <div className="em-hero-subtitle">
          AI-powered triage | Nearby hospitals notified instantly
        </div>
      </header>

      <main className="em-container">
        <div className="em-grid">
          <div className="em-col">
            <PatientInfoCard />
            <EmergencyForm onSubmit={submitEmergency} isSubmitting={isSubmitting} />
          </div>

          <div className="em-col" ref={statusRef}>
            <EmergencyResult response={request} />
            <LiveStatusCard request={request} />
            <AmbulanceMap
              request={request}
              onSimulatedUpdate={onSimulatedAmbulanceUpdate}
              onConfirmPickedUp={confirmPickedUp}
            />
          </div>
        </div>
      </main>

      {toast && (
        <div className="em-toast" role="alert" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
