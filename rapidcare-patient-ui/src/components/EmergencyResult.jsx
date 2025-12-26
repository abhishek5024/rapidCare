import "../styles/emergency.css";

function getSeverityClass(severity) {
  const s = String(severity || "").toUpperCase();
  if (s === "HIGH") return "severity-high";
  if (s === "MEDIUM") return "severity-medium";
  return "severity-low";
}

export function EmergencyResult({ response }) {
  if (!response) return null;

  return (
    <section className="em-card" aria-label="AI medical assessment">
      <div className="em-card-title">🤖 AI Medical Assessment</div>

      <div className="em-kv">
        <div className="em-k">Severity</div>
        <div className={`em-v ${getSeverityClass(response.severity)}`}>{response.severity}</div>
      </div>

      {response.aiEntities?.length > 0 && (
        <div className="em-list">
          <div className="em-subtitle">Detected Symptoms</div>
          <ul>
            {response.aiEntities.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="em-status-row">
        <span className="em-status-icon">📡</span>
        <span className="em-status-text">Request sent to nearby hospitals</span>
      </div>

      <div className="em-muted">
        Medical entities and severity are extracted using Azure AI Language – Healthcare Text Analytics.
      </div>
    </section>
  );
}
