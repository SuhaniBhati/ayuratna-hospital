// src/pages/ForgotPassword.jsx — soft faint brown background (#e6ccb2)
import React from "react";

export default function ForgotPassword() {
  const [step, setStep] = React.useState("request");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pwd1, setPwd1] = React.useState("");
  const [pwd2, setPwd2] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const sendLink = () => {
    setStep("verify");
    setMsg("A verification code has been sent to the provided email.");
    setTimeout(() => setMsg(""), 2500);
  };
  const verify = () => {
    if (code.length === 6) {
      setStep("reset");
      setMsg("Email verified. Set a new password.");
      setTimeout(() => setMsg(""), 2000);
    } else {
      setMsg("Enter the 6‑digit code.");
      setTimeout(() => setMsg(""), 2000);
    }
  };
  const reset = (e) => {
    e.preventDefault();
    if (!pwd1 || pwd1 !== pwd2) {
      setMsg("Passwords do not match.");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    setMsg("Password updated successfully. You may login now.");
  };

  return (
    <div className="min-h-screen text-amber-950">
      <section className="min-h-screen flex items-center" style={{ backgroundColor: "#F0E2CE" }}>
        <div className="w-full">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-center">
              <div className="w-full max-w-xl rounded-xl bg-white/85 backdrop-blur p-6 shadow-[0_10px_30px_rgba(108,65,47,0.12)] border border-amber-900/30">
                <h1 className="text-2xl font-serif mb-2">Reset your password</h1>
                <p className="text-sm text-amber-900/80 mb-6">
                  Follow the steps to securely set a new password.
                </p>

                {step === "request" ? (
                  <div className="grid gap-3">
                    <label className="text-sm">Registered Email</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      onClick={sendLink}
                      className="mt-2 self-start px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90"
                    >
                      Send Code
                    </button>
                  </div>
                ) : step === "verify" ? (
                  <div className="grid gap-3">
                    <label className="text-sm">Verification Code</label>
                    <input
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="6-digit code"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={verify}
                        className="px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90"
                      >
                        Verify
                      </button>
                      <button
                        onClick={sendLink}
                        className="px-4 py-2 rounded-lg border border-amber-900/30 hover:bg-amber-100"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="grid gap-3" onSubmit={reset}>
                    <label className="text-sm">New Password</label>
                    <input
                      type="password"
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={pwd1}
                      onChange={(e) => setPwd1(e.target.value)}
                    />
                    <label className="text-sm">Confirm Password</label>
                    <input
                      type="password"
                      className="rounded-md border border-amber-900/30 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                      value={pwd2}
                      onChange={(e) => setPwd2(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="mt-2 self-start px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:opacity-90"
                    >
                      Update Password
                    </button>
                  </form>
                )}

                {msg && (
                  <div className="mt-4 rounded-md bg-amber-100 text-amber-900 px-3 py-2 text-sm">
                    {msg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


