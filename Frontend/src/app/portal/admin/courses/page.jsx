'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';

import { initialCourses } from './data';
import CourseFilters from './components/CourseFilters';
import CourseTable from './components/CourseTable';
import CourseMobileList from './components/CourseMobileList';
import CourseModal from './components/CourseModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import ToastNotification from './components/ToastNotification';

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'admin_courses';

const loadCourses = () => {
  if (typeof window === 'undefined') return initialCourses;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialCourses;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const router = useRouter();

  // ── Data
  const [courses, setCourses] = useState(loadCourses);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // ── Toast (declared early so resetFilters can reference it)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [levelFilter, setLevelFilter] = useState('todos');
  const [gradeFilter, setGradeFilter] = useState('todos');

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('todos');
    setLevelFilter('todos');
    setGradeFilter('todos');
    showToast('Filtros reiniciados', 'info');
  }, [showToast]);

  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' ||
      (statusFilter === 'activos' && c.isActive) ||
      (statusFilter === 'inactivos' && !c.isActive);
    const matchLevel = levelFilter === 'todos' || c.educationLevel === levelFilter;
    const matchGrade = gradeFilter === 'todos' || c.gradeLevel === parseInt(gradeFilter);
    return matchSearch && matchStatus && matchLevel && matchGrade;
  });

  // ── Form modal
  const [formModal, setFormModal] = useState({ isOpen: false, type: 'create', course: null });

  const openCreate = () => setFormModal({ isOpen: true, type: 'create', course: null });
  const openEdit = (course) => setFormModal({ isOpen: true, type: 'edit', course });
  const closeForm = () => setFormModal((prev) => ({ ...prev, isOpen: false }));

  const handleFormSubmit = (formData) => {
    const now = new Date().toISOString();
    if (formModal.type === 'create') {
      const newCourse = {
        id: crypto.randomUUID(),
        ...formData,
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        gradeLevel: parseInt(formData.gradeLevel),
        hoursPerWeek: parseInt(formData.hoursPerWeek),
        createdAt: now,
        updatedAt: now,
      };
      setCourses((prev) => [newCourse, ...prev]);
      showToast(`Curso "${newCourse.name}" creado con éxito`);
    } else {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === formModal.course.id
            ? {
              ...c,
              ...formData,
              code: formData.code.toUpperCase().trim(),
              name: formData.name.trim(),
              description: formData.description.trim(),
              gradeLevel: parseInt(formData.gradeLevel),
              hoursPerWeek: parseInt(formData.hoursPerWeek),
              updatedAt: now,
            }
            : c
        )
      );
      showToast(`Curso "${formData.name.trim()}" actualizado correctamente`);
    }
    closeForm();
  };

  // ── Delete modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });

  const openDelete = (course) => setDeleteModal({ isOpen: true, course });
  const closeDelete = () => setDeleteModal({ isOpen: false, course: null });

  const handleConfirmDelete = () => {
    const { course } = deleteModal;
    setCourses((prev) => prev.filter((c) => c.id !== course.id));
    showToast(`Curso "${course.name}" eliminado correctamente`);
    closeDelete();
  };

  // ── Toggle active
  const handleToggleActive = (course) => {
    const next = !course.isActive;
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id ? { ...c, isActive: next, updatedAt: new Date().toISOString() } : c
      )
    );
    showToast(
      `Curso "${course.name}" ${next ? 'activado' : 'desactivado'} con éxito`,
      next ? 'success' : 'info'
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in relative">

      <ToastNotification toast={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="space-y-1.5 text-left">
          <button
            onClick={() => router.push('/portal/admin')}
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
              <p className="text-xs text-secondary mt-0.5">Administra las asignaturas dictadas, niveles, grados y estados.</p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer select-none shrink-0"
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
              courses={filteredCourses}
              onEdit={openEdit}
              onDelete={openDelete}
              onToggleActive={handleToggleActive}
            />
            <CourseMobileList
              courses={filteredCourses}
              onEdit={openEdit}
              onDelete={openDelete}
              onToggleActive={handleToggleActive}
            />
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary text-sm">No se encontraron cursos</h4>
            <p className="text-xs text-secondary max-w-xs">
              Intenta cambiar los filtros o agrega un nuevo curso para comenzar.
            </p>
            <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline">
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseModal
        key={`${formModal.type}-${formModal.course?.id ?? 'new'}`}
        isOpen={formModal.isOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        formType={formModal.type}
        currentCourse={formModal.course}
        courses={courses}
      />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        course={deleteModal.course}
      />
    </div>
  );
}
