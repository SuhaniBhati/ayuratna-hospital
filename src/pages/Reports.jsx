// src/pages/Reports.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Card from "../components/Card.jsx";
import Chart from "../components/Chart.jsx";
import { getLS } from "../utils/storage.js";

const brown = "#6c412f";
const cream = "#f7efe8";
const creamAlt = "#faf6f2";

function toCSV(rows) {
  return rows.map((r) => r.map((c) => {
    const s = String(c ?? "");
    const needsWrap = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsWrap ? `"${escaped}"` : escaped;
  }).join(",")).join("\n");
}

function downloadCSV(filename, rows) {
  const data = toCSV(rows);
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const Reports = () => {
  const [dept, setDept] = React.useState("");
  const [doc, setDoc] = React.useState("");
  const [range, setRange] = React.useState({ from: "", to: "" });

  const doctors = getLS("doctors", []);
  const appointments = getLS("appointments", []);
  const payments = getLS("payments", []);

  const appTrend = [2, 3, 5, 4, 6, 5, 7];
  const revTrend = [10, 15, 12, 18, 22, 25];

  const staffUtil = [
    { dept: "Ayurveda", value: 60 },
    { dept: "Panch.", value: 25 },
    { dept: "Peds.", value: 15 },
  ];

  const logs = [
    { id: "L001", ts: Date.now() - 1000 * 60 * 10, text: "OPD clinic opened; first walk-in registered at reception." },
    { id: "L002", ts: Date.now() - 1000 * 60 * 35, text: "Dr. Rao completed 3 follow-up consultations in Ayurveda." },
    { id: "L003", ts: Date.now() - 1000 * 60 * 55, text: "Pharmacy inventory reconciled; 2 low-stock items flagged." },
    { id: "L004", ts: Date.now() - 1000 * 60 * 75, text: "IPD bed B202 sanitized and prepared for next admission." },
    { id: "L005", ts: Date.now() - 1000 * 60 * 90, text: "Billing desk processed 5 payments; 1 refund initiated." },
    { id: "L006", ts: Date.now() - 1000 * 60 * 120, text: "Panchakarma therapy room scheduled for afternoon sessions." },
    { id: "L007", ts: Date.now() - 1000 * 60 * 150, text: "Diagnostics updated: 4 CBC reports delivered to EHR." },
  ];

  const exportKPIsCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Appointments (total)", String(appointments.length)],
      ["Revenue (sum)", String(payments.reduce((s, p) => s + (p.amount || 0), 0))],
    ];
    downloadCSV("kpi_reports.csv", rows);
  };

  const exportLogsCSV = () => {
    const rows = [["ID", "Time", "Activity"], ...logs.map((l) => [l.id, new Date(l.ts).toLocaleString(), l.text])];
    downloadCSV("activity_logs.csv", rows);
  };

  const exportPDF = () => window.print();

  return (
    <div className="min-h-screen" style={{ backgroundColor: cream }}>
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-serif text-xl" style={{ color: brown }}>Reports & Analytics</h1>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col">
                <label className="text-xs" style={{ color: `${brown}B3` }}>Department</label>
                <select className="rounded-md px-3 py-2 bg-white border border-[#6c412f]/30 text-sm" style={{ color: brown }} value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="">All Departments</option>
                  <option>Ayurveda</option>
                  <option>Panchakarma</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs" style={{ color: `${brown}B3` }}>Doctor</label>
                <select className="rounded-md px-3 py-2 bg-white border border-[#6c412f]/30 text-sm" style={{ color: brown }} value={doc} onChange={(e) => setDoc(e.target.value)}>
                  <option value="">All Doctors</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs" style={{ color: `${brown}B3` }}>From</label>
                <input type="date" className="rounded-md px-3 py-2 bg-white border border-[#6c412f]/30 text-sm" style={{ color: brown }} value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs" style={{ color: `${brown}B3` }}>To</label>
                <input type="date" className="rounded-md px-3 py-2 bg-white border border-[#6c412f]/30 text-sm" style={{ color: brown }} value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
              </div>

              <button className="rounded-lg px-4 py-2 text-sm shadow-sm border hover:opacity-90" style={{ borderColor: `${brown}33`, color: brown, backgroundColor: "#ffffff" }} onClick={exportKPIsCSV}>
                Export KPIs CSV
              </button>
              <button className="rounded-lg px-4 py-2 text-sm shadow-sm" style={{ backgroundColor: brown, color: "#fefcf9" }} onClick={exportPDF}>
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-white rounded-xl border border-[#6c412f]/10 shadow-sm">
              <h3 className="font-serif text-xl mb-4" style={{ color: brown }}>Appointment stats</h3>
              <Chart type="line" data={[2,3,5,4,6,5,7]} labels={["M","T","W","T","F","S","S"]} height={280}
                options={{ stroke: "#1e7a6d", fill: "rgba(30,122,109,0.18)", gridColor: "rgba(108,65,47,0.2)", axisColor: "rgba(108,65,47,0.7)", showGrid: true, padding: 36 }} />
              <div className="mt-3 text-xs text-teal-700">Weekly appointments by day</div>
            </Card>

            <Card className="p-8 bg-white rounded-xl border border-[#6c412f]/10 shadow-sm">
              <h3 className="font-serif text-xl mb-4" style={{ color: brown }}>Revenue trends</h3>
              <Chart type="bar" data={[10,15,12,18,22,25]} labels={["Apr","May","Jun","Jul","Aug","Sep"]} height={280}
                options={{ barColor: brown, gridColor: "rgba(108,65,47,0.2)", axisColor: "rgba(108,65,47,0.7)", showGrid: true, padding: 36, showBarLabels: false }} />
              <div className="mt-3 text-xs text-teal-700">Monthly revenue index</div>
            </Card>

            <Card className="p-8 bg-white rounded-xl border border-[#6c412f]/10 shadow-sm">
              <h3 className="font-serif text-xl mb-4" style={{ color: brown }}>Staff utilization</h3>
              <Chart type="bar" data={staffUtil.map(d=>d.value)} labels={staffUtil.map(d=>d.dept)} height={280}
                yMin={0} yMax={100}
                options={{ barColor: brown, gridColor: "rgba(108,65,47,0.2)", axisColor: "rgba(108,65,47,0.7)", showGrid: true, padding: 36, showBarLabels: true }} />
              <div className="mt-3 text-xs text-teal-700">Utilization by department (percent)</div>
            </Card>
          </div>

          <Card className="p-8 bg-white rounded-xl border border-[#6c412f]/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl" style={{ color: brown }}>Hospital activity logs</h3>
              <div className="flex items-center gap-2">
                <button className="rounded-lg px-4 py-2 text-sm shadow-sm border hover:opacity-90" style={{ borderColor: `${brown}33`, color: brown, backgroundColor: "#ffffff" }}
                  onClick={() => downloadCSV("activity_logs.csv", [["ID","Time","Activity"], ...logs.map(l=>[l.id,new Date(l.ts).toLocaleString(),l.text])])}>
                  Export Logs CSV
                </button>
                <button className="rounded-lg px-4 py-2 text-sm shadow-sm" style={{ backgroundColor: brown, color: "#fefcf9" }} onClick={() => window.print()}>
                  Export Logs PDF
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {logs.map((l) => (
                <li key={l.id} className="rounded-md px-4 py-2 flex items-center justify-between" style={{ backgroundColor: creamAlt, color: brown }}>
                  <span className="text-sm">{l.text}</span>
                  <span className="text-xs text-teal-700 opacity-80">{new Date(l.ts).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Reports;
