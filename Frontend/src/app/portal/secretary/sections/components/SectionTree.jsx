'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  FolderTree,
  GraduationCap
} from 'lucide-react';

export default function SectionTree({
  sections,
  selectedSectionId,
  onSelectSection,
  onNewSection
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLevels, setExpandedLevels] = useState({
    'primaria': true,
    'secundaria': true
  });

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const getLevelLabel = (level) => {
    return level === 'primaria' ? 'Nivel Primaria' : 'Nivel Secundaria';
  };

  // Filtrar y agrupar secciones planas por nivel
  const getSectionsByLevel = (level) => {
    const list = [];
    
    // El mapa del parent agrupa por nivel: sections[level][sectionKey]
    if (sections[level]) {
      Object.keys(sections[level]).forEach((key) => {
        const item = sections[level][key];
        const searchLower = searchTerm.toLowerCase();
        
        const matchesSearch = !searchTerm || 
          key.toLowerCase().includes(searchLower) ||
          level.toLowerCase().includes(searchLower);

        if (matchesSearch) {
          list.push({
            key,
            ...item
          });
        }
      });
    }

    // Ordenar por grado de forma ascendente
    return list.sort((a, b) => a.grade - b.grade);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 text-xs text-[#031553]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            Estructura Curricular
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
            Activo
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar aula (ej: 3° A)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-primary placeholder-gray-400 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Actions */}
        <button
          onClick={onNewSection}
          className="w-full flex items-center justify-center gap-1.5 bg-[#031553] hover:bg-[#020d36] text-white text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva Sección
        </button>
      </div>

      {/* Levels list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {['primaria', 'secundaria'].map((level) => {
          const levelSections = getSectionsByLevel(level);
          const isExpanded = expandedLevels[level];
          const hasSections = levelSections.length > 0;

          return (
            <div key={level} className="space-y-1">
              {/* Level row */}
              <button
                onClick={() => toggleLevel(level)}
                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all text-left font-bold text-secondary/90 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-4 h-4 ${level === 'primaria' ? 'text-amber-500' : 'text-indigo-500'}`} />
                  <span>{getLevelLabel(level)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {levelSections.length}
                  </span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Sections under this level */}
              {isExpanded && (
                <div className="pl-4 space-y-1">
                  {levelSections.map((sec) => {
                    const isSelected = selectedSectionId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => onSelectSection(sec.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left font-semibold cursor-pointer ${
                          isSelected
                            ? 'bg-[#031553] text-white'
                            : 'hover:bg-slate-50 text-gray-600'
                        }`}
                      >
                        <span>{sec.key} grado</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                          isSelected 
                            ? 'bg-white/20 text-white font-bold' 
                            : 'bg-slate-100 text-gray-400 font-bold'
                        }`}>
                          {sec.maxStudents} cap.
                        </span>
                      </button>
                    );
                  })}
                  {!hasSections && (
                    <p className="text-[10px] text-gray-400 pl-4 py-1 italic">Ninguna sección creada</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}