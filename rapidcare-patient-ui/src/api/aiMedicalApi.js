const BASE_URL = "http://localhost:8081/api/ai/medical";

export async function analyzeMedicalSymptoms(payload) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("AI analysis failed");
  }

  return res.json();
}
