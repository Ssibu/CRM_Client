import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const variantConfig = {
  success: {
    icon: <CheckCircle className="w-12 h-12 text-green-500" />,
    title: "Success",
    bg: "bg-white border border-green-200",
  },
  error: {
    icon: <XCircle className="w-12 h-12 text-red-500" />,
    title: "Error",
    bg: "bg-white border border-red-200",
  },
  warning: {
    icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    title: "Warning",
    bg: "bg-white border border-yellow-200",
  },
  info: {
    icon: <Info className="w-12 h-12 text-blue-500" />,
    title: "Information",
    bg: "bg-white border border-blue-200",
  },
};

export const ModalDialog = ({ open, onClose, variant = "info", message }) => {
  const { icon, title, bg } = variantConfig[variant];

  // mounted: controls whether component is in DOM
  // visible: controls which CSS classes are applied so transitions run
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId;
    let timeoutId;
    const TRANSITION_MS = 300; // must match your Tailwind duration

    if (open) {
      setMounted(true);
      // Wait a tick/frame so the element mounts with "hidden" classes,
      // then flip visible -> triggers CSS transition.
      rafId = requestAnimationFrame(() => {
        // tiny timeout sometimes stabilizes across browsers
        timeoutId = setTimeout(() => setVisible(true), 10);
      });

      // ESC -> close
      const onKey = (e) => {
        if (e.key === "Escape") onClose?.();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      // start exit animation, then unmount after duration
      setVisible(false);
      timeoutId = setTimeout(() => setMounted(false), TRANSITION_MS);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      // backdrop
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0"
      }`}
      // close when clicking the backdrop (but not when clicking inside the modal)
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div
        // modal card
        className={`w-full max-w-md rounded-xl shadow-2xl p-6 transform transition-all duration-300 ${bg} ${
          visible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop handler
      >
        <div className="flex flex-col items-center text-center">
          {icon}
          <h2 id="modal-title" className="mt-3 text-xl font-semibold">
            {title}
          </h2>
          <p id="modal-desc" className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
