const API_BASE = "http://localhost:8081/api/hospital/auth";

/* ============================
   HOSPITAL AUTH
============================ */

export async function hospitalRegister(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Hospital registration failed");
  }

  return res.json();
}

export async function hospitalLogin(phone, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password })
  });

  if (!res.ok) {
    throw new Error("Hospital login failed");
  }

  return res.json();
}
