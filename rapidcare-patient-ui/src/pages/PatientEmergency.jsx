import { useState } from "react";
import { createEmergency } from "../api/emergencyApi";

function PatientEmergency() {
  const [patientName, setPatientName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSeverityColor = (severity) => {
    if (severity === "HIGH") return "red";
    if (severity === "MEDIUM") return "orange";
    return "green";
  };

  const submitEmergency = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await createEmergency({
        patientName,
        symptoms,
        hospitalId: "HOSP001" // demo hospital
      });
      setResponse(res);
    } catch (err) {
      console.error(err);
      setError("Failed to submit emergency request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h2>🚑 Emergency Request</h2>

      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Describe symptoms (e.g. chest pain, sweating)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={submitEmergency} disabled={loading}>
        {loading ? "Submitting..." : "Submit Emergency"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}>
          <h3>📊 AI Assessment Result</h3>

          <p>
            <b>Severity:</b>{" "}
            <span
              style={{
                color: getSeverityColor(response.severity),
                fontWeight: "bold"
              }}
            >
              {response.severity}
            </span>
          </p>

          <p><b>Status:</b> {response.status}</p>
          <p><b>Hospital:</b> {response.hospitalId}</p>

          {response.aiEntities && response.aiEntities.length > 0 && (
            <>
              <p><b>Detected Symptoms (AI):</b></p>
              <ul>
                {response.aiEntities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {response.aiReasons && response.aiReasons.length > 0 && (
            <>
              <p><b>AI Reasoning:</b></p>
              <ul>
                {response.aiReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </>
          )}

          <p style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
            ✅ Emergency request sent to hospital successfully
          </p>

          <p style={{ fontSize: "12px", color: "#555" }}>
            Medical entities and severity are extracted using Azure AI Language – Healthcare Text Analytics.
          </p>
        </div>
      )}
    </div>
  );
}

export default PatientEmergency;
