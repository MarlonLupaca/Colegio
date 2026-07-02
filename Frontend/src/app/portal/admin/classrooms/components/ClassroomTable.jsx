// app/portal/admin/classrooms/components/ClassroomTable.jsx
'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { classroomStatuses, classroomTypes } from '../data';

export default function ClassroomTable({
  classrooms,
  onEdit,
  onDelete
}) {
  const getStatusBadge = (status) => {
    const colors = {
      DISPONIBLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      OCUPADO: 'bg-amber-100 text-amber-700 border-amber-200',
      MANTENIMIENTO: 'bg-red-100 text-red-700 border-red-200',
      INACTIVO: 'bg-gray-100 text-gray-500 border-gray-200'
    };
    const labels = {
      DISPONIBLE: 'Disponible',
      OCUPADO: 'Ocupado',
      MANTENIMIENTO: 'Mantenimiento',
      INACTIVO: 'Inactivo'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[status] || colors.DISPONIBLE}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const found = classroomTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-secondary uppercase tracking-wider">
            <th className="py-3.5 px-5">N° Aula</th>
            <th className="py-3.5 px-4">Edificio</th>
            <th className="py-3.5 px-4 text-center">Capacidad</th>
            <th className="py-3.5 px-4">Tipo</th>
            <th className="py-3.5 px-4 text-center">Estado</th>
            <th className="py-3.5 px-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-xs">
          {classrooms.map((classroom) => (
            <tr key={classroom.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="py-3 px-5 font-semibold text-primary">
                <span className="bg-slate-100 text-secondary border border-slate-200/50 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide">
                  {classroom.roomNumber}
                </span>
              </td>
              <td className="py-3 px-4 font-medium text-secondary">
                {classroom.building}
              </td>
              <td className="py-3 px-4 text-center font-bold text-primary">
                <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-lg">
                  {classroom.maxCapacity} personas
                </span>
              </td>
              <td className="py-3 px-4 text-secondary">
                {getTypeLabel(classroom.type)}
              </td>
              <td className="py-3 px-4 text-center">
                {getStatusBadge(classroom.status)}
              </td>
              <td className="py-3 px-5 text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(classroom)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-primary rounded-lg transition-all"
                    title="Editar aula"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(classroom)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                    title="Desactivar aula"
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