// src/data/requests.js
const today = new Date().toISOString().slice(0, 10);
const tPlus1 = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const tPlus2 = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

export const requests = [
  { id: "R001", patientId: "P003", patientName: "Kabir Khan", dept: "Ayurveda", date: today, time: "11:15", note: "Follow-up for back pain" },
  { id: "R002", patientId: "P001", patientName: "Rohan Sharma", dept: "Panchakarma", date: tPlus1, time: "14:30", note: "Detox consultation" },
  { id: "R003", patientId: "P005", patientName: "Sanjay Patel", dept: "Dermatology", date: tPlus2, time: "16:00", note: "Skin rash review" }
];
