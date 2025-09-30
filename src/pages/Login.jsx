// src/pages/Login.jsx — soft faint brown background (#e6ccb2) with Tailwind inline style
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const [form, setForm] = React.useState({ user: "", password: "", otp: "", remember: false });
  const [otpStage, setOtpStage] = React.useState("idle");
  const [showPwd, setShowPwd] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const sendOtp = () => {
    setOtpStage("sent");
    setToast("OTP sent to registered email.");
    setTimeout(() => setToast(""), 2000);
  };
  const verifyOtp = () => {
    if (form.otp.length === 6) {
      setOtpStage("verified");
      setToast("OTP verified successfully.");
    } else {
      setToast("Please enter the 6‑digit OTP.");
    }
    setTimeout(() => setToast(""), 2000);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("auth", JSON.stringify({ user: form.user, ts: Date.now(), remember: form.remember }));
    nav("/dashboard");
  };
  const otpButtonLabel = otpStage === "idle" ? "Send OTP" : otpStage === "sent" ? "Resend OTP" : "OTP Verified";

  return (
    <div className="min-h-screen text-amber-950">
      {/* Soft faint brown using exact hex */}
      <section className="min-h-screen flex items-center" style={{ backgroundColor: "#F0E2CE" }}>
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="hidden md:flex justify-center">
                <img src="/assets/hospital.png" alt="Hospital" className="h-24 md:h-28 drop-shadow-md opacity-90" />
              </div>

              <div className="flex justify-center">
                <form
                  onSubmit={onSubmit}
                  className="w-full max-w-md rounded-xl bg-white/85 backdrop-blur p-6 shadow-[0_10px_30px_rgba(108,65,47,0.12)] border border-amber-900/30"
                >
                  <h2 className="font-serif text-2xl mb-1">Hospital Login</h2>
                  <p className="text-sm text-amber-900/80 mb-4">Secure access for registered facilities</p>

                  <label className="block text-sm mb-1">NIN / Username</label>
                  <input
                    className="w-full mb-3 rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="1234-5678-9012 or username"
                    value={form.user}
                    onChange={(e) => setForm({ ...form, user: e.target.value })}
                    required
                  />

                  <label className="block text-sm mb-1">Password</label>
                  <div className="relative mb-3">
                    <input
                      type={showPwd ? "text" : "password"}
                      className="w-full rounded-md border border-amber-900/30 px-3 py-2 pr-24 outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md border border-amber-900/30 text-sm hover:bg-amber-100"
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={otpStage === "verified" ? undefined : sendOtp}
                        className="px-3 py-2 rounded-md border border-amber-900/30 hover:bg-amber-100 text-sm disabled:opacity-60"
                        disabled={otpStage === "verified"}
                      >
                        {otpButtonLabel}
                      </button>

                      {otpStage !== "idle" && (
                        <>
                          <input
                            className="flex-1 rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="6-digit OTP"
                            inputMode="numeric"
                            maxLength={6}
                            value={form.otp}
                            onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                          />
                          <button
                            type="button"
                            onClick={verifyOtp}
                            className="px-3 py-2 rounded-md bg-teal-600 text-white text-sm hover:opacity-90"
                          >
                            Verify OTP
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                        className="accent-teal-600"
                      />
                      Remember me
                    </label>

                    <a href="/forgot-password" className="text-blue-600 hover:underline">
                      Forgot Password
                    </a>
                  </div>

                  <button className="w-full px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90">
                    Login Securely
                  </button>

                  {toast && (
                    <div className="mt-4 rounded-md bg-amber-100 text-amber-900 px-3 py-2 text-sm">
                      {toast}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}






