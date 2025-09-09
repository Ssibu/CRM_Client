import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// 1. Create the context
const NavigationContext = createContext(null);

// 2. Create the Provider component
export const NavigationProvider = ({ children }) => {
  const [navigation, setNavigation] = useState([]);
  const [settings, setSettings] = useState({ showInnerpageSidebar: true }); // Default value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/menus`);
        
        // Destructure the data from the new API response shape
        setNavigation(response.data.navigation || []);
        setSettings(response.data.settings || { showInnerpageSidebar: true });
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch navigation data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNavData();
  }, []);

  const value = { navigation, settings, loading, error };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};