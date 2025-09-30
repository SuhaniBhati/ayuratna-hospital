// src/utils/storage.js
import React from "react";

const READONLY_DUMMY_KEYS = new Set([
  "doctors",
  "patients",
  "appointments",
  "appointmentRequests",
  "shifts",
]);

async function importDoctors() {
  const mod = await import("../data/doctors.js");
  return Array.isArray(mod.doctors) ? mod.doctors : [];
}
async function importPatients() {
  const mod = await import("../data/patients.js");
  return Array.isArray(mod.patients) ? mod.patients : [];
}
async function importAppointments() {
  const mod = await import("../data/appointments.js");
  return Array.isArray(mod.appointments) ? mod.appointments : [];
}
async function importRequests() {
  const mod = await import("../data/requests.js");
  return Array.isArray(mod.requests) ? mod.requests : [];
}
async function importShifts() {
  const mod = await import("../data/shifts.js");
  return Array.isArray(mod.shifts) ? mod.shifts : [];
}

async function loadDummyForKey(key) {
  if (key === "doctors") return importDoctors();
  if (key === "patients") return importPatients();
  if (key === "appointments") return importAppointments();
  if (key === "appointmentRequests") return importRequests();
  if (key === "shifts") return importShifts();
  return null;
}

function indexById(list) {
  const map = new Map();
  for (const item of list || []) if (item?.id) map.set(item.id, item);
  return map;
}

function enrichAppointments(appts, patients, doctors) {
  const pMap = indexById(patients);
  const dMap = indexById(doctors);
  return (appts || []).map((a) => {
    const pn = a?.patientName || (a?.patientId ? pMap.get(a.patientId)?.name : "");
    const dn = a?.doctorName || (a?.doctorId ? dMap.get(a.doctorId)?.name : "");
    return { ...a, patientName: pn || "", doctorName: dn || "" };
  });
}

function getSyncSeedFallback(key, fallback) {
  if (READONLY_DUMMY_KEYS.has(key)) return Array.isArray(fallback) ? fallback : [];
  return fallback;
}

export function getLS(key, fallback = null) {
  try {
    if (READONLY_DUMMY_KEYS.has(key)) {
      return getSyncSeedFallback(key, fallback ?? []);
    }
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setLS(key, value) {
  try {
    if (READONLY_DUMMY_KEYS.has(key)) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeLS(key) {
  try {
    if (READONLY_DUMMY_KEYS.has(key)) return;
    localStorage.removeItem(key);
  } catch {}
}

export function useLocalStorage(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const stored = getLS(key, getSyncSeedFallback(key, defaultValue));
    return stored !== undefined && stored !== null ? stored : defaultValue;
  });

  React.useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (READONLY_DUMMY_KEYS.has(key)) {
        try {
          if (key === "appointments") {
            const [appts, pats, docs] = await Promise.all([
              importAppointments(),
              importPatients(),
              importDoctors(),
            ]);
            const enriched = enrichAppointments(appts, pats, docs);
            if (!cancelled) setState(enriched);
            return;
          }
          const seeds = await loadDummyForKey(key);
          if (!cancelled) setState(Array.isArray(seeds) ? seeds : []);
          return;
        } catch {
          if (!cancelled) setState([]);
          return;
        }
      }
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!cancelled) setState(parsed);
        } else if (!cancelled && defaultValue !== undefined) {
          localStorage.setItem(key, JSON.stringify(defaultValue));
          setState(defaultValue);
        }
      } catch {
        if (!cancelled) setState(defaultValue);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [key, defaultValue]);

  const setAndPersist = React.useCallback(
    (valueOrUpdater) => {
      setState((prev) => {
        const next = typeof valueOrUpdater === "function" ? valueOrUpdater(prev) : valueOrUpdater;
        if (!READONLY_DUMMY_KEYS.has(key)) {
          try {
            localStorage.setItem(key, JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    [key]
  );

  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return;
      if (READONLY_DUMMY_KEYS.has(key)) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : defaultValue;
        setState(parsed);
      } catch {
        setState(defaultValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, defaultValue]);

  return [state, setAndPersist];
}

// Selector hooks/utilities
export function usePatients() {
  const [patients] = useLocalStorage("patients", []);
  return patients;
}

export function useShifts() {
  const [shifts] = useLocalStorage("shifts", []);
  return shifts;
}

export function selectPatientByIdSync(patients, id) {
  if (!Array.isArray(patients) || !id) return null;
  return patients.find((p) => p.id === id) || null;
}
