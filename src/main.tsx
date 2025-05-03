
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster />
        <SonnerToaster position="top-right" closeButton richColors />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
