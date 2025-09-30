// src/data/appointments.js
const today = new Date().toISOString().slice(0, 10);
const tPlus1 = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const tMinus1 = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const appointments = [
  { id: "A001", patientId: "P001", doctorId: "D001", date: today, time: "10:30", status: "Confirmed", type: "OPD" },
  { id: "A002", patientId: "P002", doctorId: "D002", date: today, time: "12:00", status: "Pending", type: "OPD" },
  { id: "A003", patientId: "P003", doctorId: "D001", date: tMinus1, time: "15:00", status: "Completed", type: "OPD" },
  { id: "A004", patientId: "P004", doctorId: "D004", date: tPlus1, time: "09:15", status: "Pending", type: "OPD" },
  { id: "A005", patientId: "P005", doctorId: "D005", date: today, time: "17:00", status: "Confirmed", type: "OPD" }
];
