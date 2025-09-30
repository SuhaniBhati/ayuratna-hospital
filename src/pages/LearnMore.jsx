// src/pages/LearnMore.jsx
import React from "react";

/* All text and borders in brown shades only */
export default function LearnMore() {
  return (
    <div className="min-h-screen bg-[--color-cream] text-[--color-brown]">
      <main className="section py-12">
        <h1 className="text-3xl font-serif mb-4">Learn More</h1>
        <p className="mb-6">
          Ayuratna is a modern Ayurveda platform designed for hospitals,
          practitioners, and patients to collaborate with clarity and care.
          The guide below outlines how to operate core features effectively.
        </p>

        <section className="card p-6 md:p-8 space-y-6 text-[--color-brown] border border-[--color-brown]/20">
          <div>
            <h2 className="text-xl font-serif mb-2">Onboarding</h2>
            <p className="text-sm mb-2">
              Set up the organization profile, departments, therapies, and users.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Register hospital profile and verify credentials.</li>
              <li>Add departments and therapy offerings.</li>
              <li>Invite practitioners and administrative staff.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif mb-2">Scheduling & Appointments</h2>
            <p className="text-sm mb-2">
              Configure slots, durations, and reminders for smooth patient flow.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Create practitioner schedules with breaks and holidays.</li>
              <li>Enable confirmations, reminders, and rescheduling policies.</li>
              <li>Track no‑shows and streamline follow‑ups.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif mb-2">Patient Records</h2>
            <p className="text-sm mb-2">
              Maintain accurate clinical records aligned with Ayurveda practice.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Capture history, assessments, and dosha profiles.</li>
              <li>Prescribe herbs, therapies, and lifestyle recommendations.</li>
              <li>Store lab files and treatment notes securely.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif mb-2">Billing & Reports</h2>
            <p className="text-sm mb-2">
              Streamline payments and analytics for operational clarity.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Configure fees, invoices, and payment methods.</li>
              <li>Use dashboards for revenue and visit summaries.</li>
              <li>Export data for reconciliation and audits.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif mb-2">Support</h2>
            <p className="text-sm">
              For assistance, email <span className="text-[--color-teal]">contact@ayuratna.com</span>. Typical response time is 1–2 business days.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


