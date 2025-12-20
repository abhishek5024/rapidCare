import { useEffect, useState } from "react";
import {
  getHospitalRequests,
  acceptRequest,
  rejectRequest,
  admitRequest,
} from "../api/hospitalApi";
import "../styles/emergency.css";

function getSeverityClass(severity) {
  if (severity === "HIGH") return "severity-high";
  if (severity === "MEDIUM") return "severity-medium";
  return "severity-low";
}

export default function HospitalDashboard() {
  const [requests, setRequests] = useState([]);
  const hospitalId = "HOSP001"; // demo hospital

  const loadData = async () => {
    const data = await getHospitalRequests(hospitalId);
    setRequests(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    if (action === "accept") await acceptRequest(id);
    if (action === "reject") await rejectRequest(id);
    if (action === "admit") await admitRequest(id);
    loadData();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🏥 Hospital Emergency Dashboard</h2>

      {requests.length === 0 && <p>No emergency requests.</p>}

      {requests.map((req) => (
        <div key={req.id} className="result-card">
          <p><strong>👤 Patient:</strong> {req.patientName}</p>

          <p>
            <strong>Severity:</strong>{" "}
            <span className={getSeverityClass(req.severity)}>
              {req.severity}
            </span>
          </p>

          <p><strong>Symptoms:</strong> {req.symptoms}</p>

          <p><strong>Status:</strong> {req.status}</p>

          <div style={{ marginTop: "12px" }}>
            {req.status === "PENDING" && (
              <>
                <button onClick={() => handleAction(req.id, "accept")}>
                  ✅ Accept
                </button>{" "}
                <button onClick={() => handleAction(req.id, "reject")}>
                  ❌ Reject
                </button>
              </>
            )}

            {req.status === "ACCEPTED" && (
              <button onClick={() => handleAction(req.id, "admit")}>
                🏥 Admit Patient
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
