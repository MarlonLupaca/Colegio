// app/portal/admin/sections/components/SectionCoursesTab.jsx
'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  BookOpen,
  X,
  Check,
  Search
} from 'lucide-react';

export default function SectionCoursesTab({ section, onUpdate }) {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({ name: '', teacher: '' });
  const [searchTerm, setSearchTerm] = useState('');

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

  const courses = section.courses || [];

  const handleAddCourse = () => {
    if (!formData.name.trim() || !formData.teacher.trim()) {
      alert('Completa todos los campos');
      return;
    }

    const newCourse = {
      id: `c-${Date.now()}`,
      name: formData.name.trim(),
      teacher: formData.teacher.trim()
    };

    const updatedSection = {
      ...section,
      courses: [...courses, newCourse]
    };

    onUpdate(section.id, updatedSection);
    setFormData({ name: '', teacher: '' });
    setIsAddingCourse(false);
  };

  const handleEditCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setFormData({ name: course.name, teacher: course.teacher });
      setEditingCourseId(courseId);
    }
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim() || !formData.teacher.trim()) {
      alert('Completa todos los campos');
      return;
    }

    const updatedCourses = courses.map(c => 
      c.id === editingCourseId 
        ? { ...c, name: formData.name.trim(), teacher: formData.teacher.trim() }
        : c
    );

    const updatedSection = {
      ...section,
      courses: updatedCourses
    };

    onUpdate(section.id, updatedSection);
    setFormData({ name: '', teacher: '' });
    setEditingCourseId(null);
  };

  const handleDeleteCourse = (courseId) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    const updatedCourses = courses.filter(c => c.id !== courseId);
    const updatedSection = {
      ...section,
      courses: updatedCourses
    };

    onUpdate(section.id, updatedSection);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', teacher: '' });
    setEditingCourseId(null);
    setIsAddingCourse(false);
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-primary">
            Cursos y Docentes Asignados
          </h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {courses.length} cursos asignados a esta sección
          </p>
        </div>

        {!isAddingCourse && !editingCourseId && (
          <button
            onClick={() => setIsAddingCourse(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Asignar Curso
          </button>
        )}
      </div>

      {/* Search */}
      {courses.length > 0 && !isAddingCourse && !editingCourseId && (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar curso o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 pl-9 pr-3 text-xs text-primary outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      )}

      {/* Add Course Form */}
      {isAddingCourse && (
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h5 className="text-xs font-bold text-secondary uppercase tracking-wider">
            Asignar Nuevo Curso
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre del curso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border border-gray-200 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Nombre del profesor"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="bg-white border border-gray-200 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-xs font-bold text-secondary bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddCourse}
              className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg transition-all"
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              Asignar Curso
            </button>
          </div>
        </div>
      )}

      {/* Edit Course Form */}
      {editingCourseId && (
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h5 className="text-xs font-bold text-secondary uppercase tracking-wider">
            Editar Curso
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre del curso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border border-gray-200 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Nombre del profesor"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="bg-white border border-gray-200 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-xs font-bold text-secondary bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all"
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      {filteredCourses.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">N°</th>
                  <th className="py-3 px-4">Curso</th>
                  <th className="py-3 px-4">Profesor</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredCourses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 px-4 text-secondary/60 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-primary/40" />
                        {course.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary/40" />
                        {course.teacher}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditCourse(course.id)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-primary rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">No hay cursos asignados</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Haz clic en "Asignar Curso" para comenzar
          </p>
        </div>
      )}

      {/* Empty state when no courses */}
      {courses.length === 0 && !isAddingCourse && !editingCourseId && (
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">Sin cursos asignados</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Esta sección aún no tiene cursos. Asigna el primero.
          </p>
        </div>
      )}

      {/* Footer Stats */}
      {courses.length > 0 && (
        <div className="flex items-center justify-between text-[10px] text-secondary/60 border-t border-gray-100 pt-3">
          <span>Total: {courses.length} cursos</span>
          <span>{courses.filter(c => c.teacher).length} profesores asignados</span>
        </div>
      )}
    </div>
  );
}