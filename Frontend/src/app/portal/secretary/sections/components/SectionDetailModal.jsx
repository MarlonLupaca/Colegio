'use client';

import React, { useState } from 'react';
import { X, Calendar, BookOpen, Users, GraduationCap } from 'lucide-react';
import SectionScheduleTab from './SectionScheduleTab';
import SectionCoursesTab from './SectionCoursesTab';
import SectionStudentsTab from './SectionStudentsTab';

export default function SectionDetailModal({ isOpen, onClose, section }) {
  const [activeTab, setActiveTab] = useState('schedule');

  if (!isOpen || !section) return null;

  const getLevelLabel = (level) => {
    return level?.toUpperCase() === 'PRIMARIA' ? 'Primaria' : 'Secundaria';
  };

  const tabs = [
    { id: 'schedule', label: 'Horario Escolar', icon: Calendar },
    { id: 'courses', label: 'Materias y Cursos', icon: BookOpen },
    { id: 'students', label: 'Estudiantes de Clase', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-slide-up border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#031553] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-300" />
              Detalle de Sección: {section.grade}° {section.section} - {getLevelLabel(section.level)}
            </h3>
            <p className="text-[10px] text-white/70 font-mono mt-0.5">
              Código de Sección: {section.tutorCode ? `Tutor #${section.tutorCode}` : ''} | ID: {section.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="border-b border-gray-100 bg-slate-50/50 px-6 py-2 flex gap-2 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#031553] text-white border-[#031553] shadow-xs'
                    : 'bg-white text-gray-500 border-gray-200/60 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {activeTab === 'schedule' && <SectionScheduleTab section={section} />}
          {activeTab === 'courses' && <SectionCoursesTab section={section} />}
          {activeTab === 'students' && <SectionStudentsTab section={section} />}
        </div>
      </div>
    </div>
  );
}
