'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { academicAreas } from '../data';

const getAreaLabel = (areaValue) => {
  const area = academicAreas.find((a) => a.value === areaValue);
  return area ? area.label : areaValue;
};

export default function CourseMobileList({ courses, onEdit, onDelete, onToggleActive }) {
  return (
    <div className="block md:hidden divide-y divide-gray-100">
      {courses.map((course) => (
        <div key={course.id} className="p-4 space-y-3 text-left">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-secondary border border-slate-200/50 px-2 py-0.5 rounded-md text-[9px] font-bold">
                  {course.code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${course.educationLevel === 'primaria'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-indigo-50 text-indigo-700'
                  }`}>
                  {course.educationLevel}
                </span>
              </div>
              <h4 className="font-bold text-sm text-primary">{course.name}</h4>
            </div>

            {/* Active toggle */}
            <button
              onClick={() => onToggleActive(course)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${course.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${course.isActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          {/* Description */}
          <p className="text-[11px] text-secondary leading-relaxed line-clamp-2">
            {course.description || 'Sin descripción disponible.'}
          </p>

          {/* Info grid */}
          <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-gray-100/50">
            <div>
              <span className="text-secondary font-medium block">Área</span>
              <span className="text-primary font-bold">{getAreaLabel(course.academicArea)}</span>
            </div>
            <div className="text-center">
              <span className="text-secondary font-medium block">Grado</span>
              <span className="text-primary font-bold">{course.gradeLevel}° grado</span>
            </div>
            <div className="text-right">
              <span className="text-secondary font-medium block">Horas/sem</span>
              <span className="text-primary font-bold">{course.hoursPerWeek} hrs</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
            <button
              onClick={() => onEdit(course)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-primary px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            <button
              onClick={() => onDelete(course)}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
