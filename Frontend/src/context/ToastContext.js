'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    setToast({ message, type });
    
    // Auto-ocultar
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </ToastContext.Provider>
  );
}

// Hook personalizado para usar el Toast en cualquier pantalla
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}
