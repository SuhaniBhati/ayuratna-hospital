// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-3 px-3 py-2 rounded-lg transition text-[#f7efe8] hover:bg-[#5a3626]";
const activeBase = "bg-[#5a3626] border border-[#f7efe8]/20 shadow-sm";

export default function Sidebar() {
  return (
    <aside
      className="
        hidden md:flex
        fixed left-0 top-16
        h-[calc(100vh-4rem)] w-64
        flex-col gap-2
        bg-[#6c412f] text-[#f7efe8]
        p-4
        z-40
      "
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="px-2 py-3">
        <div className="inline-flex items-center gap-3">
          <img
            src="/assets/logo.jpg"
            alt="Ayuratna logo"
            className="w-12 h-12 rounded-full ring-2 ring-[#f7efe8]/20"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg leading-none"style={{ color: "#e6ccb2" }}>Ayuratna</span>
            <span className="text-[10px] mt-1 text-[#f7efe8]/80 tracking-wide">
              Modern Ayurveda Hospital
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeBase : ""}`
          }
        >
          <span className="inline-flex w-5 h-5 items-center justify-center">🏠</span>
          Dashboard Overview
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeBase : ""}`
          }
        >
          <span className="inline-flex w-5 h-5 items-center justify-center">🧑‍⚕️</span>
          Patient Management
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeBase : ""}`
          }
        >
          <span className="inline-flex w-5 h-5 items-center justify-center">📅</span>
          Appointment Scheduling
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeBase : ""}`
          }
        >
          <span className="inline-flex w-5 h-5 items-center justify-center">👨‍⚕️</span>
          Doctor & Staff Management
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeBase : ""}`
          }
        >
          <span className="inline-flex w-5 h-5 items-center justify-center">📊</span>
          Reports & Analytics
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs px-2 text-[#f7efe8]/70">
        © 2025 Ayuratna
      </div>
    </aside>
  );
}

