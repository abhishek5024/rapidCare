const BASE_URL = "http://localhost:8081/api/emergency";

export async function getHospitalRequests(hospitalId) {
  const res = await fetch(`${BASE_URL}/hospital/${hospitalId}`);
  return res.json();
}

export async function acceptRequest(id) {
  const res = await fetch(`${BASE_URL}/${id}/accept`, {
    method: "PUT",
  });
  return res.json();
}

export async function rejectRequest(id) {
  const res = await fetch(`${BASE_URL}/${id}/reject`, {
    method: "PUT",
  });
  return res.json();
}

export async function admitRequest(id) {
  const res = await fetch(`${BASE_URL}/${id}/admit`, {
    method: "PUT",
  });
  return res.json();
}
