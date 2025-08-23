// components/DeleteConfirmationModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, y: "-10%" },
  visible: { opacity: 1, y: "0%" },
};

const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  icon: Icon = AlertTriangle,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {Icon && (
            <div className="flex justify-center mb-3 text-red-500">
              <Icon size={40} />
            </div>
          )}
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
