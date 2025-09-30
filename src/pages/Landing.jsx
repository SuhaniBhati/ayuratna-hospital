// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const FeatureCard = ({ icon, title, text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.6, delay }}
    className="card hover-card p-6 surface text-[--color-brown] border border-[--color-brown]/20"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[--color-beige] text-[--color-brown] mb-4">
      <img src={`/assets/${icon}`} alt="" className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-serif mb-2">{title}</h3>
    <p className="text-sm text-[--color-brown]/80">{text}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="min-h-screen text-[--color-brown]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/assets/background.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="section relative py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-serif tracking-tight">
                Ayuratna
              </h1>
              <p className="mt-3 text-lg md:text-xl">
                Modern Ayurveda Healthcare
              </p>
              <p className="mt-4 max-w-2xl text-[--color-brown]/85">
                Experience a calm, efficient platform crafted for Ayurveda
                hospitals and practitioners. Manage appointments, records, and
                therapies with thoughtful tools that honor tradition while
                embracing modern care.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center rounded-xl font-semibold text-[--color-brown]"
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-[--color-beige] blur opacity-70 transition duration-300 group-hover:opacity-90" />
                  <span className="relative z-10 px-6 py-3 rounded-xl bg-white border border-[--color-brown]/30 shadow-sm">
                    Get Started
                  </span>
                </Link>

                <Link
                  to="/learn-more"
                  className="inline-flex items-center px-6 py-3 rounded-xl border-2 border-[--color-brown]/40 font-semibold transition-all hover:bg-[--color-beige]/40 hover:shadow-md text-[--color-brown]"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="justify-self-center">
              <img
                src="/assets/herbs.png"
                alt=""
                className="w-64 md:w-80 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="hospital.png"
            title="Hospital Onboarding"
            text="Seamless registration and management suite tailored for Ayurveda centers."
            delay={0.05}
          />
          <FeatureCard
            icon="doctor.png"
            title="Doctor Scheduling"
            text="Manage practitioner availability, bookings, and reminders with ease."
            delay={0.15}
          />
          <FeatureCard
            icon="patient.png"
            title="Patient Records"
            text="Secure EHR with treatment history, herbs, and follow-ups."
            delay={0.25}
          />
        </div>
      </section>

      {/* Footer — brown background, cream text for perfect contrast */}
      <footer className="bg-[--color-brown] text-[--color-cream]">
        <div className="section py-14">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <img src="/assets/logo.png" alt="" className="w-6 h-6" />
                <span className="font-serif text-xl">Ayuratna</span>
              </div>
              <p className="text-sm/6 opacity-90 max-w-sm">
                Blending timeless Ayurvedic wisdom with modern software to
                support care teams and enrich patient journeys.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-3">Contact</h4>
              <ul className="space-y-2 text-sm/6">
                <li>123 Ayurveda Marg, New Delhi, India</li>
                <li>
                  <a
                    href="mailto:contact@ayuratna.com"
                    className="hover:text-[--color-beige] transition"
                  >
                    contact@ayuratna.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919876543210"
                    className="hover:text-[--color-beige] transition"
                  >
                    +91 98765 43210
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-3">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="hover:text-[--color-beige] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.01H7.9v-2.92h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.92h-2.32V22C18.34 21.24 22 17.1 22 12.07z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-[--color-beige] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.87-2.36 8.5 8.5 0 0 1-2.7 1.03A4.24 4.24 0 0 0 12 8.24c0 .33.04.65.1.96A12.04 12.04 0 0 1 3.15 5.16a4.23 4.23 0 0 0-.57 2.13 4.24 4.24 0 0 0 1.89 3.53 4.2 4.2 0 0 1-1.92-.53v.05c0 2.07 1.47 3.8 3.42 4.2-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.07a4.25 4.25 0 0 0 3.96 2.94A8.5 8.5 0 0 1 2 19.54a12 12 0 0 0 6.51 1.9c7.81 0 12.08-6.47 12.08-12.08l-.01-.55A8.6 8.6 0 0 0 22.46 6z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-[--color-beige] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.94 8.5H3.56V21h3.38V8.5zM5.25 3a2 2 0 1 0 0 4.01 2 2 0 0 0 0-4zM21 21h-3.37v-6.5c0-1.55-.03-3.55-2.17-3.55-2.18 0-2.52 1.7-2.52 3.44V21H9.57V8.5h3.24v1.7h.05c.45-.84 1.55-1.73 3.19-1.73 3.41 0 4.04 2.25 4.04 5.18V21z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-[--color-beige] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.75a1 1 0 1 1-2.001-.001A1 1 0 0 1 18 6.75z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs">
            © 2025 Ayuratna. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
