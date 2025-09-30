// src/pages/PatientProfile.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { getLS, setLS, usePatients, selectPatientByIdSync } from "../utils/storage.js";
import { FaFileUpload, FaDownload, FaSave } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const patients = usePatients();
  const loading = !Array.isArray(patients) || patients.length === 0;

  const idx = useMemo(() => patients.findIndex((p) => p.id === id), [patients, id]);
  const pat = useMemo(() => selectPatientByIdSync(patients, id), [patients, id]);

  const [tab, setTab] = useState("overview");
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (pat) {
      setDraft({
        name: pat.name || "",
        age: Number(pat.age || 0),
        dept: pat.dept || "",
        email: pat.email || "",
        phone: pat.phone || "",
        address: pat.address || "",
        gender: pat.gender || "",
        registeredOn: pat.registeredOn || "",
        insurance: pat.insurance || { provider: "", policyNo: "", validTill: "" },
        attachments: pat.attachments || { insuranceDocs: [], billingInvoices: [], healthReports: [] },
        ehr: pat.ehr || {
          history: [{ date: "2025-09-10", notes: "Initial consultation. Vata balancing herbs." }],
          labs: [{ date: "2025-09-11", test: "CBC", result: "Normal" }],
          prescriptions: [{ date: "2025-09-10", meds: "Ashwagandha 500mg - BID", duration: "30 days" }],
        },
        his: pat.his || {
          billing: [{ date: "2025-09-10", amount: 1200, mode: "UPI", status: "Paid", invoiceId: "INV-1001" }],
          admissions: pat.ipd ? [{ date: pat.ipd.admittedOn, type: "Admission", wardId: pat.ipd.wardId, bedId: pat.ipd.bedId }] : [],
          discharges: pat.ipd?.dischargedOn ? [{ date: pat.ipd.dischargedOn, type: "Discharge" }] : [],
          room: pat.ipd ? { wardId: pat.ipd.wardId, bedId: pat.ipd.bedId } : null,
        },
        photo: pat.photo || "/assets/patient.png",
      });
    } else {
      setDraft(null);
    }
  }, [pat]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7efe8] text-[#6c412f]">
        <Sidebar />
        <div className="pt-16 md:ml-64">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-6 font-serif text-lg">
              Loading patient details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pat) {
    return (
      <div className="min-h-screen bg-[#f7efe8] text-[#6c412f]">
        <Sidebar />
        <div className="pt-16 md:ml-64">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-6">
              <div className="font-serif text-lg mb-4">Patient not found</div>
              <button
                onClick={() => nav("/patients")}
                className="rounded px-3 py-2 bg-[#e6ccb2] text-[#6c412f] hover:opacity-90 font-serif"
              >
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onUpload = async (e, key) => {
    e.preventDefault();
    if (!draft) return;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const base64List = await Promise.all(files.map((f) => fileToBase64(f)));
    setDraft((d) => ({
      ...d,
      attachments: { ...d.attachments, [key]: [...(d.attachments?.[key] || []), ...base64List] },
    }));
  };

  const saveDraft = () => {
    if (!draft) return;
    const next = [...patients];
    next[idx] = { ...pat, ...draft };
    setLS("patients", next);
    toast.success("Patient details saved successfully");
  };

  const appts = (getLS("appointments", []) || []).filter((a) => a.patientId === id);
  const pays = draft?.his?.billing || [];

  const printInvoice = (invoice) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceId}</title>
          <style>
            body { font-family: serif; padding: 2rem; color: #6c412f; background: #f7efe8; }
            h2 { border-bottom: 2px solid #6c412f; padding-bottom: 0.5rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #6c412f; padding: 0.5rem; }
            th { background-color: #e6ccb2; }
          </style>
        </head>
        <body>
          <h2>Billing Invoice</h2>
          <div><strong>Invoice ID:</strong> ${invoice.invoiceId}</div>
          <div><strong>Patient Name:</strong> ${draft.name}</div>
          <div><strong>Date:</strong> ${invoice.date}</div>
          <div><strong>Payment Mode:</strong> ${invoice.mode || "—"}</div>
          <div><strong>Status:</strong> ${invoice.status}</div>
          <table>
            <thead><tr><th>Description</th><th>Amount (₹)</th></tr></thead>
            <tbody>
              <tr><td>Consultation & Services</td><td>${invoice.amount}</td></tr>
            </tbody>
            <tfoot>
              <tr><th>Total</th><th>${invoice.amount}</th></tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="min-h-screen bg-[#f7efe8] text-[#6c412f]">
      <Sidebar />
      <div className="pt-16 md:ml-64">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Header card */}
          <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-5 flex items-center gap-5">
            <img src={draft?.photo || "/assets/patient.png"} alt="" className="h-20 w-20 rounded-full border-4 border-[#e6ccb2]" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={draft?.name || ""}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full font-serif text-3xl bg-transparent border-b-2 border-[#6c412f]/40 focus:outline-none"
                placeholder="Name"
              />
              <div className="text-sm text-teal-700 mt-1">{draft?.dept || "Department"}</div>
            </div>
            <button
              onClick={saveDraft}
              className="flex items-center gap-2 bg-[#e6ccb2] px-6 py-2 rounded-lg hover:opacity-90 font-serif"
              aria-label="Save patient details"
            >
              <FaSave /> Save
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 text-sm font-semibold tracking-wide border-b border-[#6c412f]/20">
            {["overview", "medical", "appointments", "payments"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-t-lg border-t border-x border-[#6c412f]/20 ${
                  tab === t ? "bg-[#e6ccb2] text-[#6c412f]" : "bg-[#faf6f2] text-[#6c412f]/80 hover:bg-white"
                }`}
              >
                <span className="font-serif">{t[0].toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
          </div>

          {/* Body card */}
          <div className="rounded-xl border border-[#6c412f]/10 shadow-sm bg-white p-6 space-y-8">
            {tab === "overview" && draft && (
              <>
                {/* Demographics */}
                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Demographics</h3>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Name</span>
                      <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Age</span>
                      <input type="number" min={0} value={draft.age} onChange={(e) => setDraft({ ...draft, age: Number(e.target.value || 0) })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Gender</span>
                      <input type="text" value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" placeholder="Female / Male / Other" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Department</span>
                      <input type="text" value={draft.dept} onChange={(e) => setDraft({ ...draft, dept: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Email</span>
                      <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" placeholder="email@example.com" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Phone</span>
                      <input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" placeholder="+91-XXXXXXXXXX" />
                    </label>
                    <label className="flex flex-col sm:col-span-2">
                      <span className="font-serif text-sm mb-1">Address</span>
                      <textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Registered On</span>
                      <input type="date" value={draft.registeredOn} onChange={(e) => setDraft({ ...draft, registeredOn: e.target.value })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                  </div>
                </section>

                {/* Insurance */}
                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2 flex items-center justify-between">
                    Insurance (HIS)
                    <label htmlFor="insurance-upload" title="Upload Insurance Document" className="cursor-pointer text-[#6c412f] hover:text-[#e6ccb2] transition">
                      <FaFileUpload size={18} />
                    </label>
                  </h3>
                  <input
                    type="file"
                    id="insurance-upload"
                    className="hidden"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => onUpload(e, "insuranceDocs")}
                  />
                  <div className="grid sm:grid-cols-3 gap-6">
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Provider</span>
                      <input type="text" value={draft.insurance.provider} onChange={(e) => setDraft({ ...draft, insurance: { ...draft.insurance, provider: e.target.value } })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Policy No</span>
                      <input type="text" value={draft.insurance.policyNo} onChange={(e) => setDraft({ ...draft, insurance: { ...draft.insurance, policyNo: e.target.value } })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                    <label className="flex flex-col">
                      <span className="font-serif text-sm mb-1">Valid Till</span>
                      <input type="date" value={draft.insurance.validTill} onChange={(e) => setDraft({ ...draft, insurance: { ...draft.insurance, validTill: e.target.value } })} className="rounded border border-[#6c412f]/30 px-3 py-2 bg-white" />
                    </label>
                  </div>

                  {draft.attachments.insuranceDocs?.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {draft.attachments.insuranceDocs.map((src, i) => (
                        <div key={i} className="relative border border-[#6c412f]/10 rounded bg-[#faf6f2] flex justify-center items-center">
                          {src.startsWith("data:image") ? (
                            <img src={src} alt="Insurance Document" className="h-20 object-contain max-w-full" />
                          ) : (
                            <a href={src} target="_blank" rel="noopener noreferrer" className="px-2 underline">
                              Document {i + 1}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Room & Admissions */}
                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Room & Admissions (HIS)</h3>
                  <div className="text-sm">
                    {draft.his?.room ? (
                      <div className="space-y-1">
                        <div><span className="font-serif">Ward:</span> {draft.his.room.wardId || "—"}</div>
                        <div><span className="font-serif">Bed:</span> {draft.his.room.bedId || "—"}</div>
                      </div>
                    ) : (
                      <div className="text-teal-700">Not admitted currently.</div>
                    )}
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-6">
                    <div>
                      <div className="font-serif text-sm mb-1">Admissions</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {(draft.his?.admissions || []).map((a, i) => (
                          <li key={i}>{a.date} • {a.type} • {a.wardId}/{a.bedId}</li>
                        ))}
                        {!draft.his?.admissions?.length && <li>None</li>}
                      </ul>
                    </div>
                    <div>
                      <div className="font-serif text-sm mb-1">Discharges</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {(draft.his?.discharges || []).map((d, i) => (
                          <li key={i}>{d.date} • {d.type}</li>
                        ))}
                        {!draft.his?.discharges?.length && <li>None</li>}
                      </ul>
                    </div>
                  </div>
                </section>
              </>
            )}

            {tab === "medical" && draft && (
              <>
                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Medical History (EHR)</h3>
                  <ul className="space-y-3 bg-[#faf6f2] p-4 rounded border border-[#6c412f]/10 text-sm">
                    {(draft.ehr?.history || []).map((h, i) => (
                      <li key={i} className="p-3 rounded bg-white border border-[#6c412f]/10">
                        <div className="font-serif text-lg">{h.date}</div>
                        <div>{h.notes}</div>
                      </li>
                    ))}
                    {!draft.ehr?.history?.length && <li>No medical history records.</li>}
                  </ul>
                </section>

                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Lab Reports (EHR)</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-teal-700">Upload images or PDFs</div>
                    <label htmlFor="health-upload" title="Upload Lab Reports" className="cursor-pointer text-[#6c412f] hover:text-[#e6ccb2] transition">
                      <FaFileUpload size={18} />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="health-upload"
                    className="hidden"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => onUpload(e, "healthReports")}
                  />
                  <ul className="space-y-3 bg-[#faf6f2] p-4 rounded border border-[#6c412f]/10 text-sm">
                    {(draft.ehr?.labs || []).map((l, i) => (
                      <li key={i} className="p-3 rounded bg-white border border-[#6c412f]/10">
                        {l.date} • {l.test} • {l.result}
                      </li>
                    ))}
                    {!draft.ehr?.labs?.length && <li>No lab reports.</li>}
                  </ul>

                  {draft.attachments.healthReports?.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {draft.attachments.healthReports.map((src, i) => (
                        <div key={i} className="border border-[#6c412f]/10 rounded bg-[#faf6f2] flex justify-center items-center">
                          {src.startsWith("data:image") ? (
                            <img src={src} alt="Health Report" className="h-20 object-contain max-w-full" />
                          ) : (
                            <a href={src} target="_blank" rel="noopener noreferrer" className="px-2 underline">
                              Report {i + 1}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Prescriptions (EHR)</h3>
                  <ul className="space-y-3 bg-[#faf6f2] p-4 rounded border border-[#6c412f]/10 text-sm">
                    {(draft.ehr?.prescriptions || []).map((p, i) => (
                      <li key={i} className="p-3 rounded bg-white border border-[#6c412f]/10">
                        {p.date} • {p.meds} • {p.duration}
                      </li>
                    ))}
                    {!draft.ehr?.prescriptions?.length && <li>No prescriptions records.</li>}
                  </ul>
                </section>
              </>
            )}

            {tab === "appointments" && (
              <section>
                <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Appointments</h3>
                {appts.length > 0 ? (
                  <ul className="space-y-3 bg-[#faf6f2] p-4 rounded border border-[#6c412f]/10 text-sm">
                    {appts.map((a) => (
                      <li key={a.id} className="p-3 rounded bg-white border border-[#6c412f]/10">
                        <span className="font-serif text-lg">{a.date}</span> {a.time} • {a.doctorName || a.doctorId} • {a.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-teal-700 text-xs">No appointments found.</div>
                )}
              </section>
            )}

            {tab === "payments" && (
              <section>
                <h3 className="font-serif text-xl mb-4 border-b border-[#6c412f]/20 pb-2">Billing (HIS)</h3>
                {pays.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {pays.map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-[#faf6f2] p-3 rounded border border-[#6c412f]/10">
                        <div className="text-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                          <div className="font-serif text-lg">{p.date}</div>
                          <div className="font-serif text-lg">₹{p.amount}</div>
                          <div>{p.mode || "—"}</div>
                          <div className="text-green-700">{p.status}</div>
                          <div>{p.invoiceId}</div>
                        </div>
                        <button onClick={() => printInvoice(p)} title="Download / Print Invoice" className="text-[#6c412f] hover:text-[#e6ccb2] transition p-2">
                          <FaDownload size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-teal-700 text-xs">No billing transactions found.</div>
                )}

                {draft.attachments.billingInvoices?.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {draft.attachments.billingInvoices.map((src, i) => (
                      <div key={i} className="border border-[#6c412f]/10 rounded bg-[#faf6f2] flex justify-center items-center">
                        {src.startsWith("data:image") ? (
                          <img src={src} alt="Billing Invoice" className="h-24 object-contain max-w-full" />
                        ) : (
                          <a href={src} target="_blank" rel="noopener noreferrer" className="px-2 underline">
                            Invoice {i + 1}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          <Toaster position="top-right" />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
