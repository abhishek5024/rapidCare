import { useEffect, useMemo, useState } from "react";
import {
  getHospitalRequests,
  acceptRequest,
  rejectRequest,
  admitRequest,
  referRequest,
  inTransitRequest,
} from "../api/emergencyApi";
import HospitalTopBar from "../components/HospitalTopBar";
import "../styles/hospitalDashboard.css";

function getSeverityUi(severity) {
  const s = String(severity || "").toUpperCase();
  if (s === "HIGH") return { text: "RED", cls: "sev-badge sev-red" };
  if (s === "MEDIUM") return { text: "ORANGE", cls: "sev-badge sev-orange" };
  return { text: "GREEN", cls: "sev-badge sev-green" };
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function summarizeSymptoms(text) {
  if (!text) return "";
  const t = String(text).trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t;
}

export default function HospitalDashboard() {
  const [requests, setRequests] = useState([]);

  const hospitalId = useMemo(() => localStorage.getItem("hospitalId"), []);
  const hospitalName = useMemo(
    () => localStorage.getItem("hospitalName") || localStorage.getItem("name") || "Hospital",
    []
  );

  useEffect(() => {
    if (!hospitalId) return;

    let active = true;

    const fetchData = async () => {
      try {
        const data = await getHospitalRequests(hospitalId);
        if (active) setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load requests", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [hospitalId]);

  const handleAction = async (id, action) => {
    try {
      if (action === "accept") {
        await acceptRequest(id, hospitalId, hospitalName);
      } else if (action === "reject") {
        await rejectRequest(id);
      } else if (action === "in_transit") {
        await inTransitRequest(id);
      } else if (action === "admit") {
        await admitRequest(id);
      } else if (action === "refer") {
        await referRequest(id);
      }

      // refresh quickly after an action
      const data = await getHospitalRequests(hospitalId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const pending = requests.filter(r => r.status === "PENDING");
  const accepted = requests.filter(r => r.status === "ACCEPTED");
  const admitted = requests.filter(r => r.status === "ADMITTED");
  const referred = requests.filter(r => r.status === "PENDING" && r.acceptedHospitalId == null);

  // Live popup = newest pending (basic)
  const liveRequest = pending[0] || null;

  return (
    <div className="hosp-page">
      <HospitalTopBar />

      {!hospitalId ? (
        <div className="hosp-container">
          <p>Hospital not logged in.</p>
        </div>
      ) : (
        <div className="hosp-container">
          {/* Dashboard Panels */}
          <div className="hosp-panels">
            <div className="hosp-panel">
              <div className="hosp-panel-title">📥 Incoming Requests</div>
              <div className="hosp-panel-value">{requests.length}</div>
            </div>
            <div className="hosp-panel">
              <div className="hosp-panel-title">🕒 Pending</div>
              <div className="hosp-panel-value">{pending.length}</div>
            </div>
            <div className="hosp-panel">
              <div className="hosp-panel-title">🟢 Accepted</div>
              <div className="hosp-panel-value">{accepted.length}</div>
            </div>
            <div className="hosp-panel">
              <div className="hosp-panel-title">🏥 Admitted</div>
              <div className="hosp-panel-value">{admitted.length}</div>
            </div>
            <div className="hosp-panel">
              <div className="hosp-panel-title">🔁 Referred</div>
              <div className="hosp-panel-value">{Math.max(0, referred.length - pending.length)}</div>
            </div>
          </div>

          {/* Live Emergency Popup */}
          {liveRequest && (
            <div className="hosp-popup-overlay">
              <div className="hosp-popup">
                <div className="hosp-popup-title">🚨 New Emergency Request</div>

                <div className="hosp-popup-row">
                  <div className="hosp-popup-label">Patient Name</div>
                  <div className="hosp-popup-value">{liveRequest.patientName || "—"}</div>
                </div>

                <div className="hosp-popup-row">
                  <div className="hosp-popup-label">Severity</div>
                  <div className="hosp-popup-value">
                    <span className={getSeverityUi(liveRequest.severity).cls}>
                      {getSeverityUi(liveRequest.severity).text}
                    </span>
                  </div>
                </div>

                <div className="hosp-popup-row">
                  <div className="hosp-popup-label">Symptoms</div>
                  <div className="hosp-popup-value">{summarizeSymptoms(liveRequest.symptoms) || "—"}</div>
                </div>

                <div className="hosp-popup-actions">
                  <button
                    className="req-btn req-accept"
                    type="button"
                    onClick={() => handleAction(liveRequest.id, "accept")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="req-btn req-reject"
                    type="button"
                    onClick={() => handleAction(liveRequest.id, "reject")}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Request Cards */}
          <div className="hosp-grid">
            <section className="hosp-section">
              <h3 className="hosp-section-title">🕒 Pending</h3>
              {pending.length === 0 && <div>No pending requests.</div>}
              {pending.map(req => (
                <div key={req.id} className="req-card">
                  <div className="req-head">
                    <div className="req-patient">👤 {req.patientName || "Patient"}</div>
                    <div className="req-meta">
                      <span className={getSeverityUi(req.severity).cls}>{getSeverityUi(req.severity).text}</span>
                      <span className="req-time">{formatTime(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className="req-symptoms">{summarizeSymptoms(req.symptoms)}</div>

                  <div className="req-actions">
                    <button className="req-btn req-accept" type="button" onClick={() => handleAction(req.id, "accept")}>✅ Accept</button>
                    <button className="req-btn req-reject" type="button" onClick={() => handleAction(req.id, "reject")}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </section>

            <section className="hosp-section">
              <h3 className="hosp-section-title">🟢 Accepted</h3>
              {accepted.length === 0 && <div>No accepted requests.</div>}
              {accepted.map(req => (
                <div key={req.id} className="req-card">
                  <div className="req-head">
                    <div className="req-patient">👤 {req.patientName || "Patient"}</div>
                    <div className="req-meta">
                      <span className={getSeverityUi(req.severity).cls}>{getSeverityUi(req.severity).text}</span>
                      <span className="req-time">{formatTime(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className="req-symptoms">{summarizeSymptoms(req.symptoms)}</div>

                  <div className="req-actions">
                    <button className="req-btn req-admit" type="button" onClick={() => handleAction(req.id, "in_transit")}>🚑 In Transit</button>
                    <button className="req-btn req-admit" type="button" onClick={() => handleAction(req.id, "admit")}>🏥 Admit</button>
                    <button className="req-btn req-refer" type="button" onClick={() => handleAction(req.id, "refer")}>🔁 Refer</button>
                  </div>
                </div>
              ))}
            </section>

            <section className="hosp-section">
              <h3 className="hosp-section-title">🏥 Admitted</h3>
              {admitted.length === 0 && <div>No admitted requests.</div>}
              {admitted.map(req => (
                <div key={req.id} className="req-card">
                  <div className="req-head">
                    <div className="req-patient">👤 {req.patientName || "Patient"}</div>
                    <div className="req-meta">
                      <span className={getSeverityUi(req.severity).cls}>{getSeverityUi(req.severity).text}</span>
                      <span className="req-time">{formatTime(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className="req-symptoms">{summarizeSymptoms(req.symptoms)}</div>
                </div>
              ))}
            </section>

            <section className="hosp-section">
              <h3 className="hosp-section-title">🔁 Referred</h3>
              <div>Referred requests will reappear as Pending (broadcast) in the system.</div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
