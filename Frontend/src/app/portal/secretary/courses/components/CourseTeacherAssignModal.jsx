'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, UserCheck } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function CourseTeacherAssignModal({ isOpen, onClose, course, onSuccess }) {
  const { showToast } = useToast();
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherCode, setSelectedTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar docentes activos al abrir
  useEffect(() => {
    if (isOpen && course) {
      const loadData = async () => {
        setLoading(true);
        try {
          const allUsers = await apiFetch('/api/user/usuarios').catch(() => []);
          const allTeachers = allUsers.filter(u => u.rol === 'DOCENTE' && u.activo);
          setTeachers(allTeachers);
          setSelectedTeacherCode(course.teacherCode || '');
        } catch (err) {
          showToast('No se pudieron cargar los docentes activos.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, course, showToast]);

  if (!isOpen || !course) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Endpoint simplificado de asignación directa
      await apiFetch(`/api/v1/courses/${course.id}/assign-teacher?teacherCode=${selectedTeacherCode}`, {
        method: 'PUT'
      });

      showToast(`¡Docente asignado al curso "${course.name}" exitosamente!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Error al guardar la asignación del docente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100/50 flex flex-col text-xs text-[#031553] text-left animate-slide-up">
        
        {/* Header */}
        <div className="bg-primary text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-white/80" /> Vincular Docente al Curso
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Cargando docentes activos...</div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Resumen del curso */}
            <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4">
              <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {course.code}
              </span>
              <h4 className="font-bold text-sm text-[#031553] mt-1.5">{course.name}</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                Dirigido a: {course.gradeLevel}° de {course.educationLevel}
              </p>
            </div>

            {/* Selector de Docente */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">
                Selecciona el Docente a cargo del Curso
              </label>
              <select
                value={selectedTeacherCode}
                onChange={(e) => setSelectedTeacherCode(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-400 rounded-xl py-2 px-3 text-xs text-primary font-semibold outline-none cursor-pointer"
              >
                <option value="">Sin docente asignado (Nulo)</option>
                {teachers.map((t) => (
                  <option key={t.codigoUsuario} value={t.codigoUsuario}>
                    {t.nombres} {t.apellidos} ({t.codigoUsuario})
                  </option>
                ))}
              </select>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {submitting ? 'Guardando...' : 'Asignar Docente'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
