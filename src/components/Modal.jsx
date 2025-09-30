// src/components/Modal.jsx
import React from "react";

/**
 * Modal component
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title: string
 * - children: ReactNode
 * - actions: ReactNode (buttons area)
 * - className: optional extra classes for the dialog container (e.g., !max-w-3xl)
 * - bodyClassName: optional extra classes for the body wrapper (e.g., max-h-[70vh] overflow-y-auto)
 */
const Modal = ({ open, onClose, title, children, actions, className = "", bodyClassName = "" }) => {
  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Dialog */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl border border-[#6c412f]/10 ${className}`}
        onClick={stop}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#6c412f]/15 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-serif text-lg" style={{ color: "#6c412f" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6c412f]/70 hover:text-[#6c412f] rounded p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={`p-5 ${bodyClassName}`}>{children}</div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-end gap-2 border-t border-[#6c412f]/15 rounded-b-2xl bg-[#faf6f2]">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default Modal;


