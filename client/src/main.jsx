// Inject dark class before React renders — prevents flash of unstyled content
document.documentElement.classList.add('dark');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: '#0F172A' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#0F172A' } },
              loading: { iconTheme: { primary: '#3B82F6', secondary: '#0F172A' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
