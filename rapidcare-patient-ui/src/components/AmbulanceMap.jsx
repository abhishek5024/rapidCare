import { useEffect, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/ambulance.css";

function dist(aLat, aLng, bLat, bLng) {
  if ([aLat, aLng, bLat, bLng].some((v) => typeof v !== "number")) return Number.POSITIVE_INFINITY;
  const dLat = aLat - bLat;
  const dLng = aLng - bLng;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

const mapContainerStyle = {
  width: "100%",
  height: "340px",
  borderRadius: "14px",
};

export default function AmbulanceMap({ request, onSimulatedUpdate, onConfirmPickedUp }) {
  const shouldShow = request && ["IN_TRANSIT", "ARRIVING", "PICKED_UP"].includes(request.status);

  const hospitalLat = request?.hospitalLat;
  const hospitalLng = request?.hospitalLng;
  const patientLat = request?.patientLat;
  const patientLng = request?.patientLng;
  const ambLat = request?.ambulanceLat;
  const ambLng = request?.ambulanceLng;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "rapidcare-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const hospitalPos = useMemo(() => {
    if ([hospitalLat, hospitalLng].some((v) => typeof v !== "number")) return null;
    return { lat: hospitalLat, lng: hospitalLng };
  }, [hospitalLat, hospitalLng]);

  const patientPos = useMemo(() => {
    if ([patientLat, patientLng].some((v) => typeof v !== "number")) return null;
    return { lat: patientLat, lng: patientLng };
  }, [patientLat, patientLng]);

  const ambulancePos = useMemo(() => {
    if ([ambLat, ambLng].some((v) => typeof v !== "number")) return null;
    return { lat: ambLat, lng: ambLng };
  }, [ambLat, ambLng]);

  // Demo-only movement loop (kept for stability in demos). Real movement can come from backend later.
  useEffect(() => {
    if (!shouldShow) return;
    if (typeof onSimulatedUpdate !== "function") return;

    const isToPatient = request.status === "IN_TRANSIT";
    const isToHospital = request.status === "PICKED_UP";

    const target = isToPatient ? patientPos : isToHospital ? hospitalPos : null;
    if (!target || !ambulancePos) return;

    const tick = () => {
      const step = 0.12;
      const nextLat = ambulancePos.lat + (target.lat - ambulancePos.lat) * step;
      const nextLng = ambulancePos.lng + (target.lng - ambulancePos.lng) * step;

      const remaining = dist(nextLat, nextLng, target.lat, target.lng);

      let nextStatus = request.status;
      if (request.status === "IN_TRANSIT" && remaining < 0.0006) nextStatus = "ARRIVING";

      onSimulatedUpdate({ ambulanceLat: nextLat, ambulanceLng: nextLng, status: nextStatus });
    };

    const t = window.setInterval(tick, 3000);
    return () => window.clearInterval(t);
  }, [shouldShow, onSimulatedUpdate, patientPos, hospitalPos, ambulancePos, request?.status]);

  if (!shouldShow) return null;

  if (!import.meta.env.VITE_GOOGLE_MAPS_KEY) {
    return (
      <section className="am-card" aria-label="Ambulance tracking">
        <div className="am-title">🚑 Live Ambulance Tracking</div>
        <div className="am-hint">
          Missing <code>VITE_GOOGLE_MAPS_KEY</code>. Add it to <code>rapidcare-patient-ui/.env</code>
          and restart the frontend.
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="am-card" aria-label="Ambulance tracking">
        <div className="am-title">🚑 Live Ambulance Tracking</div>
        <div className="am-hint">Google Maps failed to load. Check API key + referrer restriction.</div>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className="am-card" aria-label="Ambulance tracking">
        <div className="am-title">🚑 Live Ambulance Tracking</div>
        <div className="am-hint">Loading map…</div>
      </section>
    );
  }

  // Prefer centering on ambulance; fallback to patient/hospital if needed.
  const center = ambulancePos || patientPos || hospitalPos;
  if (!center) return null;

  return (
    <section className="am-card" aria-label="Ambulance tracking">
      <div className="am-title">🚑 Live Ambulance Tracking</div>
      <div className="am-subtitle">Real Google Map (demo mode). Updates every few seconds.</div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {hospitalPos && <Marker position={hospitalPos} label="H" />}
        {patientPos && <Marker position={patientPos} label="P" />}
        {ambulancePos && <Marker position={ambulancePos} label="A" />}
      </GoogleMap>

      {request.status === "ARRIVING" && (
        <button
          type="button"
          className="am-primary-btn"
          onClick={() => onConfirmPickedUp?.()}
        >
          ✅ I’m seated in the ambulance
        </button>
      )}

      <div className="am-hint">
        {request.status === "PICKED_UP"
          ? "Heading to hospital now."
          : request.status === "ARRIVING"
            ? "Ambulance has reached you — confirm when you’re seated."
            : "Ambulance is on the way to your location."}
      </div>
    </section>
  );
}
