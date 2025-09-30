// src/components/CalendarView.jsx
import React from "react";

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const fmt = (d) => d.toISOString().slice(0, 10);

export default function CalendarView({ items = [] }) {
  const [cursor, setCursor] = React.useState(new Date());
  const [selected, setSelected] = React.useState(fmt(new Date()));

  const s = startOfMonth(cursor);
  const e = endOfMonth(cursor);

  const days = [];
  for (let i = 0; i < s.getDay(); i++) days.push(null);
  for (let d = 1; d <= e.getDate(); d++) days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  const byDate = items.reduce((acc, a) => {
    const key = a.date;
    (acc[key] ||= []).push(a);
    return acc;
  }, {});

  const monthStr = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <button
            className="px-3 py-1.5 rounded-md bg-neutral-100 text-orange-900 hover:bg-neutral-200"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            ◀ Prev
          </button>
          <div className="font-serif text-orange-900 text-lg">{monthStr}</div>
          <button
            className="px-3 py-1.5 rounded-md bg-neutral-100 text-orange-900 hover:bg-neutral-200"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            Next ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs text-orange-800">
          <div className="text-center py-2 font-medium">Sun</div>
          <div className="text-center py-2 font-medium">Mon</div>
          <div className="text-center py-2 font-medium">Tue</div>
          <div className="text-center py-2 font-medium">Wed</div>
          <div className="text-center py-2 font-medium">Thu</div>
          <div className="text-center py-2 font-medium">Fri</div>
          <div className="text-center py-2 font-medium">Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d, idx) => {
            if (!d) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-24 rounded-lg bg-neutral-50 border border-neutral-200"
                />
              );
            }
            const key = fmt(d);
            const count = (byDate[key] || []).length;
            const isSelected = key === selected;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={[
                  "h-28 rounded-lg p-2 text-left transition-all",
                  "bg-neutral-50 border",
                  isSelected ? "border-orange-700 ring-2 ring-orange-200" : "border-neutral-200 hover:bg-neutral-100"
                ].join(" ")}
              >
                <div className="text-sm font-semibold text-orange-900">{d.getDate()}</div>
                {count > 0 && (
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 text-xs">
                    {count} appointments
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="font-serif text-orange-950 mb-3">Appointments on {selected}</div>
        <div className="space-y-3">
          {(byDate[selected] || []).map(a => (
            <div key={a.id} className="rounded-lg border border-neutral-200 bg-white p-3">
              <div className="text-orange-900 font-medium">{a.time} • {a.patientName || a.patientId}</div>
              <div className="text-xs text-orange-800 mt-0.5">
                {a.doctorName || a.doctorId} • {a.dept || a.type} • {a.status}
              </div>
            </div>
          ))}
          {(byDate[selected] || []).length === 0 && (
            <div className="text-sm text-orange-800">No appointments</div>
          )}
        </div>
      </div>
    </div>
  );
}


