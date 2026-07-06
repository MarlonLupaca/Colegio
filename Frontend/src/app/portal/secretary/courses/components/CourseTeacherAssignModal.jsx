'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, UserCheck } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function CourseTeacherAssignModal({ isOpen, onClose, course, onSuccess }) {
  const { showToast } = useToast();
  
  const [teachers, setTeachers] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    if (isOpen && course) {
      const loadData = async () => {
        setLoading(true);
        try {
          // 1. Cargar docentes activos
          const allUsers = await apiFetch('/api/user/usuarios').catch(() => []);
          const allTeachers = allUsers.filter(u => u.rol === 'DOCENTE' && u.activo);
          setTeachers(allTeachers);

          // 2. Cargar todas las secciones para cruzar nombres
          const allSections = await apiFetch('/api/v1/annual-sections').catch(() => []);
          setSections(allSections);

          // 3. Cargar las clases asignadas en el backend que pertenecen a este curso
          const allAssigned = await apiFetch('/api/v1/assigned-classes').catch(() => []);
          const courseAssignments = allAssigned.filter(a => String(a.courseId) === String(course.id));
          setAssignedClasses(courseAssignments);

          // Limpiar selecciones
          setSelectedClassId('');
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

  // Al cambiar la clase/sección seleccionada, pre-cargar el docente correspondiente
  useEffect(() => {
    if (selectedClassId) {
      const match = assignedClasses.find(c => String(c.id) === String(selectedClassId));
      setSelectedTeacherId(match && match.teacherId ? String(match.teacherId) : '');
    } else {
      setSelectedTeacherId('');
    }
  }, [selectedClassId, assignedClasses]);

  if (!isOpen || !course) return null;

  const handleSubmit = async () => {
    if (!selectedClassId) {
      showToast('Selecciona la sección o salón a la cual le asignarás el docente.', 'error');
      return;
    }
    if (!selectedTeacherId) {
      showToast('Selecciona un docente responsable.', 'error');
      return;
    }

    const targetClass = assignedClasses.find(c => String(c.id) === String(selectedClassId));
    if (!targetClass) return;

    setSubmitting(true);
    try {
      const payload = {
        id: targetClass.id,
        annualSections: targetClass.annualSections,
        classroomOverrideId: targetClass.classroomOverrideId,
        courseId: targetClass.courseId,
        teacherId: parseInt(selectedTeacherId)
      };

      // Actualizar la asignación del docente al curso de esta sección en el backend
      await apiFetch(`/api/v1/assigned-classes/${targetClass.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      showToast(`¡Docente asignado al curso "${course.name}" exitosamente para el salón seleccionado!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Error al guardar la asignación del docente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper para resolver el nombre visible de la sección
  const getSectionLabel = (classItem) => {
    const secId = classItem.annualSections?.id;
    const secInfo = sections.find(s => s.id === secId);
    if (!secInfo) return `Sección ID: ${secId || 'N/A'}`;
    const letter = secInfo.sectionLetter || secInfo.sectionName || '';
    return `${secInfo.gradeLevel}° "${letter.toUpperCase()}" (${secInfo.educationLevel})`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100/50 flex flex-col text-xs text-[#031553] text-left">
        
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Vincular Docente al Curso
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

            {/* Selector de Aula/Sección asociada */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">
                1. Selecciona el Salón/Sección
              </label>
              {assignedClasses.length > 0 ? (
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-400 rounded-xl py-2 px-3 text-xs text-primary font-semibold outline-none cursor-pointer"
                >
                  <option value="">-- Seleccionar Salón donde se dicta --</option>
                  {assignedClasses.map((ac) => (
                    <option key={ac.id} value={ac.id}>
                      {getSectionLabel(ac)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800">
                  Este curso no está asignado a ninguna sección en la base de datos. Agrégalo primero a una Sección para poder asociarle un docente.
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
                disabled={!selectedClassId}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-400 rounded-xl py-2 px-3 text-xs text-primary font-semibold outline-none cursor-pointer disabled:opacity-50"
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
                disabled={submitting || !selectedClassId || !selectedTeacherId}
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
