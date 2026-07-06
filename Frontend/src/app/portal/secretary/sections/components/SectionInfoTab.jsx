'use client';

import React, { useState } from 'react';
import { Edit2, Save, X, Building, Calendar, GraduationCap, Users, BookOpen } from 'lucide-react';

export default function SectionInfoTab({ section, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    room: section?.room || '',
    academicYear: section?.academicYear || new Date().getFullYear(),
    grade: section?.grade || 1,
    sectionLetter: section?.section || 'A'
  });

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

  const handleEdit = () => {
    setFormData({
      room: section.room || '',
      academicYear: section.academicYear,
      grade: section.grade,
      sectionLetter: section.section
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(section.id, {
      ...section,
      room: formData.room,
      academicYear: formData.academicYear,
      grade: formData.grade,
      section: formData.sectionLetter
    });
    setIsEditing(false);
  };

  const getLevelLabel = (level) => {
    const normalized = level?.toUpperCase();
    return normalized === 'PRIMARIA' ? 'Primaria' : 'Secundaria';
  };

  const getGradeLabel = (grade, level) => {
    const normalized = level?.toUpperCase();
    const suffix = normalized === 'PRIMARIA' ? '° Grado' : '° Año';
    return `${grade}${suffix}`;
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
      <div className="p-2 bg-white rounded-lg text-primary/60">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-primary truncate">{value || 'No asignado'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">
            {section.grade}° {section.section} - {getLevelLabel(section.level)}
          </h3>
          <p className="text-xs text-secondary/60 mt-0.5">Año Académico {section.academicYear}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-secondary bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InfoRow
          label="Año Escolar"
          value={isEditing ? (
            <select
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) })}
              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-primary outline-none focus:border-primary/40"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          ) : section.academicYear}
          icon={Calendar}
        />

        <InfoRow
          label="Nivel Educativo"
          value={getLevelLabel(section.level)}
          icon={GraduationCap}
        />

        <InfoRow
          label="Grado"
          value={isEditing ? (
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-primary outline-none focus:border-primary/40"
            >
              {[1,2,3,4,5,6].map(g => (
                <option key={g} value={g}>{g}° {section.level?.toUpperCase() === 'PRIMARIA' ? 'Grado' : 'Año'}</option>
              ))}
            </select>
          ) : getGradeLabel(section.grade, section.level)}
          icon={Users}
        />

        <InfoRow
          label="Sección"
          value={isEditing ? (
            <select
              value={formData.sectionLetter}
              onChange={(e) => setFormData({ ...formData, sectionLetter: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-primary outline-none focus:border-primary/40"
            >
              {['A','B','C','D','E'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          ) : section.section}
          icon={Users}
        />

        {/* Aula: muestra texto compuesto de roomNumber + building */}
        <InfoRow
          label="Aula Asignada"
          value={section.room || 'No asignada'}
          icon={Building}
        />

        {/* Capacidad del aula */}
        <InfoRow
          label="Capacidad Máxima"
          value={section.maxStudents ? `${section.maxStudents} alumnos` : 'No especificada'}
          icon={Users}
        />

        {/* Tutor */}
        <InfoRow
          label="Profesor Tutor"
          value={section.tutor || 'Sin asignar'}
          icon={GraduationCap}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-center border border-blue-100/50">
          <p className="text-2xl font-bold text-primary">{section.courses?.length || 0}</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Cursos Asignados</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 text-center border border-emerald-100/50">
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Estudiantes</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 text-center border border-amber-100/50">
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Horas Semanales</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
        <h4 className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1">Descripción</h4>
        <p className="text-xs text-secondary/80">
          Sección {section.section} de {getGradeLabel(section.grade, section.level)} de {getLevelLabel(section.level)}.
          Año académico {section.year}. {section.courses?.length || 0} cursos asignados.
        </p>
      </div>
    </div>
  );
}