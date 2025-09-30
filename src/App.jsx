// src/App.jsx
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Landing from "./pages/Landing.jsx";
import LearnMore from "./pages/LearnMore.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import Patients from "./pages/Patients.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import Doctors from "./pages/Doctors.jsx";
// Removed: Payments, Integration
import Reports from "./pages/Reports.jsx";

import ManageOps from "./pages/ManageOps.jsx";
import ManageShifts from "./pages/ManageShifts.jsx";
import EquipmentPage from "./pages/EquipmentPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen text-amber-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/reports" element={<Reports />} />

          {/* Management */}
          <Route path="/manage-ops" element={<ManageOps />} />
          <Route path="/manage-shifts" element={<ManageShifts />} />
          <Route path="/equipment" element={<EquipmentPage />} />

          {/* 404 */}
          <Route path="*" element={<div className="p-6">Page not found.</div>} />
        </Routes>
      </main>
    </div>
  );
}
