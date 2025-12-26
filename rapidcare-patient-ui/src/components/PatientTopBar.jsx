import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rapidcare-logo.png";
import "../styles/patientHome.css";

export default function PatientTopBar() {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    const name = localStorage.getItem("name") || localStorage.getItem("patientName") || "Patient";
    const phone = localStorage.getItem("phone") || "";
    return { name, phone };
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <header className="patient-topbar">
      <div className="patient-topbar-left">
        <button className="topbar-logo-btn" type="button" onClick={goHome} aria-label="Go to home">
          <img className="patient-logo" src={logo} alt="RapidCare" />
        </button>
      </div>

      <div className="patient-topbar-right">
        <div className="patient-topbar-item" title="Patient Name">
          <span className="patient-topbar-icon">👤</span>
          <span className="patient-topbar-text">{profile.name}</span>
        </div>

        <div className="patient-topbar-item" title="Phone Number">
          <span className="patient-topbar-icon">📞</span>
          <span className="patient-topbar-text">{profile.phone || "—"}</span>
        </div>

        <button className="patient-topbar-logout" type="button" onClick={onLogout} title="Logout">
          🔓
        </button>
      </div>
    </header>
  );
}
