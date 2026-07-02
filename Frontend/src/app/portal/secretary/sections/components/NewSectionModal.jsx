'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  GraduationCap, 
  Users,
} from 'lucide-react';
import { levels, grades, sectionLetters } from '../data';

export default function NewSectionModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  existingSections
}) {
  const [formData, setFormData] = useState({
    level: 'primaria',
    grade: '1',
    section: 'A',
    maxStudents: '30'
  });

  const [errors, setErrors] = useState({});

  // Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) {
      setFormData({
        level: 'primaria',
        grade: '1',
        section: 'A',
        maxStudents: '30'
      });
      setErrors({});
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.level) newErrors.level = 'El nivel es obligatorio';
    if (!formData.grade) newErrors.grade = 'El grado es obligatorio';
    if (!formData.section) newErrors.section = 'La sección es obligatoria';
    if (!formData.maxStudents || parseInt(formData.maxStudents) <= 0) {
      newErrors.maxStudents = 'La capacidad debe ser mayor a 0';
    }

    // Validar duplicado en la UI (si ya existe grado y letra en el mismo nivel)
    const exists = Object.values(existingSections).some(levelData => {
      return Object.values(levelData).some(section => {
        return section.grade === parseInt(formData.grade) && 
               section.section === formData.section &&
               section.level.toLowerCase() === formData.level.toLowerCase();
      });
    });

    if (exists) {
      newErrors.duplicate = `Ya existe la sección ${formData.grade}° ${formData.section} de ${getLevelLabel(formData.level)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      level: formData.level,
      grade: parseInt(formData.grade),
      section: formData.section,
      maxStudents: parseInt(formData.maxStudents)
    });
    onClose();
  };

  const activeGrades = formData.level === 'primaria' ? grades.primaria : grades.secundaria;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up border border-gray-100/50">
        {/* Header */}
        <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Registrar Nueva Sección
          </h3>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left text-xs text-[#031553]">
          
          {/* Error duplicado */}
          {errors.duplicate && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 font-bold flex items-start gap-2">
              <span>⚠️ {errors.duplicate}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Nivel */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                Nivel *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-primary outline-none focus:border-primary/40 transition-all cursor-pointer"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
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
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-primary outline-none focus:border-primary/40 transition-all cursor-pointer"
              >
                {activeGrades.map(grade => (
                  <option key={grade.value} value={grade.value}>{grade.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sección */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Letra / Subsección *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-primary outline-none focus:border-primary/40 transition-all cursor-pointer"
              >
                {sectionLetters.map(letter => (
                  <option key={letter.value} value={letter.value}>{letter.label}</option>
                ))}
              </select>
            </div>

            {/* Capacidad */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary/60" />
                Aforo Máximo *
              </label>
              <input
                type="number"
                name="maxStudents"
                min="1"
                max="40"
                value={formData.maxStudents}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-primary outline-none focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Crear Sección
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}