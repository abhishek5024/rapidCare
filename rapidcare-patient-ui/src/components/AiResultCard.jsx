import RiskBadge from "./RiskBadge";
import "../styles/aiMedical.css";

export default function AiResultCard({ result, onEmergency }) {
  if (!result) return null;

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <div className="ai-card-title">🧠 AI Summary</div>
        <RiskBadge level={result.riskLevel} />
      </div>

      <p className="ai-card-text">
        Based on your input, this appears to be a{" "}
        <b>{String(result.riskLevel || "LOW").toUpperCase()}</b>-risk condition.
      </p>

      <div className="ai-section">
        <div className="ai-section-title">🧾 Detected Symptoms</div>
        <ul className="ai-list">
          {(result.entities || []).map((e, idx) => (
            <li key={`${e}-${idx}`}>{e}</li>
          ))}
          {(!result.entities || result.entities.length === 0) && <li>—</li>}
        </ul>
      </div>

      <div className="ai-section">
        <div className="ai-section-title">📌 AI Guidance</div>
        <div className="ai-card-text">{result.recommendation || "—"}</div>
      </div>

      <div className="ai-section">
        <div className="ai-section-title">🚨 Emergency Check</div>
        {result.emergency ? (
          <>
            <div className="ai-warning">
              ⚠️ Your symptoms may require urgent care.
            </div>
            <button className="ai-emergency-btn" type="button" onClick={onEmergency}>
              🚑 Request Emergency Help
            </button>
          </>
        ) : (
          <div className="ai-ok">No emergency indicators detected.</div>
        )}
      </div>
    </div>
  );
}
