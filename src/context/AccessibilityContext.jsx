import React, { createContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // === STATE FOR ALL STYLE MODIFIER SETTINGS ===

  const [fontSize, setFontSize] = useState(16);          // In pixels
  const [letterSpacing, setLetterSpacing] = useState(0);    // In pixels
  const [lineHeight, setLineHeight] = useState(1.5);      // Unitless multiplier (e.g., 1.5 = 150%)
  const [isBigCursor, setIsBigCursor] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false); 

  // === EFFECT TO APPLY STYLES GLOBALLY ===
  // This runs whenever a setting changes.
  useEffect(() => {
    const root = document.documentElement; // The <html> tag
    const body = document.body;           // The <body> tag

    // Apply direct style modifications
    root.style.fontSize = `${fontSize}px`;
    body.style.letterSpacing = `${letterSpacing}px`;
    body.style.lineHeight = `${lineHeight}`;

    // Apply features by toggling a CSS class on the <html> tag
    const toggleClass = (className, condition) => {
      root.classList.toggle(className, condition);
    };

    toggleClass('big-cursor', isBigCursor);
    toggleClass('night-mode', isNightMode);

  }, [fontSize, letterSpacing, lineHeight, isBigCursor, isNightMode]);

  // === FUNCTION TO RESET SETTINGS ===
  const resetAllSettings = () => {
    setFontSize(16);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setIsBigCursor(false);
    setIsNightMode(false);
  };

  // === PROVIDE ALL VALUES TO THE APP ===
  const value = {
    fontSize, setFontSize,
    letterSpacing, setLetterSpacing,
    lineHeight, setLineHeight,
    isBigCursor, setIsBigCursor,
    isNightMode, setIsNightMode,
    resetAllSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;