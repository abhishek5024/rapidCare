import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Patient
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientHome from "./pages/PatientHome";
import PatientEmergency from "./pages/PatientEmergency";
import AiMedicalHome from "./pages/AiMedicalHome";
import FindClinic from "./pages/FindClinic";

// Hospital
import HospitalLogin from "./pages/HospitalLogin";
import HospitalRegister from "./pages/HospitalRegister";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalProtectedRoute from "./routes/HospitalProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/patient/login" />} />

        {/* ================= PATIENT ================= */}
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />
        <Route path="/home" element={<PatientHome />} />
        <Route path="/emergency" element={<PatientEmergency />} />
        <Route path="/ai-services" element={<AiMedicalHome />} />
        <Route path="/hospital-suggestion" element={<FindClinic />} />

        {/* ================= HOSPITAL ================= */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route
          path="/hospital/dashboard"
          element={
            <HospitalProtectedRoute>
              <HospitalDashboard />
            </HospitalProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<h2>404 – Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
