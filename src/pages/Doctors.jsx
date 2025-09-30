// src/pages/Doctors.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import Modal from "../components/Modal.jsx";
import { useLocalStorage } from "../utils/storage.js";

const DEPARTMENTS = ["Ayurveda", "Panchakarma", "Pediatrics", "Orthopedics", "Dermatology"];

const Doctors = () => {
  const [dept, setDept] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    dept: DEPARTMENTS[0],
    specialization: "",
    phone: "",
    email: "",
    active: true,
  });

  const [doctors, setDoctors] = useLocalStorage("doctors", []);

  const filtered = React.useMemo(
    () => (!dept ? doctors : doctors.filter((d) => d.dept === dept)),
    [doctors, dept]
  );

  const addDoctor = () => {
    if (!form.name.trim()) return;
    const next = [
      ...doctors,
      { id: "D" + String(1000 + doctors.length + 1), photo: "/assets/doctor.png", ...form },
    ];
    setDoctors(next);
    setOpen(false);
    setForm({ name: "", dept: DEPARTMENTS[0], specialization: "", phone: "", email: "", active: true });
  };

  const removeDoctor = (id) => setDoctors((prev) => prev.filter((d) => d.id !== id));

  const brown = "#6c412f";
  const cream = "#f7efe8";

  return (
    <div className="min-h-screen" style={{ backgroundColor: cream }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-xl" style={{ color: brown }}>Doctors</h1>
            <div className="flex items-center gap-3">
              <select
                className="rounded border border-[#6c412f]/40 bg-white px-2 py-1 text-sm"
                style={{ color: brown }}
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <button
                className="px-3 py-1 rounded-lg shadow-sm text-sm"
                style={{ backgroundColor: brown, color: "#fefcf9" }}
                onClick={() => setOpen(true)}
              >
                Add Doctor
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((d) => (
              <Card key={d.id} className="p-5 bg-white rounded-xl border border-[#6c412f]/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={d.photo} alt="" className="h-12 w-12 rounded-full" />
                  <div>
                    <div className="font-serif text-lg" style={{ color: brown }}>{d.name}</div>
                    <div className="text-xs" style={{ color: `${brown}B3` }}>
                      {d.dept} • {d.specialization || "—"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs" style={{ color: `${brown}CC` }}>{d.email || "—"} • {d.phone || "—"}</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${d.active ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                    {d.active ? "Active" : "Inactive"}
                  </span>
                  <button
                    className="ml-auto px-3 py-1 rounded-lg text-xs border shadow-sm hover:opacity-90"
                    style={{ borderColor: `${brown}33`, color: "#7a1e1e", backgroundColor: "#fff1f1" }}
                    onClick={() => removeDoctor(d.id)}
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Add Doctor"
            actions={
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg text-sm border hover:bg-[#f7efe8]" style={{ borderColor: `${brown}40`, color: brown }} onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: brown, color: "#fefcf9" }} onClick={addDoctor}>
                  Save
                </button>
              </div>
            }
            className="!max-w-md"
          >
            <div className="grid gap-2 text-sm" style={{ color: brown }}>
              <label className="font-serif text-sm">Name</label>
              <input className="border rounded px-2 py-1 bg-white" style={{ borderColor: `${brown}66` }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="font-serif text-sm">Department</label>
              <select className="border rounded px-2 py-1 bg-white" style={{ borderColor: `${brown}66` }} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <label className="font-serif text-sm">Specialization</label>
              <input className="border rounded px-2 py-1 bg-white" style={{ borderColor: `${brown}66` }} value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              <label className="font-serif text-sm">Phone</label>
              <input className="border rounded px-2 py-1 bg-white" style={{ borderColor: `${brown}66` }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <label className="font-serif text-sm">Email</label>
              <input type="email" className="border rounded px-2 py-1 bg-white" style={{ borderColor: `${brown}66` }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="flex items-center gap-2 mt-1">
                <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                <label htmlFor="active" className="text-xs">Active</label>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Doctors;
