import React, { useState,useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // ✅ Make sure this filename is correct and matches the actual file
import { useNavigate } from 'react-router-dom';

const AuthState = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Automatically fetch user session on page refresh
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user once when component mounts
  useEffect(() => {
    fetchUser();
  }, []);



  // ✅ Login function
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      setUser(response.data.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
      return false;
    }
  };
useEffect(() => {
  if (!loading && !user) {
    navigate('/login');
  }
}, [user, loading, navigate]);



  // Logout function
   const logout = async () => {
    try {
      await axios.post(  `${process.env.REACT_APP_API_URL}/admin/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    setUser(null);
    navigate('/login'); // Redirect after logout
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;