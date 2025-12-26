import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rapidcare-logo.png";
import "../styles/hospitalDashboard.css";

export default function HospitalTopBar() {
  const navigate = useNavigate();

  const info = useMemo(() => {
    const name =
      localStorage.getItem("hospitalName") ||
      localStorage.getItem("name") ||
      "Hospital";
    const phone = localStorage.getItem("phone") || "—";
    return { name, phone };
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/hospital/login", { replace: true });
  };

  const goHome = () => {
    navigate("/hospital/dashboard");
  };

  return (
    <header className="hosp-topbar">
      <div className="hosp-topbar-left">
        <button
          className="topbar-logo-btn"
          type="button"
          onClick={goHome}
          aria-label="Go to dashboard"
        >
          <img className="hosp-logo" src={logo} alt="RapidCare" />
        </button>
      </div>

      <div className="hosp-topbar-right">
        <div className="hosp-pill" title="Hospital Name">
          🏥 {info.name}
        </div>
        <div className="hosp-pill" title="Contact Number">
          📞 {info.phone}
        </div>
        <button
          className="hosp-logout"
          type="button"
          onClick={onLogout}
          title="Logout"
        >
          🔓 Logout
        </button>
      </div>
    </header>
  );
}
