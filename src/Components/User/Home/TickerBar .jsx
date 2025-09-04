import React, { useEffect, useState, useCallback } from "react";
import {  AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Accessible News Ticker Component for Government Websites
 * Complies with GIGW (Guidelines for Indian Government Websites)
 * Features: WCAG 2.1 AA compliance, responsive design, keyboard navigation
 */
const TickerBar = () => {
  const newsItems = [
    "Workshop on AI & ML scheduled for Sept 10, 2025",
    "Admissions open for the 2025 batch",
    "Annual Sports Meet starts next week",
    "Scholarship applications deadline extended",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextItem = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % newsItems.length),
    [newsItems.length]
  );

  const prevItem = useCallback(
    () =>
      setCurrentIndex(
        (prev) => (prev - 1 + newsItems.length) % newsItems.length
      ),
    [newsItems.length]
  );

  // Auto-advance news items
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextItem, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextItem]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === ' ' || e.key === 'Spacebar') setIsPaused(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevItem, nextItem]);

  const buttons = [
    {
      label: "Mission",
      img: "https://mtpl.work/dph/assets/user/images/mission.gif",
      hoverColor: "rgba(143, 112, 243, 1)", // Government blue
      description: "Our institutional mission statement"
    },
    {
      label: "Vision",
      img: "https://mtpl.work/dph/assets/user/images/vision.gif",
      hoverColor: "rgba(255, 193, 7, 1)", // Government green
      description: "Our long-term vision for excellence"
    },
    {
      label: "Objectives",
      img: "https://mtpl.work/dph/assets/user/images/objective.gif",
      hoverColor: "rgba(33, 150, 243, 1)", // Government brown
      description: "Our strategic objectives and goals"
    },
  ];

  // Accessible icon button component
  const IconButton = ({ onClick, icon: Icon, label, className = "" }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${className}`}
    >
      <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
    </motion.button>
  );

  return (
    <div className="w-full bg-white shadow-md rounded-none md:rounded-sm overflow-hidden" role="region" aria-label="News and Information">
      <div className="flex flex-col md:flex-row items-stretch justify-between min-h-16">
        {/* News Section */}
        <div className="flex flex-col md:flex-row flex-1 bg-gradient-to-r from-[rgb(78,81,229)] from-[1%] to-[rgb(251,207,125,0.98)] to-[100%] text-white">
          {/* News Label */}
          <div className="px-4 py-3 md:py-0 flex items-center justify-center font-semibold text-sm md:text-base whitespace-nowrap border-b md:border-b-0 md:border-r border-solid border-white border-opacity-30 bg-blue-900 md:bg-transparent">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              News & Events
            </span>
          </div>

          {/* News Content */}
          <div className="relative flex-1 flex items-center justify-between px-4 py-3 md:py-0">
            {/* Mobile Marquee */}
            <div className="md:hidden w-full overflow-hidden" aria-live="polite">
              <div
                className="inline-block animate-marquee text-sm font-medium whitespace-nowrap"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                style={{ animationPlayState: isPaused ? "paused" : "running" }}
              >
                {newsItems.map((item, index) => (
                  <span key={index} className="mx-4">
                    {item}
                    {index < newsItems.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Fade Animation */}
            <div className="hidden md:flex flex-1 overflow-hidden items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-base font-medium whitespace-nowrap text-white"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  aria-live="polite"
                >
                  {newsItems[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex gap-2 ml-4 text-black">
              <IconButton 
                onClick={prevItem} 
                icon={ChevronLeft} 
                label="Previous news item" 
              />
              <IconButton 
                onClick={nextItem} 
                icon={ChevronRight} 
                label="Next news item" 
              />
              <IconButton
                onClick={() => setIsPaused(!isPaused)}
                icon={isPaused ? Play : Pause}
                label={isPaused ? "Play news ticker" : "Pause news ticker"}
              />
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex gap-2">
              <IconButton 
                onClick={() => setIsPaused(!isPaused)}
                icon={isPaused ? Play : Pause}
                label={isPaused ? "Play news ticker" : "Pause news ticker"}
                className="bg-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className="flex flex-col md:flex-row bg-gray-100 divide-y md:divide-y-0 md:divide-x divide-solid divide-gray-300" 
          role="navigation" 
          aria-label="Key information links"
        >
          {buttons.map((btn, i) => (
            <motion.button
              key={i}
              whileHover="hover"
              whileFocus="hover"
              initial="rest"
              animate="rest"
              variants={{
                rest: {
                  backgroundColor: "#ffffff",
                  borderRadius: "0px",
                },
                hover: { 
                  backgroundColor: btn.hoverColor,
                  color: "#ffffff"
                },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative flex items-center justify-center gap-3 px-[3rem] py-3 
                text-gray-800 text-sm font-semibold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset"
              aria-describedby={`button-desc-${i}`}
            >
              <span className="sr-only" id={`button-desc-${i}`}>
                {btn.description}
              </span>
              <img
                src={btn.img}
                alt=""
                className="w-[3rem] h-[3rem] rounded-full object-cover border-4"
                style={{ borderColor: btn.hoverColor }}
                aria-hidden="true"
              />
              <span className="relative z-10 text-gray-800 group-hover:text-white">
                {btn.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerBar;