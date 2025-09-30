// src/pages/Signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const steps = ["Hospital", "Manager", "Account", "Verify"];

export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    nin: "",
    hospitalName: "",
    hfr: "",
    managerName: "",
    designation: "",
    hpid: "",
    email: "",
    password: "",
    otp: "",
    terms: false,
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e) => {
    e.preventDefault();
    // rudimentary completeness check
    const required =
      form.nin &&
      form.hospitalName &&
      form.hfr &&
      form.managerName &&
      form.designation &&
      form.hpid &&
      form.email &&
      form.password &&
      form.otp &&
      form.terms;

    if (!required) {
      alert("Please complete all fields and accept Terms & Conditions.");
      return;
    }

    localStorage.setItem("hospitalProfile", JSON.stringify(form));
    // redirect to Login after successful signup
    nav("/login");
  };

  return (
    <div className="min-h-screen text-amber-950">
      {/* Hero-style background with soft faint brown */}
      <section className="min-h-screen flex items-center" style={{ backgroundColor: "#e6ccb2" }}>
        <div className="w-full">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <form onSubmit={submit} className="w-full max-w-2xl mx-auto rounded-xl bg-white/85 backdrop-blur shadow-[0_10px_30px_rgba(108,65,47,0.12)] border border-amber-900/30">
              {/* Header */}
              <div className="p-6 border-b border-amber-900/30">
                <h2 className="font-serif text-2xl">Create hospital account</h2>
                <div className="mt-3 w-full rounded-full h-2 bg-amber-200">
                  <div
                    className="h-2 rounded-full bg-teal-600 transition-all"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-amber-900/80">{steps[step]}</div>
              </div>

              {/* Body */}
              <div className="p-6 grid gap-4">
                {step === 0 && (
                  <>
                    <label className="text-sm">National Identification Number (NIN)</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.nin}
                      onChange={(e) => setForm({ ...form, nin: e.target.value })}
                    />
                    <label className="text-sm">Hospital Name (from HFR)</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.hospitalName}
                      onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                    />
                    <label className="text-sm">HFR Code</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.hfr}
                      onChange={(e) => setForm({ ...form, hfr: e.target.value })}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <label className="text-sm">Facility Manager Name</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.managerName}
                      onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                    />
                    <label className="text-sm">Designation</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    />
                    <label className="text-sm">HPID</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.hpid}
                      onChange={(e) => setForm({ ...form, hpid: e.target.value })}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <label className="text-sm">Hospital Email</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <label className="text-sm">Password</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      type="password"
                      placeholder="At least 8 chars"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <label className="text-sm">OTP Verification (Email)</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter OTP"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    />
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                        className="accent-teal-600"
                      />
                      Terms & Conditions
                    </label>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex justify-between">
                <button type="button" onClick={back} className="px-4 py-2 rounded-lg border border-amber-900/30 hover:bg-amber-100">
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90"
                  >
                    Next
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90">
                    Create Account
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

