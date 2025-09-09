import React, {StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import AuthState from './context/AuthState';
import { ModalProvider } from "./context/ModalProvider";

import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById("root")).render(
  <StrictMode>

    <BrowserRouter  future={{ v7_startTransition: true, v7_relativeSplatPath: true }} >
      <ModalProvider>
      <AuthState>
      
        <App />

      </AuthState>
      </ModalProvider>

    </BrowserRouter>
  </StrictMode>
);

