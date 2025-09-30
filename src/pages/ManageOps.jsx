// src/pages/ManageOps.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import { getLS } from "../utils/storage.js";
import { Link } from "react-router-dom";

export default function ManageOps() {
  const departments = getLS("departments", []);
  const wards = getLS("wards", []);
  const beds = getLS("beds", []);

  const bedCountsByWard = wards.map((w) => {
    const inWard = beds.filter((b) => b.wardId === w.id);
    return {
      ward: w.name,
      total: inWard.length,
      available: inWard.filter((b) => b.status === "Available").length,
      occupied: inWard.filter((b) => b.status === "Occupied").length,
      maintenance: inWard.filter((b) => b.status === "Maintenance").length,
    };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7efe8" }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl" style={{ color: "#6c412f" }}>Manage Operations</h1>
            <Link to="/dashboard" className="text-sm px-3 py-2 rounded border border-[#6c412f]/20 hover:bg-white">
              Back to Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <h2 className="font-serif text-xl mb-3" style={{ color: "#6c412f" }}>Departments</h2>
              <ul className="divide-y divide-[#6c412f]/10">
                {departments.map((d) => (
                  <li key={d.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm" style={{ color: "#6c412f" }}>{d.name}</div>
                      <div className="text-xs text-teal-700">Head: {d.head}</div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded bg-[#e6ccb2] text-[#6c412f] hover:opacity-90">Edit</button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <h2 className="font-serif text-xl mb-3" style={{ color: "#6c412f" }}>Wards & Beds</h2>
              <div className="space-y-3">
                {bedCountsByWard.map((w, idx) => (
                  <div key={idx} className="rounded-lg border border-[#6c412f]/10 bg-[#faf6f2] p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold" style={{ color: "#6c412f" }}>{w.ward}</div>
                      <span className="text-xs text-teal-700">{w.total} beds</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded bg-[#e6f5f1] text-[#1e7a6d] px-2 py-1">Available: {w.available}</div>
                      <div className="rounded bg-[#fff1f1] text-[#7a1e1e] px-2 py-1">Occupied: {w.occupied}</div>
                      <div className="rounded bg-[#fff7e6] text-[#8a5a00] px-2 py-1">Maintenance: {w.maintenance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
