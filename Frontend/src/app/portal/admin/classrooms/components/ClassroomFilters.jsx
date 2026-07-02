// app/portal/admin/classrooms/components/ClassroomFilters.jsx
'use client';

import React from 'react';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { classroomStatuses, classroomTypes, buildings } from '../data';

export default function ClassroomFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  buildingFilter,
  setBuildingFilter,
  resetFilters
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between text-left border-b border-gray-50 pb-2">
        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> Filtros de Búsqueda
        </span>
        <button
          onClick={resetFilters}
          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer select-none"
        >
          <RefreshCw className="w-3 h-3" /> Reiniciar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
            Buscar por número / edificio
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej. 101 o Pabellón A..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-primary placeholder-gray-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            {classroomStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer"
          >
            <option value="todos">Todos los Tipos</option>
            {classroomTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Building */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Edificio</label>
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer"
          >
            <option value="todos">Todos los Edificios</option>
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}