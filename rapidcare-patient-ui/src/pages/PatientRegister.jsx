import { useState } from "react";
import { patientRegister } from "../api/patientAuthApi";
import { useNavigate } from "react-router-dom";

export default function PatientRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await patientRegister({ name, phone, password });
      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="card">
      <h2>🧑 Patient Registration</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Phone" onChange={e => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={submit}>Register</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
