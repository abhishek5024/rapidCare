import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userProfile.css";

function toDisplayRole(role) {
  if (!role) return "";
  const normalized = String(role).toUpperCase();
  if (normalized === "PATIENT") return "Patient";
  if (normalized === "HOSPITAL") return "Hospital";
  return role;
}

function guessRole() {
  const role = localStorage.getItem("role");
  if (role) return role;
  if (localStorage.getItem("hospitalId") || localStorage.getItem("hospitalName")) return "HOSPITAL";
  if (localStorage.getItem("patientLoggedIn") || localStorage.getItem("patientName")) return "PATIENT";
  return "";
}

export default function UserProfile() {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    // Requirement keys
    const nameFromStandard = localStorage.getItem("name") || "";
    const phoneFromStandard = localStorage.getItem("phone") || "";

    // Backward-compat with existing app keys
    const nameFromPatient = localStorage.getItem("patientName") || "";
    const nameFromHospital = localStorage.getItem("hospitalName") || "";

    const role = guessRole();

    const name = nameFromStandard || nameFromPatient || nameFromHospital;

    // Some flows store only phone input; keep standard key first.
    const phone = phoneFromStandard || localStorage.getItem("patientPhone") || localStorage.getItem("hospitalPhone") || "";

    return {
      name,
      phone,
      role: toDisplayRole(role)
    };
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="user-profile-card" aria-label="User profile">
      <div className="user-profile-row">
        <span className="user-profile-label">👤 Name</span>
        <span className="user-profile-value">{profile.name || "—"}</span>
      </div>

      <div className="user-profile-row">
        <span className="user-profile-label">📞 Phone number</span>
        <span className="user-profile-value">{profile.phone || "—"}</span>
      </div>

      <div className="user-profile-row">
        <span className="user-profile-label">🏷 Role</span>
        <span className="user-profile-value">{profile.role || "—"}</span>
      </div>

      <div className="user-profile-actions">
        <button className="user-profile-logout" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
