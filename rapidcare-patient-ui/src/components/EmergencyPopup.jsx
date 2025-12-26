export default function EmergencyPopup({ request, onAction }) {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>🚨 New Emergency</h3>

        <p><b>Patient:</b> {request.patientName}</p>

        <p>
          <b>Severity:</b>{" "}
          <span className={`severity-${request.severity.toLowerCase()}`}>
            {request.severity}
          </span>
        </p>

        <p><b>Symptoms:</b> {request.symptoms}</p>

        <div className="popup-actions">
          <button onClick={() => onAction(request.id, "accept")} className="btn-accept">
            ✅ Accept
          </button>

          <button onClick={() => onAction(request.id, "reject")} className="btn-reject">
            ❌ Reject
          </button>

          <button onClick={() => onAction(request.id, "refer")} className="btn-refer">
            🔁 Refer
          </button>
        </div>
      </div>
    </div>
  );
}
