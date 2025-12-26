import { useState } from "react";
import { hospitalRegister } from "../api/hospitalAuthApi";
import { useNavigate } from "react-router-dom";

export default function HospitalRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospitalName: "",
    phone: "",
    password: "",
    address: "",
    availableBeds: 0
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await hospitalRegister(form);
      alert("Hospital registered successfully");
      navigate("/hospital/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>🏥 Hospital Registration</h2>

      <input name="hospitalName" placeholder="Hospital Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="availableBeds" type="number" placeholder="Available Beds" onChange={handleChange} />

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}
