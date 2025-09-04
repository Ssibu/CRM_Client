import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header
      role="banner"
      className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 relative z-50 flex items-center"
    >
      {/* Container */}
      <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center  h-full">
        
        {/* Left Side: Govt Logo + Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 h-full"
        >
          <img
            src="https://mtpl.work/dph/storage/homesettings/1754057142_odisha_logo.webp"
            alt="Government of Odisha Logo"
            className="h-full w-auto max-h-[80px] object-contain"
            loading="lazy"
          />
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
              Directorate of Public Health
            </span>
            <span className="text-sm lg:text-lg text-gray-700">
              Bhubaneswar, Odisha
            </span>
          </div>
        </motion.div>

        {/* Right Side: Name + Logo + CM Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 h-full"
        >
          <div className="flex flex-col justify-center text-right">
            <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
              Shri Mohan Charan Majhi
            </span>
            <span className="text-sm lg:text-lg text-gray-700">
              Hon'ble Chief Minister
            </span>
          </div>
          <img
            src="https://mtpl.work/dph/storage/homesettings/1752215187_cm_logo.webp"
            alt="Hon'ble Chief Minister"
            className="h-full max-h-[90px] w-auto object-contain"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Accessibility: hidden skip link */}
      {/* <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-md shadow-md"
      >
        Skip to main content
      </a> */}
    </header>
  );
}
