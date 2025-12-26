import "../styles/emergency.css";

function labelForStatus(req) {
  if (!req) return "⏳ Waiting for hospital response...";

  switch (req.status) {
    case "PENDING":
      return "⏳ Waiting for hospital response...";
    case "ACCEPTED":
      return `✅ Accepted by ${req.acceptedHospitalName || "Hospital"}`;
    case "IN_TRANSIT":
      return "🚑 Ambulance on the way";
    case "ADMITTED":
      return "✅ Patient admitted";
    case "REJECTED":
      return `❌ Rejected${req.rejectionReason ? ` (${req.rejectionReason})` : ""}`;
    default:
      return String(req.status || "");
  }
}

export default function LiveStatusCard({ request }) {
  const isWaiting = !request?.status || request.status === "PENDING";

  return (
    <section className="em-card" aria-label="Live status">
      <div className="em-card-title">Live Status</div>

      <div className="em-live-status">{labelForStatus(request)}</div>

      {isWaiting && (
        <div className="em-heartbeat" aria-hidden="true">
          <div className="em-heartbeat-line" />
        </div>
      )}

      <div className="em-muted">
        Status updates stream live from the server (SSE) after you submit.
      </div>
    </section>
  );
}
