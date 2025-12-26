import "../styles/aiMedical.css";

export default function RiskBadge({ level }) {
  const lvl = String(level || "LOW").toUpperCase();

  let cls = "risk-badge risk-low";
  if (lvl === "MEDIUM") cls = "risk-badge risk-medium";
  if (lvl === "HIGH") cls = "risk-badge risk-high";

  return <span className={cls}>{lvl}</span>;
}
