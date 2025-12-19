const BASE_URL = "http://localhost:8081/api/emergency";

export async function createEmergency(payload) {
  const response = await fetch(`${BASE_URL}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to create emergency request");
  }

  return response.json();
}
