import React from "react";
import { motion } from "framer-motion";

export default function GemLoader() {
  return (
    <motion.div
      initial={{ rotateY: 0, opacity: 0 }}
      animate={{
        rotateY: 360,
        opacity: 1,
        boxShadow:
          "0 0 8px 2px #8b5cf6, 0 0 20px 6px #a78bfa, 0 0 40px 10px #c4b5fd",
      }}
      exit={{ opacity: 0 }}
      transition={{
        repeat: Infinity,
        duration: 1.8,
        ease: "linear",
      }}
      className="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-3xl shadow-lg"
      style={{
        transformStyle: "preserve-3d",
        filter: "drop-shadow(0 0 6px #a78bfa)",
        clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
      }}
    >
      <motion.div
        className="absolute top-1 left-1 w-8 h-8 rounded-3xl bg-white opacity-30"
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "linear",
        }}
        style={{ filter: "blur(2px)" }}
      />
    </motion.div>
  );
}
