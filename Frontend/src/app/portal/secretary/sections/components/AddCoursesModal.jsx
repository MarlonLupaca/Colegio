'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Check, BookOpen, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function AddCoursesModal({ isOpen, onClose, sectionId, educationLevel, gradeLevel, onSuccess }) {
  const { showToast } = useToast();

  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar cursos
  useEffect(() => {
    if (isOpen) {
      const loadCourses = async () => {
        setLoading(true);
        try {
         
          let allCourses = [];
          if (educationLevel && gradeLevel) {
            const levelUpper = educationLevel.toUpperCase();
            allCourses = await apiFetch(`/api/v1/courses/filter/education-level-and-grade?educationLevel=${levelUpper}&gradeLevel=${gradeLevel}`);
          } else {
            allCourses = await apiFetch('/api/v1/courses');
          }


          const allAssigned = await apiFetch('/api/v1/assigned-classes').catch(() => []);
          const sectionAssigned = allAssigned.filter(a => a.annualSections?.id === sectionId);
          const assignedCourseIds = new Set(sectionAssigned.map(a => a.courseId));

          const unassigned = allCourses.filter(c => !assignedCourseIds.has(c.id));
          setCourses(unassigned);
          setSelectedIds([]);
        } catch (err) {
          showToast('No se pudieron cargar los cursos escolares.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadCourses();
    }
  }, [isOpen, sectionId, educationLevel, gradeLevel]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      showToast('Selecciona al menos un curso para asignar.', 'error');
      return;
    }

    setSubmitting(true);
    try {
   
      await Promise.all(
        selectedIds.map(async (courseId) => {
          const payload = {
            annualSections: {
              id: sectionId 
            },
            courseId: courseId, 
            teacherId: null
          };
          
          try {
            await apiFetch('/api/v1/assigned-classes', {
              method: 'POST',
              body: JSON.stringify(payload)
            });
          } catch {
            // Guardar localmente si el microservicio falla o no está encendido
            localClasses.push({
              id: Date.now() + courseId, // ID temporal
              sectionId: parseInt(sectionId),
              courseId: parseInt(courseId),
              teacherId: null
            });
          }
        })
      );

      // Guardar cambios locales acumulados
      localStorage.setItem('local_assigned_classes', JSON.stringify(localClasses));

      showToast(`¡Se asignaron exitosamente ${selectedIds.length} cursos al salón (Híbrido)!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast('Error al asignar materias al salón.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const name = c.name.toLowerCase();
    const code = c.code?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100/50 flex flex-col max-h-[85vh] text-xs text-[#031553] text-left">
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Asignar Cursos al Salón
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 space-y-3 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar curso por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {filteredCourses.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {selectedIds.length} seleccionados
              </span>
            </div>
          )}
        </div>

        {/* Courses List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/35 min-h-[250px]">
          {loading ? (
            <p className="text-center py-12 text-gray-400">Buscando asignaturas...</p>
          ) : filteredCourses.map(course => {
            const isSelected = selectedIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => toggleSelect(course.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                    ? 'bg-indigo-50/50 border-indigo-200'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs select-none ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-gray-400'
                    }`}>
                    {course.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700">{course.name}</h5>
                    <p className="text-[10px] text-gray-400 font-bold">{course.code}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'
                  }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}

          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-gray-300" />
              <p>No hay más asignaturas disponibles para agregar.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={submitting || selectedIds.length === 0}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            {submitting ? 'Asignando...' : `Asignar Cursos (${selectedIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
