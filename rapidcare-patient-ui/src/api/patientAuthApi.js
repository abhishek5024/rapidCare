const API_BASE = "http://localhost:8081/api/patient";

/* ============================
   PATIENT AUTH
============================ */

export async function patientRegister(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Patient registration failed");
  }

  return res.json();
}

export async function patientLogin(phone, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  if (!res.ok) {
    throw new Error("Patient login failed");
  }

  return res.json();
}
