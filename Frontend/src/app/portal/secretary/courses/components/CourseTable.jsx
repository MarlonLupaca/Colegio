'use client';

import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { academicAreas } from '../data';

const getAreaLabel = (areaValue) => {
  const area = academicAreas.find((a) => a.value === areaValue);
  return area ? area.label : areaValue;
};

function ActiveSwitch({ isActive, onToggle, title }) {
  return (
    <button
      onClick={onToggle}
      title={title}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  );
}

export default function CourseTable({ courses, onEdit, onDelete, onToggleActive, onView }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-secondary uppercase tracking-wider select-none">
            <th className="py-3.5 px-5">Código</th>
            <th className="py-3.5 px-4">Nombre del Curso</th>
            <th className="py-3.5 px-4">Área Académica</th>
            <th className="py-3.5 px-4">Nivel / Grado</th>
            <th className="py-3.5 px-4 text-center">Horas Sem.</th>
            <th className="py-3.5 px-4 text-center">Estado</th>
            <th className="py-3.5 px-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-xs">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
              {/* Code */}
              <td className="py-3 px-5">
                <span className="bg-slate-100 text-secondary border border-slate-200/50 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide">
                  {course.code}
                </span>
              </td>

              {/* Name + description (Clamp a 1 línea con puntos suspensivos) */}
              <td className="py-3 px-4 font-bold text-primary max-w-xs">
                <p className="truncate" title={course.name}>{course.name}</p>
                {course.description && (
                  <span className="text-[10px] text-secondary font-normal truncate max-w-[260px] mt-0.5 block" title={course.description}>
                    {course.description}
                  </span>
                )}
              </td>

              {/* Area */}
              <td className="py-3 px-4 text-secondary font-medium">
                {getAreaLabel(course.academicArea)}
              </td>

              {/* Level + Grade */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${course.educationLevel === 'primaria'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                    {course.educationLevel}
                  </span>
                  <span className="text-secondary font-semibold">{course.gradeLevel}° grado</span>
                </div>
              </td>

              {/* Hours */}
              <td className="py-3 px-4 text-center">
                <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-lg font-bold">
                  {course.hoursPerWeek} hrs
                </span>
              </td>

              {/* Toggle */}
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center">
                  <ActiveSwitch
                    isActive={course.isActive}
                    onToggle={() => onToggleActive(course)}
                    title={course.isActive ? 'Desactivar curso' : 'Activar curso'}
                  />
                </div>
              </td>

              {/* Actions */}
              <td className="py-3 px-5 text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(course)}
                    className="p-1.5 bg-indigo-50/40 hover:bg-[#031553] hover:text-white text-[#031553] rounded-lg transition-all cursor-pointer border border-[#031553]/5"
                    title="Ver Ficha Detallada"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(course)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-primary rounded-lg transition-all cursor-pointer"
                    title="Editar curso"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(course)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                    title="Eliminar curso"
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
  );
}
