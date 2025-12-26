import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientTopBar from "../components/PatientTopBar";
import { getMyLatestEmergency } from "../api/emergencyApi";
import "./../styles/patientHome.css";

function getStatusLabel(req) {
  if (!req) return "No active request";
  if (req.status === "PENDING") return "🟡 Request Pending";
  if (req.status === "ACCEPTED") return `🟢 Accepted by ${req.acceptedHospitalName || "Hospital"}`;
  if (req.status === "IN_TRANSIT") return "🚑 Ambulance on the way";
  if (req.status === "ADMITTED") return "✅ Admitted";
  if (req.status === "REJECTED") return "❌ Rejected";
  return req.status;
}

function PatientHome() {
  const navigate = useNavigate();
  const [activeRequest, setActiveRequest] = useState(null);

  const patientId = useMemo(() => localStorage.getItem("userId") || "", []);

  useEffect(() => {
    if (!patientId) return;

    let alive = true;

    const poll = async () => {
      try {
        const latest = await getMyLatestEmergency(patientId);
        if (alive) setActiveRequest(latest || null);
      } catch {
        // Keep UI quiet (home page should not be noisy)
      }
    };

    poll();
    const t = setInterval(poll, 4000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [patientId]);

  return (
    <div className="patient-home">
      <PatientTopBar />

      <main className="patient-home-main">
        <section className="patient-actions">
          <button
            className="patient-action-card action-red"
            onClick={() => navigate("/emergency")}
            type="button"
          >
            <div className="patient-action-title">🚨 Emergency Request</div>
            <div className="patient-action-subtitle">
              AI-based triage + nearest hospitals
            </div>
          </button>

          <button
            className="patient-action-card action-blue"
            onClick={() => navigate("/ai-services")}
            type="button"
          >
            <div className="patient-action-title">🤖 AI Medical Services</div>
            <div className="patient-action-subtitle">Symptom analysis, advice</div>
          </button>

          <button
            className="patient-action-card action-green"
            onClick={() => navigate("/hospital-suggestion")}
            type="button"
          >
            <div className="patient-action-title">🏥 Find Best Clinic Near Me</div>
            <div className="patient-action-subtitle">Disease-based recommendations</div>
          </button>
        </section>

        <aside className="patient-status-panel" aria-label="Live status">
          <div className="patient-status-title">Live Status</div>
          <div className="patient-status-value">{getStatusLabel(activeRequest)}</div>
          {activeRequest?.symptoms && (
            <div className="patient-status-muted">
              <b>Symptoms:</b> {activeRequest.symptoms}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default PatientHome;
