// src/data/patients.js
const today = new Date().toISOString().slice(0, 10);
const y1 = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const y2 = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

export const patients = [
  { id: "P001", name: "Rohan Sharma", age: 32, gender: "Male", dept: "Ayurveda", phone: "+91-98xxxxxxx1", email: "rohan@example.com", photo: "/assets/patient.png", address: "Indiranagar, BLR", registeredOn: today, ipd: null },
  { id: "P002", name: "Aditi Verma", age: 28, gender: "Female", dept: "Panchakarma", phone: "+91-98xxxxxxx2", email: "aditi@example.com", photo: "/assets/patient.png", address: "HSR Layout, BLR", registeredOn: today, ipd: { admittedOn: today, wardId: "W002", bedId: "B202", dischargedOn: null } },
  { id: "P003", name: "Kabir Khan", age: 45, gender: "Male", dept: "Ayurveda", phone: "+91-98xxxxxxx3", email: "kabir@example.com", photo: "/assets/patient.png", address: "Koramangala, BLR", registeredOn: y1, ipd: null },
  { id: "P004", name: "Meera Gupta", age: 36, gender: "Female", dept: "Orthopedics", phone: "+91-98xxxxxxx4", email: "meera@example.com", photo: "/assets/patient.png", address: "Jayanagar, BLR", registeredOn: y2, ipd: { admittedOn: y1, wardId: "W003", bedId: "B301", dischargedOn: null } },
  { id: "P005", name: "Sanjay Patel", age: 52, gender: "Male", dept: "Dermatology", phone: "+91-98xxxxxxx5", email: "sanjay@example.com", photo: "/assets/patient.png", address: "Whitefield, BLR", registeredOn: today, ipd: null }
];
