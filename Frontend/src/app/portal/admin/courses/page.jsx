'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  Trash2,
  Clock,
  GraduationCap,
  X,
  Save
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import { validateForm, isRequired, minLength, isInRange } from '@/hooks/useFormValidation';

export default function AdminCoursesPage() {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Modales
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Estados de errores de validación
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Formulario de creación
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    educationLevel: 'primaria',
    gradeLevel: 1,
    academicArea: 'matematica',
    hoursPerWeek: 4
  });

  // Formulario de edición
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    educationLevel: 'primaria',
    gradeLevel: 1,
    academicArea: 'matematica',
    hoursPerWeek: 4
  });

  // Resetear errores cuando cambian los modales
  useEffect(() => {
    if (!isNewOpen) {
      setTimeout(() => {
        setCreateErrors({});
      }, 0);
    }
  }, [isNewOpen]);

  useEffect(() => {
    if (!isEditOpen) {
      setTimeout(() => {
        setEditErrors({});
      }, 0);
    }
  }, [isEditOpen]);

  // Cargar cursos desde el backend
  const fetchCourses = useCallback(async () => {
    try {
      const data = await apiFetch('/api/v1/courses');
      setCourses(data || []);
    } catch (err) {
      console.error('Error cargando cursos:', err.message);
    }
  }, []);

  const [allUsers, setAllUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    try {
      const users = await apiFetch('/api/user/usuarios');
      setAllUsers(users || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err.message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCourses, fetchUsers]);

  const getTeacherForCourse = (teacherCode) => {
    if (!teacherCode) return 'Sin docente asignado';
    const user = allUsers.find(u => u.codigoUsuario === teacherCode);
    return user ? `${user.nombres} ${user.apellidos}` : teacherCode;
  };

  // Guardar un nuevo curso
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const rules = {
      name: [
        { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
        { check: (v) => minLength(v, 3), msg: 'El nombre debe tener al menos 3 caracteres' }
      ],
      hoursPerWeek: [
        { check: (v) => isRequired(v), msg: 'Las horas semanales son obligatorias' },
        { check: (v) => isInRange(v, 1, 15), msg: 'Las horas semanales deben estar entre 1 y 15' }
      ]
    };

    const { isValid, errors: valErrors } = validateForm(formData, rules);
    setCreateErrors(valErrors);

    if (!isValid) {
      showToast('Por favor corrige los errores del formulario.', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await apiFetch('/api/v1/courses', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      showToast(`Curso '${result.name}' registrado con éxito.`, 'success');
      fetchCourses();
      setIsNewOpen(false);
      setCreateErrors({});
      
      setFormData({
        name: '',
        description: '',
        educationLevel: 'primaria',
        gradeLevel: 1,
        academicArea: 'matematica',
        hoursPerWeek: 4
      });

    } catch (err) {
      showToast(err.message || 'Error al registrar el curso.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Guardar modificaciones del curso
  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    const rules = {
      name: [
        { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
        { check: (v) => minLength(v, 3), msg: 'El nombre debe tener al menos 3 caracteres' }
      ],
      hoursPerWeek: [
        { check: (v) => isRequired(v), msg: 'Las horas semanales son obligatorias' },
        { check: (v) => isInRange(v, 1, 15), msg: 'Las horas semanales deben estar entre 1 y 15' }
      ]
    };

    const { isValid, errors: valErrors } = validateForm(editFormData, rules);
    setEditErrors(valErrors);

    if (!isValid) {
      showToast('Por favor corrige los errores del formulario.', 'error');
      return;
    }
    
    const isConfirmed = await askConfirmation({
      title: 'Modificar Curso',
      message: '¿Está seguro de que desea guardar los cambios en la estructura de este curso?',
      confirmLabel: 'Guardar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;
    setLoading(true);

    try {
      await apiFetch(`/api/v1/courses/${selectedCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });

      showToast('Estructura de curso actualizada correctamente.', 'success');
      fetchCourses();
      setIsEditOpen(false);
      setSelectedCourse(null);
      setEditErrors({});
    } catch (err) {
      showToast(err.message || 'Error al actualizar el curso.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Alternar el estado Activo/Inactivo (PATCH)
  const toggleCourseStatus = async (course) => {
    const action = course.isActive ? 'deactivate' : 'activate';
    const actionLabel = course.isActive ? 'desactivar' : 'activar';

    const isConfirmed = await askConfirmation({
      title: `${actionLabel.toUpperCase()} CURSO`,
      message: `¿Está seguro de que desea ${actionLabel} el curso '${course.name}'?`,
      confirmLabel: actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1),
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/courses/${course.id}/${action}`, {
        method: 'PATCH'
      });

      showToast(`Curso ${course.isActive ? 'desactivado' : 'activado'} correctamente.`, 'success');
      fetchCourses();
    } catch (err) {
      showToast(err.message || 'Error al cambiar estado del curso.', 'error');
    }
  };

  // Eliminar físicamente un curso (DELETE)
  const handleDeleteCourse = async (course) => {
    const isConfirmed = await askConfirmation({
      title: 'ELIMINAR CURSO DEFINITIVAMENTE',
      message: `¿Está seguro de que desea borrar de forma permanente el curso '${course.name}'?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/courses/${course.id}`, {
        method: 'DELETE'
      });

      showToast('Curso eliminado correctamente.', 'success');
      fetchCourses();
    } catch (err) {
      showToast(err.message || 'Error al eliminar el curso.', 'error');
    }
  };

  // Ordenar cursos por fecha de creación descendente (los más nuevos primero)
  const sortedCourses = [...courses].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });

  // Filtrar cursos
  const filteredCourses = sortedCourses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.academicArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6 text-xs text-[#031553]">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Plan Curricular y Cursos</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Definición de asignaturas, áreas académicas, cargas horarias y niveles de la institución.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar curso por código o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#031553] text-[#031553]"
            />
          </div>
          
          <button
            onClick={() => setIsNewOpen(true)}
            className="flex items-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Crear Curso
          </button>
        </div>
      </div>

      {/* Cursos Table List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Código / Asignatura</th>
                <th className="py-3.5 px-6">Área Académica</th>
                <th className="py-3.5 px-6">Nivel Educativo</th>
                <th className="py-3.5 px-6">Grado</th>
                <th className="py-3.5 px-6">Docente</th>
                <th className="py-3.5 px-6 text-center">Horas/Semana</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {paginatedCourses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-[#031553] text-sm">{c.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold font-mono mt-0.5">{c.code}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-600 capitalize">
                    {c.academicArea?.replace('_', ' ')}
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize font-bold text-gray-600 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {c.educationLevel}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-600">
                    {c.gradeLevel} Grado
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{getTeacherForCourse(c.teacherCode)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600">
                      <Clock className="w-3 h-3" /> {c.hoursPerWeek} hrs
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                       onClick={() => toggleCourseStatus(c)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                      }`}
                    >
                      {c.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedCourse(c);
                          setEditFormData({
                            name: c.name,
                            description: c.description || '',
                            educationLevel: c.educationLevel,
                            gradeLevel: c.gradeLevel,
                            academicArea: c.academicArea,
                            hoursPerWeek: c.hoursPerWeek
                          });
                          setIsEditOpen(true);
                        }}
                        className="bg-gray-100 hover:bg-[#031553] hover:text-white text-[#031553] p-2 rounded-xl transition-all cursor-pointer border border-gray-200/40"
                        title="Editar estructura"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-xl transition-all cursor-pointer border border-rose-100"
                        title="Borrar curso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    No se encontraron asignaturas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4 sm:px-6 select-none">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-700">
                  Mostrando <span className="font-bold text-[#031553]">{startIndex + 1}</span> a{' '}
                  <span className="font-bold text-[#031553]">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de{' '}
                  <span className="font-bold text-[#031553]">{totalItems}</span> resultados
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs gap-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-lg p-2 text-gray-400 hover:bg-slate-50 border border-gray-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'z-10 bg-[#031553] text-white border-[#031553] shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-lg p-2 text-gray-400 hover:bg-slate-50 border border-gray-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Registrar Asignatura */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Registrar Curso en Plan Curricular
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Curso *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Álgebra y Lógica"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (createErrors.name) setCreateErrors(prev => ({ ...prev, name: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                    createErrors.name ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                  }`}
                />
                {createErrors.name && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Área Curricular</label>
                <select
                  value={formData.academicArea}
                  onChange={(e) => setFormData({ ...formData, academicArea: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] capitalize"
                >
                  <option value="matematica">Matemática</option>
                  <option value="comunicacion">Comunicación</option>
                  <option value="ciencia_tecnologia">Ciencia y Tecnología</option>
                  <option value="ciencias_sociales">Ciencias Sociales</option>
                  <option value="desarrollo_personal_civica">Desarrollo Personal y Cívica</option>
                  <option value="educacion_fisica">Educación Física</option>
                  <option value="arte_cultura">Arte y Cultura</option>
                  <option value="ingles">Inglés</option>
                  <option value="educacion_religiosa">Educación Religiosa</option>
                  <option value="educacion_trabajo">Educación para el Trabajo</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Nivel</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] capitalize"
                  >
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Grado</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                  >
                    <option value="1">1er Grado</option>
                    <option value="2">2do Grado</option>
                    <option value="3">3er Grado</option>
                    <option value="4">4to Grado</option>
                    <option value="5">5to Grado</option>
                    <option value="6">6to Grado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Horas/Semana *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="15"
                    value={formData.hoursPerWeek}
                    onChange={(e) => {
                      setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) });
                      if (createErrors.hoursPerWeek) setCreateErrors(prev => ({ ...prev, hoursPerWeek: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                      createErrors.hoursPerWeek ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                    }`}
                  />
                  {createErrors.hoursPerWeek && <p className="text-[10px] text-rose-600 font-bold mt-1">{createErrors.hoursPerWeek}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Descripción (Opcional)</label>
                <textarea
                  placeholder="Sumilla o temario del curso..."
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] resize-none"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#031553] text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-[#020d36] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Asignatura'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Asignatura */}
      {isEditOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateCourse} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" /> Modificar Estructura de Asignatura
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCourse(null);
                }}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Curso *</label>
                <input
                  required
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, name: e.target.value });
                    if (editErrors.name) setEditErrors(prev => ({ ...prev, name: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                    editErrors.name ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                  }`}
                />
                {editErrors.name && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Área Curricular</label>
                <select
                  value={editFormData.academicArea}
                  onChange={(e) => setEditFormData({ ...editFormData, academicArea: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] capitalize"
                >
                  <option value="matematica">Matemática</option>
                  <option value="comunicacion">Comunicación</option>
                  <option value="ciencia_tecnologia">Ciencia y Tecnología</option>
                  <option value="ciencias_sociales">Ciencias Sociales</option>
                  <option value="desarrollo_personal_civica">Desarrollo Personal y Cívica</option>
                  <option value="educacion_fisica">Educación Física</option>
                  <option value="arte_cultura">Arte y Cultura</option>
                  <option value="ingles">Inglés</option>
                  <option value="educacion_religiosa">Educación Religiosa</option>
                  <option value="educacion_trabajo">Educación para el Trabajo</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Nivel</label>
                  <select
                    value={editFormData.educationLevel}
                    onChange={(e) => setEditFormData({ ...editFormData, educationLevel: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] capitalize"
                  >
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Grado</label>
                  <select
                    value={editFormData.gradeLevel}
                    onChange={(e) => setEditFormData({ ...editFormData, gradeLevel: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                  >
                    <option value="1">1er Grado</option>
                    <option value="2">2do Grado</option>
                    <option value="3">3er Grado</option>
                    <option value="4">4to Grado</option>
                    <option value="5">5to Grado</option>
                    <option value="6">6to Grado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Horas/Semana *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="15"
                    value={editFormData.hoursPerWeek}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, hoursPerWeek: parseInt(e.target.value) });
                      if (editErrors.hoursPerWeek) setEditErrors(prev => ({ ...prev, hoursPerWeek: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${
                      editErrors.hoursPerWeek ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
                    }`}
                  />
                  {editErrors.hoursPerWeek && <p className="text-[10px] text-rose-600 font-bold mt-1">{editErrors.hoursPerWeek}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Descripción (Opcional)</label>
                <textarea
                  placeholder="Sumilla o temario del curso..."
                  rows="3"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553] resize-none"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#031553] text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-[#020d36] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
