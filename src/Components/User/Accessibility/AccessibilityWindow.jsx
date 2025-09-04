import React, { useState, useContext, useEffect } from "react";
import {
  X, Type, Sun, Volume2, Search, Link as LinkIcon,
  Undo2, Maximize2, Minimize2, Settings, Wrench, MousePointerClick, Languages
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilitySlider from "./AccessibilitySlider";
import AccessibilityContext from "@/context/AccessibilityContext"
export default function AccessibilityWindow({ isOpen, onClose }) {
   const {
    fontSize, setFontSize,
    letterSpacing, setLetterSpacing,
    lineHeight, setLineHeight,
    isBigCursor, setIsBigCursor,
    isNightMode, setIsNightMode,
    resetAllSettings,
  } = useContext(AccessibilityContext);
   const [activeTab, setActiveTab] = useState("Adjustments");
  
  const [openSlider, setOpenSlider] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);

  const adjustmentOptions = [
    { id: "fontSize", label: "Font Size", icon: <Type />, type: "slider" },
    { id: "textSpacing", label: "Text Spacing", icon: <Type />, type: "slider" },
    { id: "lineHeight", label: "Line Height", icon: <Type />, type: "slider" },
    { id: "nightMode", label: "Night Mode", icon: <Sun />, type: "toggle" },
  ];
  
  const toolOptions = [
    { id: "bigCursor", label: "Big Cursor", icon: <MousePointerClick />, type: "toggle" },
    { id: "speaker", label: "Speaker", icon: <Volume2 />, type: "widget" },
    { id: "translate", label: "Translate (OD)", icon: <Languages />, type: "placeholder" },
    { id: "search", label: "Search", icon: <Search />, type: "link", path: "/search" },
    { id: "sitemap", label: "Sitemap", icon: <LinkIcon />, type: "link", path: "/sitemap" },
  ];
  const handleButtonClick = (opt) => {
    // Handle Toggles
    if (opt.type === 'toggle') {
      if (opt.id === 'nightMode') setIsNightMode(!isNightMode);
      if (opt.id === 'bigCursor') setIsBigCursor(!isBigCursor);
    }
    // Handle Sliders
    if (opt.type === 'slider') {
      setOpenSlider(openSlider === opt.id ? null : opt.id);
    }
    // Handle Speaker Widget
    if (opt.id === 'speaker') {
      setIsSpeakerEnabled(!isSpeakerEnabled);
    }
    // The 'translate' placeholder button will do nothing by default
  };

  const handleSpeak = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Please select some text on the page to hear it read aloud.");
    }
  };


  const renderOptions = (options) =>
    options.map((opt) => {
      if (opt.type === 'link') {
        return (
          <Link to={opt.path} key={opt.id} className="block">
            <motion.div /* ... */ > {/* ... a styled div for the link ... */} </motion.div>
          </Link>
        );
      }
      return (
        <motion.div key={opt.id} className="flex flex-col">
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick(opt)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200 h-full ${
                opt.type === 'placeholder' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
            disabled={opt.type === 'placeholder'}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full text-blue-600 bg-blue-100 mb-2">{opt.icon}</div>
            <span className="text-sm font-medium text-gray-700 text-center">{opt.label}</span>
          </motion.button>

          {opt.type === "slider" && openSlider === opt.id && (
            <div className="p-3 border-t bg-white">
              {opt.id === "fontSize" && <AccessibilitySlider value={fontSize} setValue={setFontSize} min={12} max={24} step={1} unit="px" />}
              {opt.id === "textSpacing" && <AccessibilitySlider value={letterSpacing} setValue={setLetterSpacing} min={0} max={5} step={0.5} unit="px" />}
              {opt.id === "lineHeight" && <AccessibilitySlider value={lineHeight} setValue={setLineHeight} min={1.2} max={2.5} step={0.1} unit="" />}
            </div>
          )}

          {opt.id === 'speaker' && isSpeakerEnabled && (
            <div className="p-3 border-t bg-white">
              <button onClick={handleSpeak} className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Speak Selected Text
              </button>
            </div>
          )}
        </motion.div>
      )
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMaximized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
          )}

          <motion.section
            role="dialog"
            aria-label="Accessibility Options"
            layout // <-- enables smooth size/position animation
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              layout: { type: "spring", stiffness: 200, damping: 25 },
            }}
            className={`fixed z-50 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden`}
            style={{
              bottom: isMaximized ? "auto" : "6rem", // smooth positioning
              right: "1.5rem",
              top: isMaximized ? "6%" : "auto",
              width: isMaximized ? "53vw" : "380px",
              height: isMaximized ? "85vh" : "520px",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 text-white bg-gradient-to-r from-indigo-600 to-amber-300">
              <div>
                <h2 className="text-xl font-semibold">
                  Accessibility Settings
                </h2>
                <p className="text-sm opacity-90">
                  Customize your browsing experience
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={
                    isMaximized ? "Restore window" : "Maximize window"
                  }
                >
                  {isMaximized ? <Minimize2 /> : <Maximize2 />}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close accessibility menu"
                  className="p-2 rounded-full hover:bg-white/20 text-white 
                             focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4 bg-gray-50">
  {["Adjustments", "Tools"].map((tab) => (
    <button
      key={tab}
      className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
      onClick={() => setActiveTab(tab)}
    >
      <span className="flex items-center gap-2">
        {tab === 'Adjustments' ? <Settings size={16}/> : <Wrench size={16} />}
        {tab}
      </span>
    </button>
  ))}
</div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
  {activeTab === "Adjustments" && (
    <>
      <h3 className="font-medium text-gray-700 mb-3">Style Adjustments</h3>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">{renderOptions(adjustmentOptions)}</div>
    </>
  )}
  {activeTab === "Tools" && (
    <>
      <h3 className="font-medium text-gray-700 mb-3">Tools & Utilities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{renderOptions(toolOptions)}</div>
    </>
  )}
</div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
  <button 
    onClick={resetAllSettings}
    className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
  >
    <Undo2 className="mr-2" size={16} /> Reset All
  </button>
</div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
