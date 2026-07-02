'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  User, 
  BookOpen,
  Search
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import AddCoursesModal from './AddCoursesModal';

export default function SectionCoursesTab({ section }) {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar cursos asignados a esta sección
  const fetchAssignedClasses = async () => {
    if (!section?.id) return;
    setLoading(true);
    try {
      // 1. Obtener clases vinculadas a la sección
      const classes = await apiFetch(`/api/v1/assigned-classes/section/${section.id}`).catch(() => []);
      
      // 2. Obtener lista de cursos completa
      const courses = await apiFetch('/api/v1/courses').catch(() => []);

      // 3. Cruzar datos
      const mapped = classes.map(cls => {
        const courseInfo = courses.find(c => c.id === cls.courseId);
        return {
          id: cls.id,
          courseId: cls.courseId,
          name: courseInfo ? courseInfo.name : 'Curso Académico',
          code: courseInfo ? courseInfo.code : 'CUR-XXXX',
          teacher: cls.teacherId ? `Profesor ID: ${cls.teacherId}` : 'Sin docente asignado'
        };
      });

      setAssignedClasses(mapped);
    } catch (err) {
      console.error('Error al cargar cursos del salón:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedClasses();
  }, [section]);

  const handleDeleteCourse = async (assignedClass) => {
    const isConfirmed = await askConfirmation({
      title: 'Retirar Curso de la Sección',
      message: `¿Está seguro de que desea retirar la asignatura "${assignedClass.name}" de esta sección?`,
      confirmLabel: 'Retirar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/assigned-classes/${assignedClass.id}`, {
        method: 'DELETE'
      });
      showToast('Asignatura retirada correctamente.', 'success');
      fetchAssignedClasses();
    } catch (err) {
      showToast(err.message || 'No se pudo retirar la asignatura.', 'error');
    }
  };

  const filtered = assignedClasses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
          <BookOpen className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-bold text-secondary">Selecciona una sección</h3>
        <p className="text-xs text-secondary/60 mt-1">Haz clic en una sección del panel izquierdo</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-gray-100">
        <div>
          <h4 className="text-sm font-bold text-primary">
            Cursos y Docentes Asignados
          </h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {assignedClasses.length} cursos asignados a esta sección
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#031553] hover:bg-[#020d36] text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Asignar Materias
        </button>
      </div>

      <AddCoursesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionId={section.id}
        onSuccess={fetchAssignedClasses}
      />

      {/* Search */}
      {assignedClasses.length > 0 && (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar curso o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-100 focus:border-primary/40 rounded-xl py-2 pl-9 pr-3 text-xs text-primary outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      )}

      {/* Courses Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando malla curricular...</div>
      ) : filtered.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">N°</th>
                  <th className="py-3 px-4">Curso</th>
                  <th className="py-3 px-4">Docente</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 px-4 text-secondary/60 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-primary/40" />
                        <div>
                          <span>{item.name}</span>
                          <p className="text-[9px] text-gray-400 font-bold">{item.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary/40" />
                        {item.teacher}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCourse(item)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                        title="Retirar curso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">No hay materias vinculadas</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Haz clic en "Asignar Materias" para comenzar
          </p>
        </div>
      )}
    </div>
  );
}