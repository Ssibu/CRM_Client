import React, { useContext, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { nonAuthRoutes } from '@/Routes/AllRoutes';

import AuthContext from '@/context/AuthContext';
import AccessibilityContext from "@/context/AccessibilityContext";
import LanguageContext from "@/context/LanguageContext";

import Header from '@/Components/User/Layout/Header';
import Navbar from '@/Components/User/Layout/Navbar';
import Footer from '@/Components/User/Layout/Footer';
import Chatbot from "@/Components/User/Layout/Chatbot"; 
import Accessibility from "@/Components/User/Layout/Accessibility";

const NonAuthLayout = () => {
  const { user, loading } = useContext(AuthContext); // Re-added

  const { lang, theme } = useParams();
  const navigate = useNavigate();

  const { setLanguage } = useContext(LanguageContext);
  const { setIsNightMode } = useContext(AccessibilityContext);

  useEffect(() => {
    // Phase 1: URL Validation
    if (!lang || (lang !== 'en' && lang !== 'od')) {
      navigate('/en/light/', { replace: true });
      return;
    }
    if (!theme || (theme !== 'light' && theme !== 'dark')) {
      navigate(`/${lang}/light/`, { replace: true });
      return;
    }

    // Phase 2: Authentication Check
    // if (!loading && user) {
    //   navigate("/admin/dashboard", { replace: true });
    //   return;
    // }
    
    // Phase 3: State Synchronization
    setLanguage(lang);
    setIsNightMode(theme === 'dark');
  }, [lang, theme, user, loading, setLanguage, setIsNightMode, navigate]);

  // Re-added loading spinner
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <main id="main-content">
        <Routes>
          {nonAuthRoutes.map((route, idx) => (
            <Route
              key={idx}
              index={route.index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </main>
      <Footer />
      <Accessibility />
      <Chatbot />
    </>
  );
};

export default NonAuthLayout;