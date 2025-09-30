// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * Global Navbar with hero-matching background.
 * Uses gradient-hero overlay color for visual continuity.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;
  const onLanding = path === "/";
  const onAuth = path === "/login" || path === "/signup";
  const onDashboard =
    path.startsWith("/dashboard") ||
    path.startsWith("/appointments") ||
    path.startsWith("/patients") ||
    path.startsWith("/doctors") ||
    path.startsWith("/payments") ||
    path.startsWith("/integration") ||
    path.startsWith("/reports");

  const handleLogout = () => navigate("/");

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-[--color-brown]/25">
      {/* Match hero gradient */}
      <div className="w-full gradient-hero/">
        <nav className="section h-16 flex items-center justify-between text-[--color-brown]">
          <Link to="/" className="inline-flex items-center gap-0.5 text-[--color-brown]">
            <img src="/assets/logo.jpg" alt="" className="w-14 h-14 rounded-full" />
            <span className="font-serif text-2xl ">Ayuratna</span>
          </Link>

          {onLanding && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-semibold transition hover:bg-white/40 border border-[--color-brown]/30 text-[--color-brown]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="group relative inline-flex items-center rounded-full font-semibold text-[--color-brown]"
              >
                <span className="absolute -inset-0.5 rounded-full bg-[--color-beige] opacity-70 blur transition group-hover:opacity-90" />
                <span className="relative z-10 px-5 py-2 rounded-full bg-white border border-[--color-brown]/30">
                  Sign Up
                </span>
              </Link>
            </div>
          )}

          {onAuth && (
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-semibold transition hover:bg-white/40 border border-[--color-brown]/30 text-[--color-brown]"
              >
                Home
              </Link>
            </div>
          )}

          {onDashboard && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Notifications"
                className="p-2 rounded-lg hover:bg-white/40 border border-[--color-brown]/30 text-[--color-brown]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22a2.75 2.75 0 0 1-2.45-1.5h4.9A2.75 2.75 0 0 1 12 22ZM20 17.5h-16l1.7-2.13V11a6.3 6.3 0 0 1 5-6.18V4a1.3 1.3 0 0 1 2.6 0v.82A6.3 6.3 0 0 1 18.3 11v4.37L20 17.5Z" />
                </svg>
              </button>
              <Link
                to="/settings"
                title="Settings"
                className="p-2 rounded-lg hover:bg-white/40 border border-[--color-brown]/30 text-[--color-brown]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14,12.94a7.27,7.27,0,0,0,.05-.94,7.27,7.27,0,0,0-.05-.94l2-1.55a.49.49,0,0,0,.12-.63l-1.9-3.29a.5.5,0,0,0-.6-.22l-2.35,1a7.51,7.51,0,0,0-1.63-.94l-.36-2.49A.5.5,0,0,0,12.86,2H11.14a.5.5,0,0,0-.5.42l-.36,2.49a7.51,7.51,0,0,0-1.63.94l-2.35-1a.5.5,0,0,0-.6.22L3.8,8.78a.49.49,0,0,0,.12.63l2,1.55a7.27,7.27,0,0,0-.05.94,7.27,7.27,0,0,0,.05.94l-2,1.55a.49.49,0,0,0-.12.63l1.9,3.29a.5.5,0,0,0,.6.22l2.35-1a7.51,7.51,0,0,0,1.63.94l.36,2.49a.5.5,0,0,0,.5.42h1.72a.5.5,0,0,0,.5-.42l.36-2.49a7.51,7.51,0,0,0,1.63-.94l2.35,1a.5.5,0,0,0,.6-.22l1.9-3.29a.49.49,0,0,0-.12-.63ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 px-4 py-2 rounded-lg font-semibold transition hover:bg-white/40 border border-[--color-brown]/30 text-[--color-brown]"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}



