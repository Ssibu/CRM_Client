import React, { createContext, useState, useEffect } from 'react';
const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'od' : 'en'));
  };
    useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const value = {
    language,       
    setLanguage,    
    toggleLanguage, 
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;