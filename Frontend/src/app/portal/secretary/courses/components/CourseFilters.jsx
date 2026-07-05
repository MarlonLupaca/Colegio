'use client';

import React from 'react';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

const GRADE_OPTIONS = {
  todos: [
    { value: '1', label: '1° grado' },
    { value: '2', label: '2° grado' },
    { value: '3', label: '3° grado' },
    { value: '4', label: '4° grado' },
    { value: '5', label: '5° grado' },
    { value: '6', label: '6° grado (Primaria)' },
  ],
  PRIMARIA: [
    { value: '1', label: '1° de Primaria' },
    { value: '2', label: '2° de Primaria' },
    { value: '3', label: '3° de Primaria' },
    { value: '4', label: '4° de Primaria' },
    { value: '5', label: '5° de Primaria' },
    { value: '6', label: '6° de Primaria' },
  ],
  SECUNDARIA: [
    { value: '1', label: '1° de Secundaria' },
    { value: '2', label: '2° de Secundaria' },
    { value: '3', label: '3° de Secundaria' },
    { value: '4', label: '4° de Secundaria' },
    { value: '5', label: '5° de Secundaria' },
  ],
};

const selectClass = 'w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer';

export default function CourseFilters({
  searchTerm, setSearchTerm,
  statusFilter, setStatusFilter,
  levelFilter, setLevelFilter,
  gradeFilter, setGradeFilter,
  resetFilters,
}) {
  const handleLevelChange = (e) => {
    const val = e.target.value;
    setLevelFilter(val);
    if (val === 'SECUNDARIA' && gradeFilter !== 'todos' && parseInt(gradeFilter) > 5) {
      setGradeFilter('todos');
    }
  };

  const gradeOptions = GRADE_OPTIONS[levelFilter] ?? GRADE_OPTIONS.todos;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
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

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Buscar por nombre / código</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej. MAT-001 o Geometría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-primary placeholder-gray-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Estado de actividad</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="todos">Todos los Estados</option>
            <option value="activos">Solo Activos</option>
            <option value="inactivos">Solo Inactivos</option>
          </select>
        </div>

        {/* Level */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Nivel Educativo</label>
          <select value={levelFilter} onChange={handleLevelChange} className={selectClass}>
            <option value="todos">Todos los Niveles</option>
            <option value="PRIMARIA">Primaria</option>
            <option value="SECUNDARIA">Secundaria</option>
          </select>
        </div>

        {/* Grade */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Grado Escolar</label>
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className={selectClass}>
            <option value="todos">Todos los Grados</option>
            {gradeOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
