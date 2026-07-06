'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Check, UserCheck, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export default function AssignTeacherModal({ isOpen, onClose, assignedClassId, courseName, onSuccess }) {
  const { showToast } = useToast();
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar todos los docentes
  useEffect(() => {
    if (isOpen) {
      const loadTeachers = async () => {
        setLoading(true);
        try {
          const allUsers = await apiFetch('/api/user/usuarios');
          const allTeachers = allUsers.filter(u => u.rol === 'DOCENTE' && u.activo);
          setTeachers(allTeachers);
          setSelectedTeacherId(null);
        } catch (err) {
          showToast('No se pudo cargar la lista de docentes.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadTeachers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedTeacherId) {
      showToast('Selecciona un docente para el curso.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Intentar buscar en localStorage primero
      const localDataStr = localStorage.getItem('local_assigned_classes');
      const localClasses = localDataStr ? JSON.parse(localDataStr) : [];
      const localIdx = localClasses.findIndex(c => c.id === assignedClassId);

      if (localIdx !== -1) {
        // Modificar en localStorage
        localClasses[localIdx].teacherId = parseInt(selectedTeacherId);
        localStorage.setItem('local_assigned_classes', JSON.stringify(localClasses));
      } else {
        // Intentar actualizar en el backend, o fallback local si falla
        try {
          const currentAssigned = await apiFetch(`/api/v1/assigned-classes/${assignedClassId}`);
          const payload = {
            id: currentAssigned.id,
            annualSection: currentAssigned.annualSection,
            courseId: currentAssigned.courseId,
            teacherId: parseInt(selectedTeacherId)
          };
          await apiFetch(`/api/v1/assigned-classes/${assignedClassId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
        } catch {
          // Fallback a localStorage si falla el backend
          const newAssignment = {
            id: assignedClassId,
            courseId: assignedClassId, // Usamos la misma ID como temporal
            teacherId: parseInt(selectedTeacherId)
          };
          localClasses.push(newAssignment);
          localStorage.setItem('local_assigned_classes', JSON.stringify(localClasses));
        }
      }

      showToast('¡Docente asignado correctamente al curso!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Error al asignar el docente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const fullName = `${t.nombres} ${t.apellidos}`.toLowerCase();
    const code = t.codigoUsuario?.toLowerCase() || '';
    return fullName.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100/50 flex flex-col max-h-[80vh] text-xs text-[#031553] text-left">
        
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Asignar Docente: {courseName}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar docente por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Teachers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/35 min-h-[200px]">
          {loading ? (
            <p className="text-center py-12 text-gray-400">Buscando docentes...</p>
          ) : filteredTeachers.map(teacher => {
            const isSelected = selectedTeacherId === teacher.id;
            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
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
                    {teacher.nombres.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700">{teacher.nombres} {teacher.apellidos}</h5>
                    <p className="text-[10px] text-gray-400 font-bold">{teacher.codigoUsuario}</p>
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

          {!loading && filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-gray-300" />
              <p>No se encontraron docentes disponibles en el sistema.</p>
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
            disabled={submitting || !selectedTeacherId}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            {submitting ? 'Asignando...' : 'Asignar Docente'}
          </button>
        </div>

      </div>
    </div>
  );
}
