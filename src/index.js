import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- 1. IMPORT YOUR MODAL PROVIDER ---
// Make sure the path is correct
import { ModalProvider } from './context/ModalProvider'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* --- 2. WRAP YOUR APP WITH THE PROVIDER --- */}
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();