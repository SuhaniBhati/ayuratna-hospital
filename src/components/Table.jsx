// src/components/Table.jsx
import React from "react";

const Table = ({ columns = [], rows = [], onRowClick, rowKey }) => {
  const getKey = (row, idx) => {
    if (typeof rowKey === "function") return rowKey(row, idx);
    // Compose a safe key to avoid duplicates if ids are repeated
    const k = row?.id ?? idx;
    return typeof k === "string" || typeof k === "number" ? k : `${idx}-${JSON.stringify(row).length}`;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#6c412f]/15 bg-white/70">
      <table className="min-w-full text-left table-auto">
        <thead className="bg-[#f7efe8]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-sm font-medium text-[#6c412f]">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((r, idx) => (
              <tr
                key={getKey(r, idx)}
                onClick={() => onRowClick && onRowClick(r)}
                className="border-t border-[#6c412f]/15 hover:bg-[#f7efe8] cursor-pointer"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-sm text-[#6c412f]/90 align-middle">
                    {c.render ? c.render(r[c.key], r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-sm text-[#6c412f]/70" colSpan={columns.length}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;




