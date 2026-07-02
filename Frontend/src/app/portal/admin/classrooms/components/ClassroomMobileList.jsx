// app/portal/admin/classrooms/components/ClassroomMobileList.jsx
'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { classroomTypes } from '../data';

export default function ClassroomMobileList({
  classrooms,
  onEdit,
  onDelete
}) {
  const getStatusBadge = (status) => {
    const colors = {
      DISPONIBLE: 'bg-emerald-100 text-emerald-700',
      OCUPADO: 'bg-amber-100 text-amber-700',
      MANTENIMIENTO: 'bg-red-100 text-red-700',
      INACTIVO: 'bg-gray-100 text-gray-500'
    };
    const labels = {
      DISPONIBLE: 'Disponible',
      OCUPADO: 'Ocupado',
      MANTENIMIENTO: 'Mantenimiento',
      INACTIVO: 'Inactivo'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status] || colors.DISPONIBLE}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const found = classroomTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="block md:hidden divide-y divide-gray-100">
      {classrooms.map((classroom) => (
        <div key={classroom.id} className="p-4 space-y-3 text-left">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-secondary border border-slate-200/50 px-2 py-0.5 rounded-md text-[9px] font-bold">
                  {classroom.roomNumber}
                </span>
                {getStatusBadge(classroom.status)}
              </div>
              <h4 className="font-bold text-sm text-primary">{classroom.building}</h4>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-gray-100/50">
            <div>
              <span className="text-secondary font-medium block">Tipo</span>
              <span className="text-primary font-bold">{getTypeLabel(classroom.type)}</span>
            </div>
            <div className="text-center">
              <span className="text-secondary font-medium block">Capacidad</span>
              <span className="text-primary font-bold">{classroom.maxCapacity} pers.</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
            <button
              onClick={() => onEdit(classroom)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-primary px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            <button
              onClick={() => onDelete(classroom)}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 className="w-3 h-3" /> Desactivar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}