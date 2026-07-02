// app/portal/admin/sections/components/SectionTree.jsx
'use client';

import React, { useState } from 'react';
import {
    Search,
    Plus,
    Copy,
    ChevronDown,
    ChevronRight,
    FolderTree,
    GraduationCap,
    Users
} from 'lucide-react';

export default function SectionTree({
    sections,
    selectedSectionId,
    onSelectSection,
    onNewSection,
    onCopyStructure
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedYears, setExpandedYears] = useState({ '2026': true });
    const [expandedLevels, setExpandedLevels] = useState({
        '2026-primaria': true,
        '2026-secundaria': true
    });

    const toggleYear = (year) => {
        setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
    };

    const toggleLevel = (key) => {
        setExpandedLevels(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getLevelLabel = (level) => {
        return level === 'primaria' ? 'Primaria' : 'Secundaria';
    };

    const getSectionCount = (year, level) => {
        if (!sections[year] || !sections[year][level]) return 0;
        return Object.keys(sections[year][level]).length;
    };

    const filterSections = (year, level, sectionKey) => {
        if (!searchTerm) return true;
        const section = sections[year]?.[level]?.[sectionKey];
        if (!section) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            sectionKey.toLowerCase().includes(searchLower) ||
            getLevelLabel(level).toLowerCase().includes(searchLower) ||
            year.includes(searchLower)
        );
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-primary" />
                        Estructura Académica
                    </h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                        {Object.keys(sections).length} años
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar sección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-primary placeholder-gray-400 outline-none transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onNewSection} // ✅ Esto abre el modal
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold py-2 rounded-xl transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Nueva Sección
                    </button>
                    <button
                        onClick={onCopyStructure}
                        className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-secondary text-[10px] font-bold px-3 py-2 rounded-xl transition-all"
                        title="Copiar estructura del año anterior"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto p-2">
                {Object.keys(sections).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <FolderTree className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-xs text-secondary font-medium">No hay secciones</p>
                        <p className="text-[10px] text-secondary/60 mt-1">Crea una nueva sección para comenzar</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {Object.keys(sections).map((year) => {
                            const isYearExpanded = expandedYears[year] !== false;
                            const yearSections = sections[year];
                            const totalSections = Object.values(yearSections).reduce(
                                (acc, level) => acc + Object.keys(level).length, 0
                            );

                            return (
                                <div key={year} className="select-none">
                                    {/* Year Node */}
                                    <button
                                        onClick={() => toggleYear(year)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        {isYearExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                        )}
                                        <span className="text-sm font-bold text-primary">{year}</span>
                                        <span className="text-[10px] text-gray-400 font-medium ml-auto">
                                            {totalSections} secciones
                                        </span>
                                    </button>

                                    {/* Levels */}
                                    {isYearExpanded && (
                                        <div className="ml-2 space-y-0.5 border-l-2 border-gray-100 pl-2">
                                            {Object.keys(yearSections).map((level) => {
                                                const levelKey = `${year}-${level}`;
                                                const isLevelExpanded = expandedLevels[levelKey] !== false;
                                                const sectionsInLevel = yearSections[level];
                                                const filteredKeys = Object.keys(sectionsInLevel).filter(
                                                    key => filterSections(year, level, key)
                                                );

                                                if (Object.keys(sectionsInLevel).length === 0) return null;

                                                return (
                                                    <div key={levelKey}>
                                                        {/* Level Node */}
                                                        <button
                                                            onClick={() => toggleLevel(levelKey)}
                                                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                                        >
                                                            {isLevelExpanded ? (
                                                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                            ) : (
                                                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                            )}
                                                            <GraduationCap className={`w-3.5 h-3.5 ${level === 'primaria' ? 'text-amber-500' : 'text-indigo-500'
                                                                } shrink-0`} />
                                                            <span className="text-xs font-semibold text-secondary">
                                                                {getLevelLabel(level)}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-medium ml-auto">
                                                                {filteredKeys.length}
                                                            </span>
                                                        </button>

                                                        {/* Sections */}
                                                        {isLevelExpanded && (
                                                            <div className="ml-6 space-y-0.5 border-l-2 border-gray-50 pl-2">
                                                                {filteredKeys.map((sectionKey) => {
                                                                    const section = sectionsInLevel[sectionKey];
                                                                    const isSelected = selectedSectionId === section.id;

                                                                    return (
                                                                        <button
                                                                            key={sectionKey}
                                                                            onClick={() => onSelectSection(section.id)}
                                                                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-left ${isSelected
                                                                                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                                                                    : 'hover:bg-slate-50 text-secondary hover:text-primary'
                                                                                }`}
                                                                        >
                                                                            <Users className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-primary' : 'text-gray-400'
                                                                                }`} />
                                                                            <span className="text-xs font-medium">
                                                                                {sectionKey}
                                                                            </span>
                                                                            <span className="text-[9px] text-gray-400 ml-auto">
                                                                                {section.courses?.length || 0} cursos
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between text-[10px] text-secondary/60">
                    <span>Total: {Object.values(sections).reduce((acc, year) => {
                        return acc + Object.values(year).reduce((acc2, level) => {
                            return acc2 + Object.keys(level).length;
                        }, 0);
                    }, 0)} secciones</span>
                    <span>Última actualización: hoy</span>
                </div>
            </div>
        </div>
    );
}