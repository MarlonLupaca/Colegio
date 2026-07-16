'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

import EnrollmentForm from './components/EnrollmentForm';
import EnrollmentTable from './components/EnrollmentTable';

export default function EnrollmentPage() {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  // Estados de datos
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos consolidados
  const fetchDatosMatricula = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Alumnos de user-service
      const allUsers = await apiFetch('/api/user/usuarios');
      const filteredStudents = allUsers ? allUsers.filter(u => u.rol === 'ALUMNO' && u.activo) : [];
      setStudents(filteredStudents);

      // 2. Secciones de section-service
      const allSections = await apiFetch('/api/v1/annual-sections');
      setSections(allSections || []);

      // 3. Matrículas de enrollment-service
      const allEnrollments = await apiFetch('/api/enrollment/enrollments');
      setEnrollments(allEnrollments || []);

    } catch (err) {
      console.error('Error cargando datos de matrícula:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDatosMatricula();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDatosMatricula]);

  // Eliminar matrícula (DELETE con confirmación premium)
  const handleDeleteEnrollment = async (idEnrollment) => {
    const isConfirmed = await askConfirmation({
      title: 'Anular Matrícula Escolar',
      message: '¿Está seguro de que desea anular el registro de matrícula de este estudiante en el período actual?',
      confirmLabel: 'Anular Matrícula',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/enrollment/enrollments/${idEnrollment}`, {
        method: 'DELETE'
      });

      showToast('Matrícula anulada correctamente del período actual.', 'success');
      fetchDatosMatricula(); // Recargar grilla
    } catch (err) {
      showToast(err.message || 'Error al anular la matrícula.', 'error');
    }
  };

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6 text-xs text-[#031553]">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <FolderKanban className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Módulo de Matrícula y Control</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Asignación de estudiantes a aulas, visualización de clases oficiales y control de ingreso escolar.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl">
          <Building2 className="w-4 h-4 text-[#031553] opacity-60" />
          <div>
            <div className="font-bold text-gray-700">Período Lectivo</div>
            <div className="text-[10px] text-gray-400 font-bold">{new Date().getFullYear()} - Activo</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Cargando datos del servidor académico...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna Izquierda: Formulario de Matrícula */}
          <div className="md:col-span-1">
            <EnrollmentForm
              students={students}
              sections={sections}
              onEnrollSuccess={fetchDatosMatricula}
            />
          </div>

          {/* Columna Derecha: Grilla de Matriculados */}
          <div className="md:col-span-2">
            <EnrollmentTable
              enrollments={enrollments}
              students={students}
              sections={sections}
              onDeleteEnrollment={handleDeleteEnrollment}
            />
          </div>
        </div>
      )}

    </div>
  );
}
