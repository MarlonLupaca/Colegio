'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Check, UserCheck, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function AddStudentsModal({ isOpen, onClose, sectionId, onSuccess }) {
  const { showToast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar estudiantes sin asignar
  useEffect(() => {
    if (isOpen) {
      const loadStudents = async () => {
        setLoading(true);
        try {
          // 1. Cargar todos los usuarios con ROL ALUMNO de user-service
          const allStudents = await apiFetch('/api/user/usuarios/rol/ALUMNO');
          const activeStudents = (allStudents || []).filter(u => u.activo);

          // 2. Cargar todas las matrículas existentes para filtrar los ya matriculados
          const enrollments = await apiFetch('/api/enrollment/enrollments');
          const enrolledStudentIds = new Set(enrollments.map(e => e.studentId));

          // 3. Filtrar alumnos que aún no tienen sección asignada
          const unassigned = activeStudents.filter(s => !enrolledStudentIds.has(s.id));
          setStudents(unassigned);
          setSelectedIds([]);
        } catch (err) {
          showToast('No se pudo cargar la lista de alumnos.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadStudents();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const handleRegister = async () => {
    if (selectedIds.length === 0) {
      showToast('Selecciona al menos un alumno para matricular.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const currentYear = new Date().getFullYear();
      
      // Enviar peticiones concurrentes para matricular a cada alumno
      await Promise.all(
        selectedIds.map(async (studentId) => {
          const payload = {
            studentId: studentId,
            sectionId: parseInt(sectionId),
            gradeLevel: 1, // Se ajusta dinámicamente en backend
            academicYear: currentYear,
            condition: 'REGULAR',
            status: 'CONFIRMADA'
          };
          return apiFetch('/api/enrollment/enrollments', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        })
      );

      showToast(`¡Se matricularon con éxito ${selectedIds.length} alumnos en el aula!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Error al matricular alumnos.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.nombres} ${s.apellidos}`.toLowerCase();
    const code = s.codigoUsuario?.toLowerCase() || '';
    return fullName.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100/50 flex flex-col max-h-[85vh] text-xs text-[#031553] text-left">
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Inscribir Alumnos a la Sección
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
              placeholder="Buscar estudiante por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer select-none"
              >
                {selectedIds.length === filteredStudents.length ? 'Desmarcar todos' : 'Seleccionar todos los filtrados'}
              </button>
              <span className="text-[10px] font-semibold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {selectedIds.length} seleccionados
              </span>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/35 min-h-[250px]">
          {loading ? (
            <p className="text-center py-12 text-gray-400">Buscando alumnos sin asignar...</p>
          ) : filteredStudents.map(student => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <div
                key={student.id}
                onClick={() => toggleSelect(student.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-200'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs select-none ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-gray-400'
                  }`}>
                    {student.nombres.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700">{student.nombres} {student.apellidos}</h5>
                    <p className="text-[10px] text-gray-400 font-bold">{student.codigoUsuario}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                  isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}

          {!loading && filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-gray-300" />
              <p>No se encontraron alumnos sin asignar para este nivel escolar.</p>
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
            onClick={handleRegister}
            disabled={submitting || selectedIds.length === 0}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            {submitting ? 'Inscribiendo...' : `Matricular Alumnos (${selectedIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
