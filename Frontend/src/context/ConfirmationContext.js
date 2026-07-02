'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const ConfirmationContext = createContext(null);

export function ConfirmationProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar'
  });
  
  // Guardar la función resolver de la Promesa activa
  const resolverRef = useRef(null);

  const askConfirmation = useCallback((options = {}) => {
    setModalState({
      isOpen: true,
      title: options.title || '¿Confirmar Acción?',
      message: options.message || '¿Está seguro de continuar?',
      confirmLabel: options.confirmLabel || 'Confirmar',
      cancelLabel: options.cancelLabel || 'Cancelar'
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
    }
  }, []);

  return (
    <ConfirmationContext.Provider value={{ askConfirmation }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmLabel={modalState.confirmLabel}
        cancelLabel={modalState.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation debe usarse dentro de un ConfirmationProvider');
  }
  return context;
}
