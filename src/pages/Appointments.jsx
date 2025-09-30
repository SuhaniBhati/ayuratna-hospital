// src/pages/Appointments.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Table from "../components/Table.jsx";
import Modal from "../components/Modal.jsx";
import CalendarView from "../components/CalendarView.jsx";
import { getLS, setLS, useLocalStorage } from "../utils/storage.js";
import { requests as seedRequests } from "../data/requests.js";

const STORAGE_KEYS = {
  APPOINTMENTS: "appointments",
  REQUESTS: "appointmentRequests",
};

export default function Appointments() {
  // Seed requests once per mount; storage.js routes REQUESTS to sessionStorage (non-permanent)
  const seededRef = React.useRef(false);
  React.useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const cur = getLS(STORAGE_KEYS.REQUESTS, null);
    if (!cur) setLS(STORAGE_KEYS.REQUESTS, seedRequests);
  }, []);

  const [view, setView] = React.useState("list");
  const [filter, setFilter] = React.useState({ doctor: "", dept: "", date: "" });
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    patientId: "",
    patientName: "",
    dept: "",
    doctorId: "",
    date: "",
    time: "",
  });

  // Session-scoped per storage.js routing
  const [appointments, setAppointments] = useLocalStorage(STORAGE_KEYS.APPOINTMENTS, []);
  const [requests, setRequests] = useLocalStorage(STORAGE_KEYS.REQUESTS, seedRequests);

  const patients = getLS("patients", []);
  const doctors = getLS("doctors", []);

  const filtered = React.useMemo(
    () =>
      appointments.filter(
        (a) =>
          (!filter.doctor || a.doctorId === filter.doctor) &&
          (!filter.dept || a.dept === filter.dept) &&
          (!filter.date || a.date === filter.date)
      ),
    [appointments, filter]
  );

  const addAppointment = () => {
    let chosenDoctor = doctors.find((d) => d.id === form.doctorId && d.active);
    if (!chosenDoctor && form.dept) chosenDoctor = doctors.find((d) => d.dept === form.dept && d.active);
    if (!chosenDoctor) chosenDoctor = doctors.find((d) => d.active);

    const newA = {
      id: "A" + String(appointments.length + 1001),
      patientId: form.patientId,
      patientName: patients.find((p) => p.id === form.patientId)?.name || form.patientName,
      doctorId: chosenDoctor?.id || "",
      doctorName: chosenDoctor?.name || "",
      date: form.date,
      time: form.time,
      status: "Scheduled",
      dept: form.dept,
    };
    setAppointments([newA, ...appointments]);
    setOpen(false);
    setForm({ patientId: "", patientName: "", dept: "", doctorId: "", date: "", time: "" });
  };

  const acceptRequest = (rid) => {
    const r = requests.find((x) => x.id === rid);
    if (!r) return;
    let chosenDoctor = doctors.find((d) => d.dept === r.dept && d.active);
    if (!chosenDoctor) chosenDoctor = doctors.find((d) => d.active);

    const newA = {
      id: "A" + String(appointments.length + 1001),
      patientId: r.patientId,
      patientName: r.patientName,
      doctorId: chosenDoctor?.id || "",
      doctorName: chosenDoctor?.name || "",
      date: r.date,
      time: r.time,
      status: "Confirmed",
      dept: r.dept,
    };
    setAppointments([newA, ...appointments]);
    setRequests(requests.filter((x) => x.id !== rid));
  };

  const rejectRequest = (rid) => {
    setRequests(requests.filter((x) => x.id !== rid));
  };

  const columns = [
    { key: "patientName", label: "Patient Name" },
    { key: "doctorName", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f2e8df" }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <div className="rounded-xl border border-[#6c412f]/20 bg-white shadow-sm">
            <div className="p-4 md:p-6 space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-grow max-w-xs min-w-[12rem]">
                  <label className="block text-xs text-[#6c412f] mb-1">Doctor</label>
                  <select
                    className="w-full rounded border border-[#6c412f] bg-[#fefcf9] text-[#6c412f] px-3 py-2"
                    value={filter.doctor}
                    onChange={(e) => setFilter({ ...filter, doctor: e.target.value })}
                  >
                    <option value="">All Doctors</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-grow max-w-xs min-w-[12rem]">
                  <label className="block text-xs text-[#6c412f] mb-1">Department</label>
                  <select
                    className="w-full rounded border border-[#6c412f] bg-[#fefcf9] text-[#6c412f] px-3 py-2"
                    value={filter.dept}
                    onChange={(e) => setFilter({ ...filter, dept: e.target.value })}
                  >
                    <option value="">All Departments</option>
                    <option>Ayurveda</option>
                    <option>Panchakarma</option>
                    <option>Pediatrics</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                  </select>
                </div>

                <div className="flex-grow max-w-xs min-w-[12rem]">
                  <label className="block text-xs text-[#6c412f] mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full rounded border border-[#6c412f] bg-[#fefcf9] text-[#6c412f] px-3 py-2"
                    value={filter.date}
                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  />
                </div>

                <div className="ml-auto flex gap-2">
                  <button
                    className="px-4 py-2 rounded bg-[#6c412f] text-[#fefcf9] hover:bg-[#4a2e1a]"
                    onClick={() => setOpen(true)}
                  >
                    Add Appointment
                  </button>
                  <button
                    className="px-4 py-2 rounded border border-[#6c412f] text-[#6c412f] bg-[#f7efe8] hover:bg-[#efe6db]"
                    onClick={() => setView(view === "list" ? "calendar" : "list")}
                  >
                    Switch to {view === "list" ? "Calendar" : "List"} View
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-[#6c412f]/20 p-4">
              {view === "list" ? (
                <Table columns={columns} rows={filtered} />
              ) : (
                <CalendarView items={filtered} />
              )}
            </div>
          </div>

          {/* Requests */}
          <div className="w-full">
            <div className="rounded-xl border border-[#6c412f]/20 bg-white shadow p-6">
              <h2 className="font-serif text-lg mb-6 text-[#6c412f]">Appointment Requests</h2>
              {requests.length === 0 ? (
                <div className="text-sm text-[#6c412f]/80">No pending requests</div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {requests.map((r) => (
                    <div key={r.id} className="flex flex-col justify-between rounded-xl border border-[#6c412f]/20 bg-[#fefcf9] shadow p-4">
                      <div>
                        <div className="text-[#6c412f] font-medium">
                          {r.patientName} • {r.dept}
                        </div>
                        <div className="text-xs text-[#6c412f]/80">
                          {r.date} • {r.time}
                        </div>
                        {r.note && <div className="text-xs text-[#6c412f]/70 mt-2">{r.note}</div>}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          className="px-3 py-1 rounded bg-[#6c412f] text-[#fefcf9] hover:bg-[#4a2e1a]"
                          onClick={() => acceptRequest(r.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-1 rounded border border-[#6c412f] text-[#6c412f] hover:bg-[#f7efe8]"
                          onClick={() => rejectRequest(r.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Modal */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Add Appointment"
            actions={
              <>
                <button className="px-4 py-2 rounded border border-[#6c412f] text-[#6c412f] hover:bg-[#f7efe8]" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 rounded bg-[#6c412f] text-[#fefcf9] hover:bg-[#4a2e1a]" onClick={addAppointment}>
                  Save
                </button>
              </>
            }
          >
            <div className="grid grid-cols-1 gap-3 text-xs text-[#6c412f]">
              <div>
                <label className="block mb-1 font-medium">Patient</label>
                <select
                  className="w-full rounded border border-[#6c412f] bg-[#fefcf9] px-3 py-2"
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  className="w-full rounded border border-[#6c412f] bg-[#fefcf9] px-3 py-2"
                  value={form.dept}
                  onChange={(e) => setForm({ ...form, dept: e.target.value, doctorId: "" })}
                >
                  <option value="">Select department</option>
                  <option>Ayurveda</option>
                  <option>Panchakarma</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Doctor</label>
                <select
                  className="w-full rounded border border-[#6c412f] bg-[#fefcf9] px-3 py-2"
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                >
                  <option value="">Select doctor</option>
                  {doctors
                    .filter((d) => d.active && (!form.dept || d.dept === form.dept))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} • {d.dept}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full rounded border border-[#6c412f] bg-[#fefcf9] px-3 py-2"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Time</label>
                  <input
                    type="time"
                    className="w-full rounded border border-[#6c412f] bg-[#fefcf9] px-3 py-2"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
