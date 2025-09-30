// src/data/shifts.js
function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // local date, not UTC
}

const today = todayLocal();

export const shifts = [
  // Doctors
  { id: "S001", date: today, role: "Doctor", staffId: "D001", name: "Dr. Ananya Rao", dept: "Ayurveda", shift: "Morning (08:00-14:00)" },
  { id: "S002", date: today, role: "Doctor", staffId: "D002", name: "Dr. Arjun Nair", dept: "Panchakarma", shift: "Evening (14:00-20:00)" },
  { id: "S003", date: today, role: "Doctor", staffId: "D004", name: "Dr. Rishi Mehta", dept: "Orthopedics", shift: "Night (20:00-08:00)" },
  { id: "S004", date: today, role: "Doctor", staffId: "D005", name: "Dr. Neha Kulkarni", dept: "Dermatology", shift: "Morning (08:00-14:00)" },

  // Nurses
  { id: "S101", date: today, role: "Nurse", staffId: "N001", name: "Nurse Priya", dept: "Pediatrics", shift: "Morning (08:00-14:00)" },
  { id: "S102", date: today, role: "Nurse", staffId: "N002", name: "Nurse Rahul", dept: "Orthopedics", shift: "Evening (14:00-20:00)" },
  { id: "S103", date: today, role: "Nurse", staffId: "N003", name: "Nurse Meena", dept: "Ayurveda", shift: "Night (20:00-08:00)" }
];
