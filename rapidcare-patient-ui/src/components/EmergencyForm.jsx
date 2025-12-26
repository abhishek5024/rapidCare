import { useEffect, useRef, useState } from "react";
import "../styles/emergency.css";

export default function EmergencyForm({ onSubmit, isSubmitting }) {
  const [symptoms, setSymptoms] = useState("");
  const [conscious, setConscious] = useState(true);
  const [locationText, setLocationText] = useState(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation)
      return "Location not supported";
    return "Detecting location...";
  });
  const [coords, setCoords] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocationText(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
      },
      () => {
        setLocationText("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({
      symptoms,
      conscious,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  };

  return (
    <form className="em-card" onSubmit={submit} aria-label="Emergency input">
      <div className="em-card-title">🩺 Describe the emergency</div>

      <label className="em-label" htmlFor="em-symptoms">
        Symptoms (required)
      </label>
      <textarea
        id="em-symptoms"
        ref={textareaRef}
        className="em-textarea"
        placeholder="Describe symptoms (e.g. chest pain, sweating)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        rows={5}
        disabled={isSubmitting}
        required
      />

      <div className="em-row">
        <label className="em-radio">
          <input
            type="radio"
            checked={conscious === true}
            onChange={() => setConscious(true)}
            disabled={isSubmitting}
          />
          <span>Patient is conscious</span>
        </label>

        <label className="em-radio">
          <input
            type="radio"
            checked={conscious === false}
            onChange={() => setConscious(false)}
            disabled={isSubmitting}
          />
          <span>Patient is unconscious</span>
        </label>
      </div>

      <div className="em-location">
        <div className="em-location-title">
          📍 Location detected automatically
        </div>
        <div className="em-location-value">{locationText}</div>
      </div>

      <button className="em-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="em-btn-loading">
            <span className="em-spinner" aria-hidden="true" />
            Contacting hospitals…
          </span>
        ) : (
          "🚨 Send Emergency Request"
        )}
      </button>

      <div className="em-help">
        AI-powered triage will assess severity and notify nearby hospitals
        instantly.
      </div>
    </form>
  );
}
