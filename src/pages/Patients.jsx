// src/pages/Patients.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Table from "../components/Table.jsx";
import Modal from "../components/Modal.jsx";
import { useLocalStorage, usePatients } from "../utils/storage.js";
import { useNavigate } from "react-router-dom";

const departments = ["Ayurveda", "Panchakarma", "Pediatrics", "Orthopedics", "Dermatology"];

const Patients = () => {
  const nav = useNavigate();
  const patients = usePatients();
  const [, setPatients] = useLocalStorage("patients", []);

  const [query, setQuery] = React.useState("");
  const [openAdd, setOpenAdd] = React.useState(false);

  const filtered = React.useMemo(
    () => patients.filter((p) => (p?.name || "").toLowerCase().includes(query.toLowerCase())),
    [patients, query]
  );

  const deletePatient = (id) => setPatients((prev) => prev.filter((p) => p.id !== id));

  const [form, setForm] = React.useState({ name: "", age: "", dept: "Ayurveda", email: "", phone: "" });

  const addPatient = () => {
    if (!form.name.trim()) return;
    const newPatient = {
      id: "P" + String(1000 + patients.length + 1),
      photo: "/assets/patient.png",
      name: form.name,
      age: Number(form.age) || 0,
      dept: form.dept,
      email: form.email,
      phone: form.phone,
      address: "",
      registeredOn: new Date().toISOString().slice(0, 10),
      ipd: null,
      insurance: { provider: "", policyNo: "", validTill: "" },
      attachments: { insuranceDocs: [], billingInvoices: [], healthReports: [] },
    };
    setPatients((prev) => [newPatient, ...prev]);
    setOpenAdd(false);
    setForm({ name: "", age: "", dept: "Ayurveda", email: "", phone: "" });
  };

  const columns = [
    { key: "photo", label: "", render: (v) => <img src={v || "/assets/patient.png"} alt="" className="h-6 w-6 rounded-full" /> },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "id", label: "ID" },
    { key: "dept", label: "Department" },
    {
      key: "actions",
      label: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-0.5 rounded text-xs bg-[#6c412f] text-white hover:opacity-90"
            onClick={(e) => { e.stopPropagation(); if (r?.id) nav(`/patients/${r.id}`); }}
          >
            View
          </button>
          <button
            className="px-2 py-0.5 rounded text-xs bg-red-600 text-white hover:bg-red-700"
            onClick={(e) => { e.stopPropagation(); deletePatient(r.id); }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7efe8] text-[#6c412f]">
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
          <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="rounded border border-[#6c412f]/30 bg-white px-2 py-1 w-full sm:max-w-xs text-[#6c412f] placeholder-[#6c412f]/60"
                placeholder="Search patients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="rounded px-3 py-1 bg-[#6c412f] text-white hover:opacity-90 font-serif" onClick={() => setOpenAdd(true)}>
                Add Patient
              </button>
            </div>
          </div>

          {patients.length === 0 && (
            <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-3 text-xs">
              No patients.{" "}
              <button
                className="underline"
                onClick={async () => {
                  const mod = await import("../data/patients.js");
                  setPatients(mod.patients || []);
                }}
              >
                Restore demo data
              </button>
            </div>
          )}

          <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white">
            <Table columns={columns} rows={filtered} rowKey={(r) => r.id} />
          </div>

          <Modal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            title="Add Patient"
            actions={
              <div className="flex gap-2">
                <button className="rounded px-3 py-1 border border-[#6c412f] text-[#6c412f] hover:bg-[#faf6f2]" onClick={() => setOpenAdd(false)}>
                  Cancel
                </button>
                <button className="rounded px-3 py-1 bg-[#6c412f] text-white hover:opacity-90 font-serif" onClick={addPatient}>
                  Save
                </button>
              </div>
            }
            className="!max-w-lg"
            headerClassName="font-serif text-xl"
          >
            <div className="grid gap-2 text-xs">
              <label className="font-semibold font-serif text-sm">Name</label>
              <input className="rounded border border-[#6c412f]/30 px-2 py-1 bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label className="font-semibold font-serif text-sm">Age</label>
              <input type="number" className="rounded border border-[#6c412f]/30 px-2 py-1 bg-white" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <label className="font-semibold font-serif text-sm">Department</label>
              <select className="rounded border border-[#6c412f]/30 px-2 py-1 bg-white" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
              <label className="font-semibold font-serif text-sm">Email</label>
              <input type="email" className="rounded border border-[#6c412f]/30 px-2 py-1 bg-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label className="font-semibold font-serif text-sm">Phone</label>
              <input className="rounded border border-[#6c412f]/30 px-2 py-1 bg-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Patients;
