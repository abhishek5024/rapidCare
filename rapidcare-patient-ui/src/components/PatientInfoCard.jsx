import { useMemo } from "react";
import "../styles/emergency.css";

export default function PatientInfoCard() {
  const profile = useMemo(() => {
    const name =
      localStorage.getItem("name") || localStorage.getItem("patientName") || "Patient";
    const phone = localStorage.getItem("phone") || "—";
    return { name, phone };
  }, []);

  return (
    <section className="em-card" aria-label="Patient details">
      <div className="em-card-title">👤 Patient Details</div>
      <div className="em-kv">
        <div className="em-k">Name</div>
        <div className="em-v">{profile.name}</div>
      </div>
      <div className="em-kv">
        <div className="em-k">Phone</div>
        <div className="em-v">{profile.phone}</div>
      </div>
      <div className="em-muted">Read-only for faster, stress-free submission.</div>
    </section>
  );
}
