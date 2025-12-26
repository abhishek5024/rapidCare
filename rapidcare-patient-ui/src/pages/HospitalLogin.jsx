import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { hospitalLogin } from "../api/hospitalAuthApi";
import "../styles/auth.css";

export default function HospitalLogin() {
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

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (isLoading) return;

    try {
      if (!phone || !password) {
        showToast("Please enter phone number and password");
        return;
      }

      setIsLoading(true);
      const res = await hospitalLogin(phone, password);

      // Some backends return hospitalId/hospitalName, others return id/name
      const id = res.hospitalId ?? res.id;
      const name = res.hospitalName ?? res.name;

      // save auth state (existing keys)
      if (id) localStorage.setItem("hospitalId", id);
      if (name) localStorage.setItem("hospitalName", name);

      // Standard keys used by UserProfile
      localStorage.setItem("phone", res.phone ?? phone);
      localStorage.setItem("role", "HOSPITAL");
      localStorage.setItem("name", name ?? "Hospital");

      if (id) localStorage.setItem("userId", id);

      navigate("/hospital/dashboard");
    } catch (err) {
      showToast(err?.message || "Invalid credentials");
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
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>🏥 Hospital Login</h2>

          <label className="auth-label" htmlFor="hospital-phone">
            Phone Number
          </label>
          <input
            id="hospital-phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />

          <label className="auth-label" htmlFor="hospital-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              🔒
            </span>
            <input
              id="hospital-password"
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
            New user?{" "}
            <Link to="/hospital/register" className="auth-footer-link">
              Register
            </Link>
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
