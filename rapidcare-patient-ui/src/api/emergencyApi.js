const BASE_URL = "http://localhost:8081/api/emergency";

/* ========= PATIENT ========= */

export async function createEmergency(data) {
  const res = await fetch(`${BASE_URL}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create emergency");
  return res.json();
}

export async function getMyLatestEmergency(patientId) {
  // Expected backend endpoint: GET /api/emergency/patient/{patientId}/latest
  // If your backend uses a different route, tell me and I’ll align it.
  const res = await fetch(`${BASE_URL}/patient/${patientId}/latest`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

/* ========= HOSPITAL ========= */

export async function getHospitalRequests(hospitalId) {
  const res = await fetch(`${BASE_URL}/hospital/${hospitalId}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function acceptRequest(requestId, hospitalId, hospitalName) {
  const res = await fetch(
    `${BASE_URL}/${requestId}/accept?hospitalId=${hospitalId}&hospitalName=${encodeURIComponent(hospitalName)}`,
    { method: "PUT" }
  );
  if (!res.ok) throw new Error("Accept failed");
  return res.json();
}

export async function rejectRequest(requestId, reason = "No beds available") {
  const res = await fetch(
    `${BASE_URL}/${requestId}/reject?reason=${encodeURIComponent(reason)}`,
    { method: "PUT" }
  );
  if (!res.ok) throw new Error("Reject failed");
  return res.json();
}

export async function admitRequest(requestId) {
  const res = await fetch(`${BASE_URL}/${requestId}/admit`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Admit failed");
  return res.json();
}

export async function referRequest(requestId) {
  const res = await fetch(`${BASE_URL}/${requestId}/refer`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Refer failed");
  return res.json();
}
