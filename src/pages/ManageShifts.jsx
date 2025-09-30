// src/pages/ManageShifts.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import { getLS, setLS } from "../utils/storage.js";
import { Link } from "react-router-dom";

export default function ManageShifts() {
  const [shifts, setShiftsState] = React.useState(getLS("shifts", []));
  const doctors = getLS("doctors", []);
  const today = new Date().toISOString().slice(0, 10);

  const setShifts = (val) => setShiftsState(val);

  const addDummyShift = () => {
    const d = doctors.find((x) => x.active) || doctors[0];
    const newShift = {
      id: `S${Math.random().toString(36).slice(2, 8)}`,
      date: today,
      role: "Doctor",
      staffId: d?.id || "D000",
      name: d?.name || "Dr. Temp",
      dept: d?.dept || "General",
      shift: "Evening (14:00-20:00)",
    };
    const updated = [newShift, ...shifts];
    setShifts(updated);
    setLS("shifts", updated);
  };

  const removeShift = (id) => {
    const updated = shifts.filter((s) => s.id !== id);
    setShifts(updated);
    setLS("shifts", updated);
  };

  const todayShifts = shifts.filter((s) => s.date === today);
  const futureShifts = shifts.filter((s) => s.date > today);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7efe8" }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl" style={{ color: "#6c412f" }}>Manage Shifts</h1>
            <div className="flex gap-2">
              <button onClick={addDummyShift} className="text-sm px-3 py-2 rounded bg-[#e6ccb2] text-[#6c412f] hover:opacity-90">
                Add dummy shift
              </button>
              <Link to="/dashboard" className="text-sm px-3 py-2 rounded border border-[#6c412f]/20 hover:bg-white">
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <h2 className="font-serif text-xl mb-3" style={{ color: "#6c412f" }}>Shifts Today</h2>
              <div className="overflow-auto rounded border border-[#6c412f]/10">
                <table className="w-full text-sm">
                  <thead className="bg-[#f7efe8]">
                    <tr className="text-left">
                      <th className="p-2">Name</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Shift</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayShifts.map((s) => (
                      <tr key={s.id} className="border-t border-[#6c412f]/10">
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.role}</td>
                        <td className="p-2">{s.shift}</td>
                        <td className="p-2">{s.dept}</td>
                        <td className="p-2">
                          <button onClick={() => removeShift(s.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {todayShifts.length === 0 && (
                      <tr>
                        <td className="p-3 text-sm text-[#6c412f]/70" colSpan={5}>No shifts for today.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5 border border-[#6c412f]/10 shadow-sm bg-white rounded-xl">
              <h2 className="font-serif text-xl mb-3" style={{ color: "#6c412f" }}>Upcoming Shifts</h2>
              <div className="overflow-auto rounded border border-[#6c412f]/10">
                <table className="w-full text-sm">
                  <thead className="bg-[#f7efe8]">
                    <tr className="text-left">
                      <th className="p-2">Date</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Shift</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureShifts.map((s) => (
                      <tr key={s.id} className="border-t border-[#6c412f]/10">
                        <td className="p-2">{s.date}</td>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.role}</td>
                        <td className="p-2">{s.shift}</td>
                        <td className="p-2">
                          <button onClick={() => removeShift(s.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {futureShifts.length === 0 && (
                      <tr>
                        <td className="p-3 text-sm text-[#6c412f]/70" colSpan={5}>No upcoming shifts.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

