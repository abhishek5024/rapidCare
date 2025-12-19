function getSeverityColor(severity) {
  if (severity === "HIGH") return "red";
  if (severity === "MEDIUM") return "orange";
  return "green";
}

export function EmergencyResult({ response }) {
  if (!response) return null;

  return (
    <div className="result-card">
      <h3>📊 AI Assessment</h3>

      {/* Severity */}
      <p>
        <strong>Severity:</strong>{" "}
        <span style={{ color: getSeverityColor(response.severity), fontWeight: "bold" }}>
          {response.severity}
        </span>
      </p>

      {/* Extracted Symptoms */}
      {response.aiEntities?.length > 0 && (
        <>
          <p><strong>Detected Symptoms:</strong></p>
          <ul>
            {response.aiEntities.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {/* AI Reasoning */}
      {response.aiReasons?.length > 0 && (
        <>
          <p><strong>AI Reasoning:</strong></p>
          <ul>
            {response.aiReasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}

      {/* Status */}
      <div className="status-box">
        ✅ <strong>Request sent to hospital</strong>
        <br />
        Current status: <b>{response.status}</b>
      </div>
    </div>
  );
}
