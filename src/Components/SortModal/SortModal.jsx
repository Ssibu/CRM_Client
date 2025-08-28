// components/SortModal/SortModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const sheetVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: { y: 30, opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

const SortModal = ({ isOpen, onClose, title, children, footer }) => {
  // Hide body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
            onMouseDown={onClose}
          />

          {/* Modal */}
          <motion.div
            key="sheet"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sheetVariants}
            className="fixed z-50 inset-0 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sort-modal-title"
            onMouseDown={onClose}
          >
            <div
              className="w-full max-w-2xl mx-auto rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-200 overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <div>
                  <h3 id="sort-modal-title" className="text-lg font-semibold">
                    {title || "Reorder Items"}
                  </h3>
                  {/* <p className="text-sm text-gray-500 mt-1">
                    Drag to reorder — changes are local until you save.
                  </p> */}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-full  hover:bg-gray-200 transition"
                >
                  {/* Larger, darker close icon for better visibility */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SortModal;
