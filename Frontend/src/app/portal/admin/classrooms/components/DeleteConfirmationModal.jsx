// app/portal/admin/classrooms/components/DeleteConfirmationModal.jsx
'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  classroom
}) {
  if (!isOpen || !classroom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden p-6 text-center animate-slide-up">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5" />
        </div>

        <h3 className="font-bold text-sm text-primary tracking-tight">¿Desactivar Aula?</h3>
        <p className="text-xs text-secondary mt-2 leading-relaxed">
          Estás a punto de desactivar el aula <strong className="text-primary">&quot;{classroom.roomNumber}&quot;</strong> en el edificio {classroom.building}.
          Las aulas desactivadas no podrán ser asignadas a nuevas secciones.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-bold text-secondary hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer select-none"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  );
}