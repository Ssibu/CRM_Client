import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const variantConfig = {
  success: {
    icon: <CheckCircle className="w-10 h-10 text-green-500" />,
    title: "Success",
    bg: "bg-green-50",
  },
  error: {
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    title: "Error",
    bg: "bg-red-50",
  },
  warning: {
    icon: <AlertTriangle className="w-10 h-10 text-yellow-500" />,
    title: "Warning",
    bg: "bg-yellow-50",
  },
  info: {
    icon: <Info className="w-10 h-10 text-blue-500" />,
    title: "Information",
    bg: "bg-blue-50",
  },
};

export const ModalDialog = ({ open, onClose, variant = "info", message }) => {
  const { icon, title, bg } = variantConfig[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full max-w-md rounded shadow-lg p-6 ${bg}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <p className="mt-3 text-sm text-gray-700">{message}</p>

            <div className="mt-5 flex justify-end">
              <button  onClick={onClose}   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
                Okay
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
