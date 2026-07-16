// app/portal/admin/sections/components/NewSectionModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Building, 
  GraduationCap, 
  Users,
  Calendar,
  Plus,
  Copy
} from 'lucide-react';
import { levels, grades, sectionLetters } from '../data';

export default function NewSectionModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  existingSections,
  availableYears 
}) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    level: 'primaria',
    grade: '1',
    section: 'A',
    classroom: ''
  });

  const [errors, setErrors] = useState({});
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [copyOptions, setCopyOptions] = useState({
    copyTeachers: true,
    copyCourses: true
  });

  // Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          year: new Date().getFullYear().toString(),
          level: 'primaria',
          grade: '1',
          section: 'A',
          classroom: ''
        });
        setErrors({});
        setIsCopyMode(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const getLevelLabel = (level) => {
    return level === 'primaria' ? 'Primaria' : 'Secundaria';
  };

  const getGradeLabel = (grade, level) => {
    const suffix = level === 'primaria' ? '° Grado' : '° Año';
    return `${grade}${suffix}`;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.year) {
      newErrors.year = 'El año es obligatorio';
    }

    if (!formData.level) {
      newErrors.level = 'El nivel es obligatorio';
    }

    if (!formData.grade) {
      newErrors.grade = 'El grado es obligatorio';
    }

    if (!formData.section) {
      newErrors.section = 'La sección es obligatoria';
    }

    // Validar duplicado
    const exists = Object.values(existingSections).some(yearData => {
      if (!yearData[formData.level]) return false;
      return Object.values(yearData[formData.level]).some(section => {
        return section.grade === parseInt(formData.grade) && 
               section.section === formData.section &&
               section.year === parseInt(formData.year);
      });
    });

    if (exists) {
      newErrors.duplicate = `Ya existe la sección ${formData.grade}° ${formData.section} de ${getLevelLabel(formData.level)} para el año ${formData.year}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Preparar datos para crear
    const newSection = {
      id: `sec-${formData.grade}${formData.section.toLowerCase()}-${formData.year}`,
      year: parseInt(formData.year),
      level: formData.level,
      grade: parseInt(formData.grade),
      section: formData.section,
      classroom: formData.classroom || 'No asignada',
      courses: []
    };

    // Si es modo copia, incluir cursos y profesores
    if (isCopyMode) {
      // Buscar sección del año anterior para copiar
      const previousYear = (parseInt(formData.year) - 1).toString();
      if (existingSections[previousYear]?.[formData.level]) {
        const previousSection = Object.values(existingSections[previousYear][formData.level]).find(
          s => s.grade === parseInt(formData.grade) && s.section === formData.section
        );
        
        if (previousSection) {
          if (copyOptions.copyCourses) {
            newSection.courses = previousSection.courses || [];
          }
          if (copyOptions.copyTeachers) {
            // Si hay profesores asociados a cursos, se copian también
            newSection.courses = (newSection.courses || []).map(course => ({
              ...course,
              teacher: course.teacher || 'Sin asignar'
            }));
          }
        }
      }
    }

    onSubmit(newSection);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getAvailableGrades = () => {
    const maxGrade = formData.level === 'primaria' ? 6 : 5;
    return grades.filter(g => g.value <= maxGrade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Users className="w-4 h-4 text-white/80" />
            </div>
            <h3 className="font-bold text-sm tracking-tight">
              Nueva Sección
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          
          {/* Error duplicado */}
          {errors.duplicate && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs font-medium flex items-start gap-2">
              <span className="text-rose-500 text-lg leading-none">⚠️</span>
              <span>{errors.duplicate}</span>
            </div>
          )}

          {/* Año Escolar */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/60" />
              Año Escolar *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3 text-sm text-primary outline-none transition-all cursor-pointer ${
                errors.year ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
              }`}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.year && <p className="text-[10px] text-rose-600 font-bold">{errors.year}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nivel */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary/60" />
                Nivel *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3 text-sm text-primary outline-none transition-all cursor-pointer ${
                  errors.level ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
              {errors.level && <p className="text-[10px] text-rose-600 font-bold">{errors.level}</p>}
            </div>

            {/* Grado */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Grado *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3 text-sm text-primary outline-none transition-all cursor-pointer ${
                  errors.grade ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                {getAvailableGrades().map(grade => (
                  <option key={grade.value} value={grade.value}>
                    {getGradeLabel(grade.value, formData.level)}
                  </option>
                ))}
              </select>
              {errors.grade && <p className="text-[10px] text-rose-600 font-bold">{errors.grade}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sección */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary/60" />
                Sección *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3 text-sm text-primary outline-none transition-all cursor-pointer ${
                  errors.section ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                {sectionLetters.map(letter => (
                  <option key={letter.value} value={letter.value}>{letter.label}</option>
                ))}
              </select>
              {errors.section && <p className="text-[10px] text-rose-600 font-bold">{errors.section}</p>}
            </div>

            {/* Aula */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-primary/60" />
                Aula Asignada
              </label>
              <input
                type="text"
                name="classroom"
                value={formData.classroom}
                onChange={handleChange}
                placeholder="Ej: 101 - Pabellón A"
                className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2.5 px-3 text-sm text-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Opción: Copiar del año anterior */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <button
              type="button"
              onClick={() => setIsCopyMode(!isCopyMode)}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors w-full text-left"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar estructura del año anterior</span>
              <span className="ml-auto text-secondary/60 text-[10px]">
                {isCopyMode ? '(Activo)' : '(Opcional)'}
              </span>
            </button>

            {isCopyMode && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <p className="text-[10px] text-secondary/60">
                  Selecciona qué elementos copiar del año anterior ({parseInt(formData.year) - 1}):
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyCourses}
                      onChange={(e) => setCopyOptions(prev => ({ 
                        ...prev, 
                        copyCourses: e.target.checked 
                      }))}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Cursos
                  </label>
                  <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyTeachers}
                      onChange={(e) => setCopyOptions(prev => ({ 
                        ...prev, 
                        copyTeachers: e.target.checked 
                      }))}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Profesores
                  </label>
                </div>
                {!copyOptions.copyCourses && !copyOptions.copyTeachers && (
                  <p className="text-[10px] text-amber-600">
                    ⚠️ No has seleccionado nada para copiar
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Vista previa</p>
            <p className="text-sm font-bold text-primary mt-1">
              {formData.grade}° {formData.section} - {getLevelLabel(formData.level)}
            </p>
            <p className="text-[11px] text-secondary/60">
              Año {formData.year} • Aula: {formData.classroom || 'No asignada'}
            </p>
            {isCopyMode && (
              <p className="text-[10px] text-primary/60 mt-1">
                🔄 Copiando {copyOptions.copyCourses ? 'cursos' : ''} {copyOptions.copyCourses && copyOptions.copyTeachers ? 'y' : ''} {copyOptions.copyTeachers ? 'profesores' : ''} del año anterior
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-secondary hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear Sección
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}