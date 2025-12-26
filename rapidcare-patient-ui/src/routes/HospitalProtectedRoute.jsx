import { Navigate } from "react-router-dom";

export default function ProtectedHospitalRoute({ children }) {
  const hospitalId = localStorage.getItem("hospitalId");

  if (!hospitalId) {
    return <Navigate to="/hospital/login" replace />;
  }

  return children;
}
