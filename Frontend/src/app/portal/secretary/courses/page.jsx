'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, ArrowLeft, X, ShieldCheck, GraduationCap, Clock, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

import CourseFilters from './components/CourseFilters';
import CourseTable from './components/CourseTable';
import CourseMobileList from './components/CourseMobileList';
import CourseModal from './components/CourseModal';
import CourseTeacherAssignModal from './components/CourseTeacherAssignModal';
import { academicAreas } from './data';

const COURSES_ENDPOINT = '/api/v1/courses';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  // Data & Loading States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Modal para visualización de detalles
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);

  // Modal para asignación de docente
  const [assignTeacherCourse, setAssignTeacherCourse] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiFetch(COURSES_ENDPOINT);
      setCourses(data || []);
    } catch (err) {
      setLoadError(err.message);
      showToast('Error al cargar los cursos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // ── Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [levelFilter, setLevelFilter] = useState('todos');
  const [gradeFilter, setGradeFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, levelFilter, gradeFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setLevelFilter('todos');
    setGradeFilter('todos');
    setCurrentPage(1);
    showToast('Filtros reiniciados', 'info');
  };

  // Ordenar cursos por fecha de creación descendente (los más nuevos primero)
  const sortedCourses = [...courses].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });

  const filteredCourses = sortedCourses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' ||
      (statusFilter === 'activos' && c.isActive) ||
      (statusFilter === 'inactivos' && !c.isActive);
    const matchLevel = levelFilter === 'todos' || c.educationLevel?.toUpperCase() === levelFilter.toUpperCase();
    const matchGrade = gradeFilter === 'todos' || c.gradeLevel === parseInt(gradeFilter);
    return matchSearch && matchStatus && matchLevel && matchGrade;
  });

  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  // Helper para obtener label del area
  const getAreaLabel = (areaValue) => {
    const area = academicAreas.find((a) => a.value === areaValue);
    return area ? area.label : areaValue;
  };

  // ── Form modal
  const [formModal, setFormModal] = useState({ isOpen: false, type: 'create', course: null });

  const openCreate = () => setFormModal({ isOpen: true, type: 'create', course: null });
  const openEdit = (course) => setFormModal({ isOpen: true, type: 'edit', course });
  const closeForm = () => setFormModal((prev) => ({ ...prev, isOpen: false }));

  // Guardar creación o edición en el backend
  const handleFormSubmit = async (formData) => {
    if (formModal.type === 'edit') {
      const isConfirmed = await askConfirmation({
        title: 'Modificar Estructura del Curso',
        message: `¿Está seguro de que desea guardar los cambios realizados en el curso '${formModal.course.name}'?`,
        confirmLabel: 'Guardar',
        cancelLabel: 'Cancelar'
      });

      if (!isConfirmed) return;
    }

    setLoading(true);
    try {
      const parsedBody = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        gradeLevel: parseInt(formData.gradeLevel),
        hoursPerWeek: parseInt(formData.hoursPerWeek),
        // educationLevel se envía en MAYÚSCULAS según el enum del backend (PRIMARIA / SECUNDARIA)
        educationLevel: formData.educationLevel.toUpperCase()
      };

      if (formModal.type === 'create') {
        const result = await apiFetch(COURSES_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(parsedBody)
        });
        showToast(`Curso "${result.name}" registrado correctamente.`);
      } else {
        await apiFetch(`/api/v1/courses/${formModal.course.id}`, {
          method: 'PUT',
          body: JSON.stringify(parsedBody)
        });
        showToast(`Curso "${parsedBody.name}" actualizado correctamente.`);
      }

      fetchCourses();
      closeForm();
    } catch (err) {
      showToast(err.message || 'Error al guardar los cambios en la BD.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Toggle active (PATCH)
  const handleToggleActive = async (course) => {
    const action = course.isActive ? 'deactivate' : 'activate';
    const actionLabel = course.isActive ? 'desactivar' : 'activar';

    const isConfirmed = await askConfirmation({
      title: `${actionLabel.toUpperCase()} CURSO`,
      message: `¿Está seguro de que desea cambiar el estado del curso '${course.name}'?`,
      confirmLabel: actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1),
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/courses/${course.id}/${action}`, {
        method: 'PATCH'
      });
      showToast(`Curso ${course.isActive ? 'desactivado' : 'activado'} exitosamente.`);
      fetchCourses();
      
      // Actualizar vista detallada si está abierta
      if (viewCourse && viewCourse.id === course.id) {
        setViewCourse(prev => ({ ...prev, isActive: !course.isActive }));
      }
    } catch (err) {
      showToast(err.message || 'Error al cambiar estado.', 'error');
    }
  };

  // ── Delete (DELETE)
  const handleDelete = async (course) => {
    const isConfirmed = await askConfirmation({
      title: 'ELIMINAR CURSO DEFINITIVAMENTE',
      message: `¿Está seguro de que desea eliminar permanentemente el curso '${course.name}' de la base de datos? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/courses/${course.id}`, {
        method: 'DELETE'
      });
      showToast(`Curso "${course.name}" eliminado correctamente.`);
      fetchCourses();
      if (viewCourse && viewCourse.id === course.id) {
        setIsViewOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Error al eliminar asignatura.', 'error');
    }
  };

  // Cargar asignaciones para la ficha detallada
  const [detailedAssignments, setDetailedAssignments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allSections, setAllSections] = useState([]);

  useEffect(() => {
    if (isViewOpen && viewCourse) {
      // 1. Cargar datos locales
      const localDataStr = localStorage.getItem('local_assigned_classes');
      const localClasses = localDataStr ? JSON.parse(localDataStr) : [];
      const matches = localClasses.filter(c => c.courseId === viewCourse.id);

      // 2. Cargar usuarios y secciones para nombres
      Promise.all([
        apiFetch('/api/user/usuarios').catch(() => []),
        apiFetch('/api/v1/annual-sections').catch(() => [])
      ]).then(([users, sectionsData]) => {
        setAllUsers(users);
        setAllSections(sectionsData);

        const mapped = matches.map(m => {
          const uInfo = users.find(u => u.id === m.teacherId);
          const sInfo = sectionsData.find(s => s.id === m.sectionId);
          const letter = sInfo ? (sInfo.sectionLetter || sInfo.sectionName || '') : '';
          return {
            id: m.id,
            sectionLabel: sInfo ? `${sInfo.gradeLevel}° "${letter.toUpperCase()}"` : `Sección ID: ${m.sectionId}`,
            teacherName: uInfo ? `${uInfo.nombres} ${uInfo.apellidos}` : `Profesor ID: ${m.teacherId}`
          };
        });
        setDetailedAssignments(mapped);
      });
    }
  }, [isViewOpen, viewCourse]);

  const handleOpenView = (course) => {
    setViewCourse(course);
    setIsViewOpen(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in relative text-xs text-[#031553]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="space-y-1.5 text-left">
          <button
            onClick={() => router.push('/portal/secretary')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a Inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/5 rounded-xl text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary tracking-tight">Gestión de Cursos</h2>
              <p className="text-xs text-secondary mt-0.5">Administra las asignaturas dictadas, niveles, grados y estados en la BD.</p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer select-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Curso</span>
        </button>
      </div>

      {/* Filters */}
      <CourseFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        levelFilter={levelFilter} setLevelFilter={setLevelFilter}
        gradeFilter={gradeFilter} setGradeFilter={setGradeFilter}
        resetFilters={resetFilters}
      />

      {/* Course list */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
       
        {filteredCourses.length > 0 ? (
          <>
            <CourseTable
              courses={paginatedCourses}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onView={handleOpenView}
              onAssignTeacher={setAssignTeacherCourse}
            />
            <CourseMobileList
              courses={paginatedCourses}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
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
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary text-sm">No se encontraron cursos</h4>
            <p className="text-xs text-secondary max-w-xs">
              El microservicio de cursos retornó una lista vacía. Crea un curso o revisa la base de datos PostgreSQL.
            </p>
            <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline">
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      <CourseModal
        key={`${formModal.type}-${formModal.course?.id ?? 'new'}`}
        isOpen={formModal.isOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        formType={formModal.type}
        currentCourse={formModal.course}
        courses={courses}
      />

      {/* Teacher assignment modal */}
      <CourseTeacherAssignModal
        isOpen={assignTeacherCourse !== null}
        onClose={() => setAssignTeacherCourse(null)}
        course={assignTeacherCourse}
        onSuccess={fetchCourses}
      />

      {/* Modal: Ver Ficha Detallada del Curso */}
      {isViewOpen && viewCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in text-left">
            {/* Header */}
            <div className="bg-[#031553] text-white p-6 relative">
              <button
                onClick={() => setIsViewOpen(false)}
                className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#031553] font-extrabold text-xl flex items-center justify-center shadow-lg">
                  {viewCourse.name ? viewCourse.name.substring(0, 2).toUpperCase() : 'CU'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewCourse.name}</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">Código Curso: {viewCourse.code}</p>
                </div>
              </div>
            </div>

            {/* Ficha de Detalles */}
            <div className="p-6 space-y-6 text-xs text-[#031553]">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5 border-b pb-1.5 border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-[#031553]" /> Información Curricular
                </h4>
                
                <div className="grid grid-cols-1 gap-2 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block font-medium">Área Académica:</span>
                    <span className="font-bold text-[#031553] capitalize">{getAreaLabel(viewCourse.academicArea)?.replace('_', ' ')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-200/40 pt-2 mt-1">
                    <div>
                      <span className="text-gray-400 block font-medium">Nivel Educativo:</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border mt-1 ${
                        viewCourse.educationLevel === 'primaria'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {viewCourse.educationLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Grado Académico:</span>
                      <span className="font-bold text-[#031553] flex items-center gap-1 mt-1">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {viewCourse.gradeLevel}° Grado
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-200/40 pt-2 mt-1">
                    <div>
                      <span className="text-gray-400 block font-medium">Horas Semanales:</span>
                      <span className="font-bold text-[#031553] flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {viewCourse.hoursPerWeek} horas
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Estado del Curso:</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${
                        viewCourse.isActive 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {viewCourse.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docentes y Salones Asignados */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5 border-b pb-1.5 border-gray-100">
                  Aulas y Docentes Responsables (Local)
                </h4>
                {detailedAssignments.length > 0 ? (
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {detailedAssignments.map(da => (
                      <div key={da.id} className="flex justify-between items-center bg-indigo-50/20 border border-indigo-100/50 p-2.5 rounded-xl">
                        <span className="font-bold text-[#031553]">{da.sectionLabel}</span>
                        <span className="text-gray-500 font-semibold">{da.teacherName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                    Este curso no ha sido asignado a ningún salón de clase actualmente.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5 border-b pb-1.5 border-gray-100">
                  Descripción y Temario
                </h4>
                <p className="text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                  {viewCourse.description || 'Este curso no cuenta con una sumilla o descripción registrada.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  setFormModal({ isOpen: true, type: 'edit', course: viewCourse });
                  setIsViewOpen(false);
                }}
                className="bg-indigo-50 hover:bg-[#031553]/10 text-[#031553] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#031553]/5"
              >
                Editar
              </button>
              <button
                onClick={() => setIsViewOpen(false)}
                className="bg-[#031553] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#020d36] transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
