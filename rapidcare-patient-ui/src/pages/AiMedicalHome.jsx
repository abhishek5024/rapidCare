import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientTopBar from "../components/PatientTopBar";
import AiResultCard from "../components/AiResultCard";
import { analyzeMedicalSymptoms } from "../api/aiMedicalApi";
import "../styles/aiMedical.css";

const DURATIONS = ["< 24 hours", "1–3 days", "> 3 days"];
const SELF_SEVERITY = ["Mild", "Moderate", "Severe"];

export default function AiMedicalHome() {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    const name = localStorage.getItem("name") || localStorage.getItem("patientName") || "Patient";
    const phone = localStorage.getItem("phone") || "";
    return { name, phone };
  }, []);

  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [severity, setSeverity] = useState(SELF_SEVERITY[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onAnalyze = async () => {
    setError("");
    setResult(null);

    if (!symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeMedicalSymptoms({ symptoms, duration, severity });
      setResult(data);
    } catch (e) {
      setError(e?.message || "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <PatientTopBar />

      <div className="ai-container">
        <div className="ai-header">
          <div>
            <h2 className="ai-title">🧠 AI Medical Assistance</h2>
            <div className="ai-disclaimer">
              This AI provides guidance, not a medical diagnosis.
            </div>
          </div>

          <div className="ai-profile">
            <div>👤 {profile.name}</div>
            <div>📞 {profile.phone || "—"}</div>
          </div>
        </div>

        <div className="ai-form">
          <label className="ai-label">✍️ Describe symptoms</label>
          <textarea
            className="ai-textarea"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder='Example: "I have fever, headache and body pain for 2 days"'
            rows={5}
          />

          <div className="ai-row">
            <div className="ai-field">
              <label className="ai-label">Duration</label>
              <select className="ai-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="ai-field">
              <label className="ai-label">Self-reported severity</label>
              <select className="ai-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {SELF_SEVERITY.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="ai-error">{error}</div>}

          <button className="ai-analyze-btn" type="button" onClick={onAnalyze} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze with AI"}
          </button>
        </div>

        <AiResultCard result={result} onEmergency={() => navigate("/emergency")} />
      </div>
    </div>
  );
}
