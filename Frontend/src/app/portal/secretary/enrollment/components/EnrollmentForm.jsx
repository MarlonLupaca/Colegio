'use client';

import React, { useState } from 'react';
import { UserCheck, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import { apiFetch } from '@/config/api';

export default function EnrollmentForm({ students, sections, onEnrollSuccess }) {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEnroll = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!selectedStudent) newErrors.selectedStudent = 'Debe seleccionar un estudiante';
    if (!selectedSection) newErrors.selectedSection = 'Debe seleccionar una sección';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Por favor complete los campos requeridos.', 'error');
      return;
    }

    const studentObj = students.find(s => s.id.toString() === selectedStudent);
    const sectionObj = sections.find(sec => sec.id.toString() === selectedSection);

    const isConfirmed = await askConfirmation({
      title: 'Formalizar Matrícula Escolar',
      message: `¿Está seguro de que desea matricular a '${studentObj?.nombres} ${studentObj?.apellidos}' en la sección '${sectionObj?.name || sectionObj?.gradeLevel + "° Grado"}'?`,
      confirmLabel: 'Matricular',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;
    setLoading(true);

    try {
      // Registrar matrícula en el backend
      await apiFetch('/api/enrollment/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          studentId: parseInt(selectedStudent),
          sectionId: parseInt(selectedSection),
          academicYear: new Date().getFullYear(),
          status: 'CONFIRMADA'
        })
      });

      showToast('Estudiante matriculado con éxito en el período actual.', 'success');
      
      // Limpiar y disparar éxito
      setSelectedStudent('');
      setSelectedSection('');
      onEnrollSuccess();

    } catch (err) {
      showToast(err.message || 'Error al procesar la matrícula.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-[#031553]">
      <h2 className="text-sm font-bold flex items-center gap-1.5 border-b pb-3 border-gray-100">
        <UserCheck className="w-4 h-4 text-[#031553]" /> Formalizar Matrícula
      </h2>
      
      <form onSubmit={handleEnroll} className="space-y-4">
        <div>
          <label className="block text-gray-400 font-bold mb-1">Estudiante (Solo alumnos registrados)</label>
          <select
            required
            value={selectedStudent}
            onChange={(e) => {
              setSelectedStudent(e.target.value);
              if (errors.selectedStudent) setErrors(prev => ({ ...prev, selectedStudent: null }));
            }}
            className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.selectedStudent ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
          >
            <option value="">Seleccione un alumno...</option>
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.nombres} {st.apellidos} - {st.codigoUsuario} (DNI: {st.dni})
              </option>
            ))}
          </select>
          {errors.selectedStudent && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.selectedStudent}</p>}
        </div>

        <div>
          <label className="block text-gray-400 font-bold mb-1">Sección Académica (Aula de Destino)</label>
          <select
            required
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              if (errors.selectedSection) setErrors(prev => ({ ...prev, selectedSection: null }));
            }}
            className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.selectedSection ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
          >
            <option value="">Seleccione una sección...</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name || `${sec.gradeLevel}° Grado - Sección ${sec.sectionCode || 'A'}`}
              </option>
            ))}
          </select>
          {errors.selectedSection && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.selectedSection}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-semibold py-2.5 px-6 rounded-xl shadow transition-all cursor-pointer text-[11px]"
          >
            {loading ? 'Procesando...' : 'Confirmar Matrícula'}
          </button>
        </div>
      </form>
    </div>
  );
}
