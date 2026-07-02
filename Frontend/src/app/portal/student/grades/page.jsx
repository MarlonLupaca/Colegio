'use client';

import React, { useState } from 'react';
import { Award, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Printer, Calendar, BookOpen, CheckCircle, FileText } from 'lucide-react';
import { mockGrades, trimestersInfo } from './data';

export default function GradesPage() {
  const [activeTrimester, setActiveTrimester] = useState(1); // 1, 2, or 3
  const [isTrimesterDropdownOpen, setIsTrimesterDropdownOpen] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const coursesGrades = mockGrades[activeTrimester] || [];
  const currentTrimesterInfo = trimestersInfo.find((t) => t.id === activeTrimester);

  // Calculate statistics
  const gpa = coursesGrades.length > 0 
    ? (coursesGrades.reduce((sum, c) => sum + c.average, 0) / coursesGrades.length).toFixed(1)
    : '0.0';
  const approvedCount = coursesGrades.filter((c) => c.average >= 11).length;
  const failedCount = coursesGrades.filter((c) => c.average < 11).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-3 text-left">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2 select-none">
            <Award className="w-4 h-4" /> Calificaciones Académicas
          </h3>
          <p className="text-[10px] text-gray-400 font-extrabold uppercase">
            Libreta de Notas Virtual • 5° Año - A
          </p>
        </div>
        
        {/* Right Controls: Trimester Dropdown & Print button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Custom Trimester Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTrimesterDropdownOpen(!isTrimesterDropdownOpen)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-primary flex items-center gap-2 hover:bg-gray-50 transition-all cursor-pointer select-none"
            >
              <span>{activeTrimester}° Trimestre ({currentTrimesterInfo?.period})</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            
            {isTrimesterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20 animate-fade-in text-left">
                {trimestersInfo.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTrimester(t.id);
                      setExpandedCourses({});
                      setIsTrimesterDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors flex flex-col ${
                      activeTrimester === t.id ? 'text-[#031553] bg-[#031553]/5' : 'text-gray-600'
                    }`}
                  >
                    <span>{t.id}° Trimestre</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{t.period}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer select-none bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3.5 py-2 rounded-xl"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Boleta de Notas</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* GPA Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#031553]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Promedio General</p>
            <h4 className="text-xl font-extrabold text-primary mt-1.5 leading-none">{gpa} <span className="text-[10px] text-gray-400 font-medium">/ 20</span></h4>
          </div>
        </div>

        {/* Approved Courses */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Cursos Aprobados</p>
            <h4 className="text-xl font-extrabold text-emerald-600 mt-1.5 leading-none">{approvedCount} <span className="text-[10px] text-gray-400 font-medium">Cursos</span></h4>
          </div>
        </div>

        {/* Failed / In Risk Courses */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${failedCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Cursos en Riesgo</p>
            <h4 className={`text-xl font-extrabold mt-1.5 leading-none ${failedCount > 0 ? 'text-rose-600' : 'text-primary'}`}>{failedCount} <span className="text-[10px] text-gray-400 font-medium">Cursos</span></h4>
          </div>
        </div>

      </div>

      {/* Detailed Courses Grades Report */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Section title */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-50 text-left">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Detalle por Asignatura ({currentTrimesterInfo?.title})
          </span>
        </div>

        {/* Courses Grades Accordion List */}
        <div className="divide-y divide-gray-100">
          {coursesGrades.map((course) => {
            const isExpanded = !!expandedCourses[course.courseId];
            const isApproved = course.average >= 11;
            
            return (
              <div key={course.courseId} className="py-4 first:pt-0 last:pb-0">
                {/* Accordion Row Header */}
                <div 
                  onClick={() => toggleCourse(course.courseId)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover:bg-[#031553]/5 transition-colors">
                      <BookOpen className="w-4 h-4 text-[#031553]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wide text-gray-400 leading-none">{course.code}</span>
                      <h4 className="font-bold text-xs text-primary leading-tight mt-0.5 group-hover:text-[#031553] transition-colors">{course.name}</h4>
                      <p className="text-[9px] text-gray-400 mt-0.5 leading-none">{course.teacher}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Status Badge */}
                    <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isApproved 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {isApproved ? 'Aprobado' : 'Riesgo'}
                    </span>

                    {/* Grade Average Indicator */}
                    <div className="text-right">
                      <p className="text-[8px] text-gray-400 font-bold leading-none uppercase">Promedio</p>
                      <h5 className={`font-extrabold text-sm mt-0.5 leading-none ${
                        isApproved ? 'text-[#031553]' : 'text-rose-600'
                      }`}>
                        {course.average}
                      </h5>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Accordion Grades Detail Content */}
                {isExpanded && (
                  <div className="mt-4 pl-11 pr-2 animate-fade-in text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.components.map((comp, cIdx) => (
                        <div key={cIdx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-2">
                          <h5 className="text-[10px] font-extrabold text-primary uppercase border-b border-gray-200 pb-1.5">
                            {comp.type}
                          </h5>
                          <div className="space-y-2">
                            {comp.grades.map((g, gIdx) => {
                              const markApproved = g.mark >= 11;
                              return (
                                <div key={gIdx} className="flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-semibold text-primary">{g.name}</p>
                                    <span className="text-[9px] text-gray-400 font-medium">{g.date}</span>
                                  </div>
                                  <span className={`font-extrabold ${markApproved ? 'text-primary' : 'text-rose-600'}`}>
                                    {String(g.mark).padStart(2, '0')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
