'use client';

import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { academicAreas } from '../data';

const PRIMARIA_GRADES = [
  { value: '1', label: '1° grado de Primaria' },
  { value: '2', label: '2° grado de Primaria' },
  { value: '3', label: '3° grado de Primaria' },
  { value: '4', label: '4° grado de Primaria' },
  { value: '5', label: '5° grado de Primaria' },
  { value: '6', label: '6° grado de Primaria' },
];

const SECUNDARIA_GRADES = [
  { value: '1', label: '1° año de Secundaria' },
  { value: '2', label: '2° año de Secundaria' },
  { value: '3', label: '3° año de Secundaria' },
  { value: '4', label: '4° año de Secundaria' },
  { value: '5', label: '5° año de Secundaria' },
];

const EMPTY_FORM = {
  name: '',
  code: '',
  academicArea: '',
  description: '',
  educationLevel: 'primaria',
  gradeLevel: '1',
  hoursPerWeek: '4',
  isActive: true,
};

const inputBase = 'w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all';

export default function CourseModal({ isOpen, onClose, onSubmit, formType, currentCourse, courses }) {
  const initialData = formType === 'edit' && currentCourse
    ? {
      name: currentCourse.name,
      code: currentCourse.code,
      academicArea: currentCourse.academicArea,
      description: currentCourse.description || '',
      educationLevel: currentCourse.educationLevel,
      gradeLevel: currentCourse.gradeLevel.toString(),
      hoursPerWeek: currentCourse.hoursPerWeek.toString(),
      isActive: currentCourse.isActive,
    }
    : EMPTY_FORM;

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => {
      const updated = { ...prev, [name]: nextValue };
      // Auto-clamp grade when level changes
      if (name === 'educationLevel' && nextValue === 'secundaria' && parseInt(prev.gradeLevel) > 5) {
        updated.gradeLevel = '5';
      }
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'El nombre es obligatorio';
    if (!formData.code.trim()) {
      e.code = 'El código es obligatorio';
    } else if (
      courses.some(
        (c) =>
          c.code.toUpperCase() === formData.code.trim().toUpperCase() &&
          c.id !== currentCourse?.id
      )
    ) {
      e.code = 'Este código ya existe en otro curso';
    }
    if (!formData.academicArea) e.academicArea = 'El área académica es obligatoria';
    if (!formData.hoursPerWeek || parseInt(formData.hoursPerWeek) <= 0)
      e.hoursPerWeek = 'Las horas semanales deben ser mayor a 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const gradeOptions = formData.educationLevel === 'primaria' ? PRIMARIA_GRADES : SECUNDARIA_GRADES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white/80" />
            <h3 className="font-bold text-sm tracking-tight">
              {formType === 'create' ? 'Crear Nuevo Curso' : 'Editar Curso Existente'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Nombre del Curso *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Geometría Analítica"
                className={`${inputBase} ${errors.name ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'}`}
              />
              {errors.name && <p className="text-[10px] text-rose-600 font-bold">{errors.name}</p>}
            </div>

            {/* Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Código *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ej. MAT-002"
                className={`${inputBase} uppercase ${errors.code ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'}`}
              />
              {errors.code && <p className="text-[10px] text-rose-600 font-bold">{errors.code}</p>}
            </div>

            {/* Hours */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Horas Semanales *</label>
              <input
                type="number"
                name="hoursPerWeek"
                min="1"
                max="20"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                className={`${inputBase} ${errors.hoursPerWeek ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'}`}
              />
              {errors.hoursPerWeek && <p className="text-[10px] text-rose-600 font-bold">{errors.hoursPerWeek}</p>}
            </div>

            {/* Academic Area */}
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Área Académica *</label>
              <select
                name="academicArea"
                value={formData.academicArea}
                onChange={handleChange}
                className={`${inputBase} cursor-pointer ${errors.academicArea ? 'border-rose-400' : 'border-gray-200 focus:border-primary/40'}`}
              >
                <option value="">Selecciona el área...</option>
                {academicAreas.map((area) => (
                  <option key={area.value} value={area.value}>{area.label}</option>
                ))}
              </select>
              {errors.academicArea && <p className="text-[10px] text-rose-600 font-bold">{errors.academicArea}</p>}
            </div>

            {/* Education Level */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Nivel Educativo *</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className={`${inputBase} cursor-pointer border-gray-200 focus:border-primary/40`}
              >
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </div>

            {/* Grade Level */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Grado Escolar *</label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className={`${inputBase} cursor-pointer border-gray-200 focus:border-primary/40`}
              >
                {gradeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe los temas o el alcance..."
                rows="3"
                className={`${inputBase} resize-none border-gray-200 focus:border-primary/40`}
              />
            </div>

            {/* Is Active toggle */}
            <div className="col-span-2 flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl border border-gray-100">
              <div className="text-left">
                <span className="text-xs font-bold text-primary block">¿Habilitar al guardar?</span>
                <span className="text-[10px] text-secondary">Disponible inmediatamente para matrículas y horarios.</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-secondary hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer select-none"
            >
              {formType === 'create' ? 'Crear Curso' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
