import React from 'react'
import {  Route, Routes,Navigate } from "react-router-dom";
import {  authRoutes, adminRoutes } from './Routes/AllRoutes';
import NonAuthLayout from './Routes/middleware/NonAuthLayout';
import AuthLayout from './Routes/middleware/AuthLayout';
import AdminLayout from './Routes/middleware/AdminLayout';
import Layout from './Screens/Layout/Layout';
import "highlight.js/styles/github.css"; 
import { AccessibilityProvider } from './context/AccessibilityContext'; 
import { LanguageProvider } from './context/LanguageContext'; 


const App = () => {
  return (
    <React.Fragment>
      
        <Routes>
          <Route 
    path="/" 
    element={<Navigate to="/:lang/:theme" replace />} 
/>
          <Route 
            path="/:lang?/:theme?/*"
            element={
              <LanguageProvider>
                <AccessibilityProvider>
                  <NonAuthLayout />
                </AccessibilityProvider>
              </LanguageProvider>
            } 
          />

           {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<AuthLayout>{route.component}</AuthLayout>}
              key={idx}
            />
          ))}

          {adminRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AdminLayout>
                  <Layout>
                    {route.component}
                  </Layout>
                </AdminLayout>
              }
              key={idx}
            />
          ))}
        </Routes>
    </React.Fragment>
  )
}

export default App
