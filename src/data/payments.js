// src/data/payments.js
const today = new Date().toISOString().slice(0, 10);
const y1 = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const payments = [
  { id: "PM001", patientId: "P001", amount: 1200, mode: "UPI", status: "Paid", date: today },
  { id: "PM002", patientId: "P002", amount: 2500, mode: "Card", status: "Paid", date: today },
  { id: "PM003", patientId: "P003", amount: 800, mode: "Cash", status: "Paid", date: y1 },
  { id: "PM004", patientId: "P004", amount: 54000, mode: "Bank", status: "Pending", date: today },
  { id: "PM005", patientId: "P005", amount: 1800, mode: "UPI", status: "Paid", date: today }
];
