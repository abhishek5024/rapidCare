import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientTopBar from "../components/PatientTopBar";
import { recommendClinics } from "../api/clinicApi";
import "../styles/findClinic.css";

function kmLabel(v) {
  if (v == null) return "";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `${n.toFixed(1)} km`;
}

function displayAddress(c) {
  return c?.address && String(c.address).trim() ? c.address : "Address not available";
}

export default function FindClinic() {
  const navigate = useNavigate();

  const [disease, setDisease] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [useLocation, setUseLocation] = useState(true);
  const [coords, setCoords] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [result, setResult] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  };

  const locationStatus = useMemo(() => {
    if (!useLocation) return "Location disabled";
    if (!coords) return "Not detected yet";
    return `Detected: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }, [coords, useLocation]);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported in this browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
      },
      () => {
        showToast("Unable to access location. Please allow GPS permissions.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const findClinics = async (e) => {
    e?.preventDefault();
    if (isLoading) return;

    if (!disease.trim()) {
      showToast("Please enter your disease/problem");
      return;
    }

    if (useLocation && !coords) {
      showToast("Please detect your location first");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        disease: disease.trim(),
        symptoms: symptoms.trim() || null,
        lat: useLocation ? coords.lat : null,
        lng: useLocation ? coords.lng : null,
      };

      const res = await recommendClinics(payload);
      setResult(res);

      // if backend recommends Emergency, steer user to emergency flow
      if (String(res?.recommendedSpecialization || "").toLowerCase() === "emergency") {
        showToast("AI suggests emergency care. Consider creating an Emergency Request.");
      }
    } catch (err) {
      showToast(err?.message || "Failed to find clinics");
    } finally {
      setIsLoading(false);
    }
  };

  const openMaps = ({ lat, lng, name, address }) => {
    const hasCoords = lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

    if (hasCoords) {
      // Pinpoint navigation to exact coordinates
      const destination = `${lat},${lng}`;
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    // Fallback: name/address search
    const q = encodeURIComponent([name, address].filter(Boolean).join(" ") || name || "clinic");
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="findclinic-page">
      <PatientTopBar />

      <main className="findclinic-container">
        <div className="findclinic-header">
          <button
            className="findclinic-back"
            type="button"
            onClick={() => navigate("/home")}
            title="Back"
          >
            ←
          </button>
          <h1 className="findclinic-title">Find Best Clinic Near Me</h1>
        </div>

        <form className="findclinic-card" onSubmit={findClinics}>
          <label className="findclinic-label" htmlFor="disease">
            Disease / Problem
          </label>
          <input
            id="disease"
            className="findclinic-input"
            placeholder='e.g., "Skin allergy"'
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            disabled={isLoading}
          />

          <label className="findclinic-label" htmlFor="symptoms">
            Symptoms (optional)
          </label>
          <textarea
            id="symptoms"
            className="findclinic-textarea"
            placeholder='e.g., "Itching and redness"'
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={isLoading}
            rows={4}
          />

          <div className="findclinic-row">
            <label className="findclinic-checkbox">
              <input
                type="checkbox"
                checked={useLocation}
                onChange={(e) => setUseLocation(e.target.checked)}
                disabled={isLoading}
              />
              <span>Use current location</span>
            </label>

            <button
              className="findclinic-secondary"
              type="button"
              onClick={detectLocation}
              disabled={isLoading || !useLocation}
            >
              {coords ? "Refresh GPS" : "Detect GPS"}
            </button>
          </div>

          <div className="findclinic-muted">📍 {locationStatus}</div>

          <button className="findclinic-primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="findclinic-btn-loading">
                <span className="findclinic-spinner" aria-hidden="true" />
                Finding clinics...
              </span>
            ) : (
              "🔍 Find Clinics"
            )}
          </button>
        </form>

        {result && (
          <section className="findclinic-results">
            <div className="findclinic-results-head">
              <div className="findclinic-results-title">Recommended Clinics</div>
              <div className="findclinic-results-sub">
                AI specialization: <b>{result.recommendedSpecialization}</b>
              </div>
            </div>

            <div className="findclinic-grid">
              {(result.clinics || []).map((c) => (
                <article key={c.id || c.name} className="findclinic-result-card">
                  <div className="findclinic-result-top">
                    <div className="findclinic-result-name">🏥 {c.name}</div>
                    <div className="findclinic-result-rating">⭐ {c.rating}</div>
                  </div>

                  <div className="findclinic-result-meta">📍 {kmLabel(c.distanceKm)} away</div>
                  <div className="findclinic-result-meta">🏷️ {displayAddress(c)}</div>

                  <div className="findclinic-actions">
                    {c.contact ? (
                      <a className="findclinic-call" href={`tel:${c.contact}`}>
                        📞 Call
                      </a>
                    ) : (
                      <button className="findclinic-call" type="button" disabled>
                        📞 Call
                      </button>
                    )}

                    <button
                      className="findclinic-nav"
                      type="button"
                      onClick={() => openMaps({ lat: c.lat, lng: c.lng, name: c.name, address: c.address })}
                    >
                      🧭 Navigate
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="findclinic-cta">
              <button className="findclinic-emergency" type="button" onClick={() => navigate("/emergency")}
              >
                🚨 Create Emergency Request
              </button>
            </div>
          </section>
        )}

        {toast && (
          <div className="findclinic-toast" role="alert" aria-live="polite">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
