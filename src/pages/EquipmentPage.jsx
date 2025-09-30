// src/pages/EquipmentPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import { getLS, setLS } from "../utils/storage.js";
import { Link } from "react-router-dom";

export default function EquipmentPage() {
  const [equipment, setEquipment] = React.useState(getLS("equipment", []));
  const wards = getLS("wards", []);

  const setStatus = (id, status) => {
    const updated = equipment.map((e) => (e.id === id ? { ...e, status } : e));
    setEquipment(updated);
    setLS("equipment", updated);
  };

  const wardName = (wardId) => wards.find((w) => w.id === wardId)?.name || wardId;

  const counts = {
    available: equipment.filter((e) => e.status === "Available").length,
    inuse: equipment.filter((e) => e.status === "In Use").length,
    maintenance: equipment.filter((e) => e.status === "Maintenance").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7efe8" }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl" style={{ color: "#6c412f" }}>Manage Equipment</h1>
            <Link to="/dashboard" className="text-sm px-3 py-2 rounded border border-[#6c412f]/20 hover:bg-white">
              Back to Dashboard
            </Link>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <div className="text-xs text-[#6c412f]/80">Available</div>
              <div className="text-2xl font-serif" style={{ color: "#1e7a6d" }}>{counts.available}</div>
            </Card>
            <Card className="p-4 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <div className="text-xs text-[#6c412f]/80">In Use</div>
              <div className="text-2xl font-serif" style={{ color: "#6c412f" }}>{counts.inuse}</div>
            </Card>
            <Card className="p-4 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <div className="text-xs text-[#6c412f]/80">Maintenance</div>
              <div className="text-2xl font-serif" style={{ color: "#8a5a00" }}>{counts.maintenance}</div>
            </Card>
          </div>

          {/* Table */}
          <Card className="p-5 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
            <div className="overflow-auto rounded border border-[#6c412f]/10">
              <table className="w-full text-sm">
                <thead className="bg-[#f7efe8]">
                  <tr className="text-left">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Ward</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((e) => (
                    <tr key={e.id} className="border-t border-[#6c412f]/10">
                      <td className="p-2">{e.id}</td>
                      <td className="p-2">{e.name}</td>
                      <td className="p-2">{wardName(e.wardId)}</td>
                      <td className="p-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            e.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : e.status === "In Use"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setStatus(e.id, "Available")}
                            className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50"
                          >
                            Mark Available
                          </button>
                          <button
                            onClick={() => setStatus(e.id, "In Use")}
                            className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Mark In Use
                          </button>
                          <button
                            onClick={() => setStatus(e.id, "Maintenance")}
                            className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          >
                            Maintenance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {equipment.length === 0 && (
                    <tr>
                      <td className="p-3 text-sm text-[#6c412f]/70" colSpan={5}>
                        No equipment found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
