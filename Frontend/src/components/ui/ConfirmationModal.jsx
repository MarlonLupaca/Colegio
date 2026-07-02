'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  title = '¿Confirmar Acción?', 
  message = '¿Está seguro de realizar esta operación?', 
  confirmLabel = 'Confirmar', 
  cancelLabel = 'Cancelar', 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in">
        
        {/* Header Alert Icon */}
        <div className="bg-[#031553]/5 p-5 flex flex-col items-center text-[#031553] relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#031553] p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h3 className="text-sm font-bold mt-3 text-center px-4">{title}</h3>
        </div>

        {/* Content Message */}
        <div className="p-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 text-xs text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer border border-gray-200 bg-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 text-xs bg-[#031553] hover:bg-[#020d36] text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
