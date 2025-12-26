const BASE_URL = "http://localhost:8081/api/clinic";

export async function recommendClinics(payload) {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Clinic recommendation failed");
  }

  return res.json();
}
