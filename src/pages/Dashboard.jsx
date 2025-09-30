// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import Chart from "../components/Chart.jsx";
import { hospitals as seedHosp } from "../data/hospitals.js";
import { patients as seedPatients } from "../data/patients.js";
import { doctors as seedDoctors } from "../data/doctors.js";
import { appointments as seedAppointments } from "../data/appointments.js";
import { payments as seedPayments } from "../data/payments.js";
import { departments as seedDepartments } from "../data/departments.js";
import { wards as seedWards } from "../data/wards.js";
import { beds as seedBeds } from "../data/beds.js";
import { equipment as seedEquipment } from "../data/equipment.js";
import { getLS, setLS, useShifts } from "../utils/storage.js";
import { Link } from "react-router-dom";

// Local date helper to avoid UTC drift for YYYY-MM-DD
function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * StrictMode-safe one-time seeding with guard and empty-array reseed.
 * Seeds all domain keys if missing or empty; read-only keys (like shifts) hydrate via hooks.
 */
function seedOnce() {
  const FLAG = "__seeded_v1";
  if (localStorage.getItem(FLAG)) return;

  const ensureArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);
  const seedKey = (key, data) => {
    const cur = getLS(key, null);
    if (cur == null) return setLS(key, ensureArray(data));
    if (!Array.isArray(cur)) return setLS(key, ensureArray(cur));
    if (cur.length === 0) return setLS(key, ensureArray(data));
  };

  seedKey("hospitals", seedHosp);
  seedKey("patients", seedPatients);
  seedKey("doctors", seedDoctors);
  seedKey("appointments", seedAppointments);
  seedKey("payments", seedPayments);
  seedKey("departments", seedDepartments);
  seedKey("wards", seedWards);
  seedKey("beds", seedBeds);
  seedKey("equipment", seedEquipment);
  // shifts is read-only via hook; no persistent writes here

  if (!getLS("recentActivities")) {
    setLS("recentActivities", [
      { id: "ra1", ts: Date.now() - 1000 * 60 * 15, text: "New patient registered: Ramesh K." },
      { id: "ra2", ts: Date.now() - 1000 * 60 * 45, text: "Appointment scheduled with Dr. Mehta at 3:00 PM" },
      { id: "ra3", ts: Date.now() - 1000 * 60 * 90, text: "Payment received: ₹1,200 for therapy session" },
    ]);
  }

  localStorage.setItem(FLAG, "1");
}

export default function Dashboard() {
  const seededRef = React.useRef(false);
  React.useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    seedOnce();
  }, []);

  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const hospitals = arr(getLS("hospitals", []));
  const patients = arr(getLS("patients", []));
  const doctors = arr(getLS("doctors", []));
  const appointments = arr(getLS("appointments", []));
  const payments = arr(getLS("payments", []));
  const departments = arr(getLS("departments", []));
  const wards = arr(getLS("wards", []));
  const beds = arr(getLS("beds", []));
  const equipment = arr(getLS("equipment", []));
  const recentActivities = arr(getLS("recentActivities", []));

  // Hydrated read-only shifts from seeds
  const shifts = useShifts();

  // Dates (use local for consistent filtering)
  const today = todayLocal();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  // KPIs
  const patientsToday = patients.filter((p) => p.registeredOn === today).length || 9;
  const patientsYesterday = patients.filter((p) => p.registeredOn === yesterday).length || 6;
  const patientsDelta = patientsToday - patientsYesterday;
  const appointmentsPending = appointments.filter((a) => a.status === "Pending" && a.date >= today).length || 5;
  const revenueToday =
    payments.filter((p) => p.status === "Paid" && p.date === today).reduce((s, p) => s + (p.amount || 0), 0) || 7400;
  const revenueYesterday =
    payments.filter((p) => p.status === "Paid" && p.date === yesterday).reduce((s, p) => s + (p.amount || 0), 0) || 5200;
  const revenueDelta = revenueToday - revenueYesterday;
  const activeDoctors = doctors.filter((d) => d.active).length || 4;
  const totalPatients = patients.length;
  const nextAppointment =
    appointments
      .filter((a) => a.date >= today)
      .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : a.time.localeCompare(b.time)))[0];

  // Ops metrics
  const totalDepartments = departments.length;
  const totalWards = wards.length;
  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const availableBeds = beds.filter((b) => b.status === "Available").length;
  const outOfServiceBeds = beds.filter((b) => b.status === "Maintenance").length;
  const equipmentAvailable = equipment.filter((e) => e.status === "Available").length;
  const equipmentInUse = equipment.filter((e) => e.status === "In Use").length;
  const equipmentMaintenance = equipment.filter((e) => e.status === "Maintenance").length;

  // OPD/IPD stats
  const opdVisitsToday = appointments.filter((a) => a.type === "OPD" && a.date === today).length || 24;
  const ipdAdmissionsToday = patients.filter((p) => p.ipd && p.ipd.admittedOn === today).length || 3;
  const ipdDischargesToday = patients.filter((p) => p.ipd && p.ipd.dischargedOn === today).length || 2;
  const ipdCurrent = patients.filter((p) => p.ipd && !p.ipd.dischargedOn).length || 12;

  // Shifts today (local date match)
  const todayShifts = (Array.isArray(shifts) ? shifts : []).filter((s) => s.date === today);
  const doctorsOnDuty = todayShifts.filter((s) => s.role === "Doctor").length;
  const nursesOnDuty = todayShifts.filter((s) => s.role === "Nurse").length;

  // Charts
  const last7DayLabels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(undefined, { weekday: "short" });
  });
  const opdTrend = [18, 20, 17, 24, 27, 25, 31];

  const last6MonthsLabels = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString(undefined, { month: "short" });
  });
  const revenueTrend = [182000, 205500, 196800, 223200, 259000, 248500];

  const lineOpts = { stroke: "#1e7a6d", fill: "rgba(30,122,109,0.18)", gridColor: "rgba(108,65,47,0.2)", axisColor: "rgba(108,65,47,0.7)", showGrid: true, padding: 28 };
  const barOpts = { barColor: "#6c412f", gridColor: "rgba(108,65,47,0.2)", axisColor: "rgba(108,65,47,0.7)", showGrid: true, padding: 28 };

  // Brand palette
  const brown = "#6c412f";
  const cream = "#f7efe8";
  const creamAlt = "#faf6f2";

  return (
    <div className="min-h-screen">
      {/* Fixed sidebar lives separately, provided by Sidebar component */}
      <Sidebar />

      {/* Main content wrapper shifted and padded under fixed navbar */}
      <div className="pt-16 md:ml-64" style={{ backgroundColor: cream }}>
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          {/* Row 1: KPI cards (single row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <div className="text-sm" style={{ color: brown }}>Patients Today</div>
              <div className="flex items-end gap-2 mt-1">
                <div className="text-3xl font-serif" style={{ color: brown }}>{patientsToday}</div>
                <span className={`text-xs ${patientsDelta >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {patientsDelta >= 0 ? `+${patientsDelta}` : patientsDelta} vs yesterday
                </span>
              </div>
              <div className="text-xs mt-1 text-teal-700">Walk-ins and appointments</div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <div className="text-sm" style={{ color: brown }}>Appointments Pending</div>
              <div className="text-3xl font-serif mt-1" style={{ color: brown }}>{appointmentsPending}</div>
              <div className="text-xs mt-1 text-teal-700">Auto-reminders enabled</div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <div className="text-sm" style={{ color: brown }}>Revenue Today</div>
              <div className="flex items-end gap-2 mt-1">
                <div className="text-3xl font-serif" style={{ color: brown }}>₹{revenueToday.toLocaleString()}</div>
                <span className={`text-xs ${revenueDelta >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {revenueDelta >= 0 ? `+₹${revenueDelta.toLocaleString()}` : `-₹${Math.abs(revenueDelta).toLocaleString()}`} vs yesterday
                </span>
              </div>
              <div className="text-xs mt-1 text-teal-700">OPD + therapies</div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <div className="text-sm" style={{ color: brown }}>Active Doctors</div>
              <div className="text-3xl font-serif mt-1" style={{ color: brown }}>{activeDoctors}</div>
              <div className="text-xs mt-1 text-teal-700">Shifts updated</div>
            </Card>
          </div>

          {/* Row 2: Visualizations (two charts side-by-side) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl" style={{ color: brown }}>OPD trend (7 days)</h3>
                <img src="/assets/doctor.png" className="h-7 w-7 opacity-80" alt="" />
              </div>
              <div className="rounded-lg border border-[#6c412f]/10" style={{ backgroundColor: creamAlt, minHeight: 260 }}>
                <Chart type="line" data={opdTrend} labels={last7DayLabels} options={lineOpts} />
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl" style={{ color: brown }}>Revenue (6 months)</h3>
                <img src="/assets/patient.png" className="h-7 w-7 opacity-80" alt="" />
              </div>
              <div className="rounded-lg border border-[#6c412f]/10" style={{ backgroundColor: creamAlt, minHeight: 260 }}>
                <Chart type="bar" data={revenueTrend} labels={last6MonthsLabels} options={barOpts} />
              </div>
            </Card>
          </div>

          {/* Row 3: OPD & IPD and Facility snapshot */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl xl:col-span-2">
              <h3 className="font-serif text-xl mb-3" style={{ color: brown }}>OPD & IPD</h3>
              <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: brown }}>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">OPD visits today</div>
                  <div className="font-serif text-lg">{opdVisitsToday}</div>
                </div>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">IPD admissions</div>
                  <div className="font-serif text-lg">{ipdAdmissionsToday}</div>
                </div>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">IPD discharges</div>
                  <div className="font-serif text-lg">{ipdDischargesToday}</div>
                </div>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">IPD current census</div>
                  <div className="font-serif text-lg">{ipdCurrent}</div>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <h3 className="font-serif text-xl mb-3" style={{ color: brown }}>Facility snapshot</h3>
              <div className="space-y-3 text-sm" style={{ color: brown }}>
                <div className="flex items-center justify-between">
                  <span>Total Patients</span>
                  <span className="font-semibold">{totalPatients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Doctors</span>
                  <span className="font-semibold">{activeDoctors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Departments</span>
                  <span className="font-semibold">{totalDepartments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wards</span>
                  <span className="font-semibold">{totalWards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Beds (Occ / Avl / Mnt)</span>
                  <span className="font-semibold">
                    {occupiedBeds} / {availableBeds} / {outOfServiceBeds}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Equipment (Use / Avl / Mnt)</span>
                  <span className="font-semibold">
                    {equipmentInUse} / {equipmentAvailable} / {equipmentMaintenance}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Appointment</span>
                  <span className="font-semibold">
                    {nextAppointment ? `${nextAppointment.date} • ${nextAppointment.time}` : "No upcoming"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/manage-ops" className="rounded-lg px-3 py-2 text-sm hover:opacity-90" style={{ backgroundColor: "#e6ccb2", color: brown }}>
                  Manage ops
                </Link>
                <Link to="/equipment" className="rounded-lg px-3 py-2 text-sm hover:opacity-90" style={{ backgroundColor: "#e6ccb2", color: brown }}>
                  Equipment
                </Link>
              </div>
            </Card>
          </div>

          {/* Row 4: Shifts today and Recent activities */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl xl:col-span-2">
              <h3 className="font-serif text-xl mb-3" style={{ color: brown }}>Shifts today</h3>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3" style={{ color: brown }}>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">Doctors on duty</div>
                  <div className="font-serif text-lg">{doctorsOnDuty}</div>
                </div>
                <div className="rounded-lg p-3 border border-[#6c412f]/10" style={{ backgroundColor: creamAlt }}>
                  <div className="text-xs opacity-80">Nurses on duty</div>
                  <div className="font-serif text-lg">{nursesOnDuty}</div>
                </div>
              </div>

              {/* Show all rows, no scrollbars */}
              <div>
                <table className="w-full text-sm table-auto">
                  <thead style={{ backgroundColor: cream }}>
                    <tr className="text-left" style={{ color: brown }}>
                      <th className="p-2">Name</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Shift</th>
                      <th className="p-2">Dept</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayShifts.map((s) => (
                      <tr key={s.id} className="border-t border-[#6c412f]/10" style={{ color: brown }}>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.role}</td>
                        <td className="p-2">{s.shift}</td>
                        <td className="p-2">{s.dept}</td>
                      </tr>
                    ))}
                    {todayShifts.length === 0 && (
                      <tr>
                        <td className="p-3 text-sm text-[#6c412f]/70" colSpan={4}>
                          No shifts for today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex gap-2">
                <Link to="/manage-shifts" className="inline-block rounded-lg px-3 py-2 text-sm hover:opacity-90" style={{ backgroundColor: "#e6ccb2", color: brown }}>
                  Manage shifts
                </Link>
              </div>
            </Card>

            <Card className="p-5 bg-white border border-[#6c412f]/10 shadow-sm rounded-xl">
              <h3 className="font-serif text-xl mb-3" style={{ color: brown }}>Recent activities</h3>
              <ul className="space-y-2">
                {recentActivities
                  .filter((a) => typeof a?.text === "string" && !/Auto-sync completed for EHR queue\./i.test(a.text))
                  .map((a) => (
                    <li key={a.id} className="rounded-md px-3 py-2 flex items-center justify-between" style={{ backgroundColor: cream }}>
                      <span className="text-sm" style={{ color: brown }}>{a.text}</span>
                      <span className="text-xs text-teal-700 opacity-80">{new Date(a.ts).toLocaleTimeString()}</span>
                    </li>
                  ))}
                {recentActivities.filter((a) => typeof a?.text === "string" && !/Auto-sync completed for EHR queue\./i.test(a.text)).length === 0 && (
                  <li className="rounded-md px-3 py-2" style={{ backgroundColor: cream, color: brown }}>
                    No recent activities.
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
