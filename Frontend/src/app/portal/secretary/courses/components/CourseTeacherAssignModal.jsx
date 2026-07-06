'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Check, UserCheck, AlertCircle, Layers } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function CourseTeacherAssignModal({ isOpen, onClose, course, onSuccess }) {
  const { showToast } = useToast();
  
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar Secciones y Docentes
  useEffect(() => {
    if (isOpen && course) {
      const loadData = async () => {
        setLoading(true);
        try {
          // 1. Cargar secciones escolares
          const allSections = await apiFetch('/api/v1/sections').catch(() => []);
          // Filtrar por nivel educativo para coincidir con el curso
          const matchedSections = allSections.filter(
            s => s.educationLevel?.toLowerCase() === course.educationLevel?.toLowerCase() &&
                 s.gradeLevel === course.gradeLevel
          );
          setSections(matchedSections);

          // 2. Cargar docentes activos
          const allUsers = await apiFetch('/api/user/usuarios').catch(() => []);
          const allTeachers = allUsers.filter(u => u.rol === 'DOCENTE' && u.activo);
          setTeachers(allTeachers);

          // Resetear selecciones
          setSelectedSectionId('');
          setSelectedTeacherId('');
        } catch (err) {
          showToast('No se pudieron cargar los datos de asignación.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const handleSubmit = async () => {
    if (!selectedSectionId) {
      showToast('Selecciona una sección escolar.', 'error');
      return;
    }
    if (!selectedTeacherId) {
      showToast('Selecciona un docente responsable.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Obtener asignaciones locales previas o inicializar
      const localDataStr = localStorage.getItem('local_assigned_classes');
      const localClasses = localDataStr ? JSON.parse(localDataStr) : [];

      const newAssignment = {
        id: Date.now(), // ID temporal
        sectionId: parseInt(selectedSectionId),
        courseId: course.id,
        teacherId: parseInt(selectedTeacherId)
      };

      // Guardar en el listado local
      localClasses.push(newAssignment);
      localStorage.setItem('local_assigned_classes', JSON.stringify(localClasses));

      showToast(`¡Curso "${course.name}" asignado y docente vinculado exitosamente (Local)!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast('Error al guardar la asignación local.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100/50 flex flex-col text-xs text-[#031553] text-left">
        
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Vincular Docente y Sección
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Cargando dependencias de asignación...</div>
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

            {/* Selector de Sección */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">
                1. Selecciona la Sección/Salón
              </label>
              {sections.length > 0 ? (
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-400 rounded-xl py-2 px-3 text-xs text-primary font-semibold outline-none cursor-pointer"
                >
                  <option value="">-- Seleccionar Sección --</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.gradeLevel}° "{sec.sectionName.toUpperCase()}" ({sec.educationLevel})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2 items-center bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                  <p>
                    No hay aulas creadas en el sistema para <strong>{course.gradeLevel}° de {course.educationLevel}</strong>. Crea el aula primero en Secciones.
                  </p>
                </div>
              )}
            </div>

            {/* Selector de Docente */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">
                2. Selecciona el Docente a cargo
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-400 rounded-xl py-2 px-3 text-xs text-primary font-semibold outline-none cursor-pointer"
              >
                <option value="">-- Seleccionar Docente --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
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
                disabled={submitting || !selectedSectionId || !selectedTeacherId}
                className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
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
