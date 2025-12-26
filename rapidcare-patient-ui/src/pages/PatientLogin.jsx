import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { patientLogin } from "../api/patientAuthApi";
import "../styles/auth.css";

function PatientLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const navigate = useNavigate();

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const login = async (e) => {
    e?.preventDefault();
    if (isLoading) return;

    try {
      if (!phone || !password) {
        showToast("Please enter phone number and password");
        return;
      }

      setIsLoading(true);

      // ✅ real backend login
      const res = await patientLogin(phone, password);

      // Store standard keys used by UserProfile
      localStorage.setItem("role", "PATIENT");
      localStorage.setItem("phone", res.phone ?? phone);
      localStorage.setItem("name", res.name ?? "Patient");

      // Keep existing app keys (if used elsewhere)
      if (res.id) localStorage.setItem("userId", res.id);
      localStorage.setItem("patientLoggedIn", "true");
      localStorage.setItem("patientName", res.name ?? "Patient");

      navigate("/home");
    } catch (e2) {
      showToast(e2?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <section className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">RapidCare</div>
          <div className="auth-tagline">
            AI-powered emergency & medical assistance
          </div>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={login}>
          <h2>👤 Patient Login</h2>

          <label className="auth-label" htmlFor="patient-phone">
            Phone Number
          </label>
          <input
            id="patient-phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />

          <label className="auth-label" htmlFor="patient-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              🔒
            </span>
            <input
              id="patient-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="auth-input-with-icon"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner" aria-hidden="true" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <p className="auth-footer">
            New user? <Link to="/register">Register</Link>
          </p>

          {toast && (
            <div className="auth-toast" role="alert" aria-live="polite">
              {toast}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default PatientLogin;
