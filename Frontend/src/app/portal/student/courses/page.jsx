'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Download, CheckCircle, Clock, BookOpenCheck, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import { mockCourses } from './data';


export default function CoursesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTrimester, setActiveTrimester] = useState(1); // 1, 2, or 3
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [isTrimesterDropdownOpen, setIsTrimesterDropdownOpen] = useState(false);

  const selectedCourse = mockCourses.find(c => c.id === selectedCourseId);

  const toggleWeek = (weekNum) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const trimestersInfo = [
    {
      id: 1,
      title: 'Primer Trimestre',
      period: 'Marzo - Mayo',
      desc: 'Comienza con el inicio de clases (usualmente a principios de marzo) y se extiende hasta mediados o finales de mayo.'
    },
    {
      id: 2,
      title: 'Segundo Trimestre',
      period: 'Junio - Setiembre',
      desc: 'Inicia tras unas breves vacaciones en mayo, abarcando los meses de junio, julio y agosto, para terminar normalmente a principios de setiembre. En este sistema, las tradicionales vacaciones de Fiestas Patrias (julio/agosto) caen dentro de este trimestre.'
    },
    {
      id: 3,
      title: 'Tercer Trimestre',
      period: 'Setiembre - Diciembre',
      desc: 'Comienza a mediados de setiembre y abarca hasta mediados de diciembre, cerrando con la clausura del año escolar.'
    }
  ];

  // Grid view of all courses
  if (selectedCourseId === null) {
    return (
      <div className="w-full animate-fade-in pb-12 space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2 select-none">
            <BookOpenCheck className="w-4 h-4" /> Mis Asignaturas
          </h3>
        </div>

        {/* Responsive Grid of Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setActiveTrimester(1); // Default to 1st trimester when opening a course
                setExpandedWeeks({});
              }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#031553]/15 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  {course.code}
                </span>
                <h4 className="font-bold text-sm text-primary leading-snug group-hover:text-[#031553]/85 transition-colors">
                  {course.name}
                </h4>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-2 text-left">
                <div className={`w-7 h-7 rounded-full ${course.teacher.avatarBg} flex items-center justify-center font-bold text-white text-[10px] shrink-0 select-none`}>
                  {course.teacher.avatar}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold leading-none">Profesor</p>
                  <p className="text-[11px] text-primary font-bold mt-1 leading-none">{course.teacher.name}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 text-left pt-2">
                <div className="flex justify-between text-[9px] font-semibold text-gray-400">
                  <span>Avance Académico</span>
                  <span className="text-[#031553] font-bold">{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#031553]"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    );
  }

  // Retrieve current trimester weeks (fallback to empty if not found)
  const trimesterWeeks = selectedCourse.trimesters[activeTrimester] || [];
  const currentTrimesterInfo = trimestersInfo.find(t => t.id === activeTrimester);

  // Detailed Course View
  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      
      {/* Back button & Location breadcrumb */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedCourseId(null)}
          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer select-none bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Cursos</span>
        </button>
        <span className="text-[10px] font-extrabold text-[#031553] uppercase bg-[#031553]/5 px-3 py-1.5 rounded-xl">
          {currentTrimesterInfo?.title}
        </span>
      </div>

      {/* Detailed Course Content Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Header: Course Title and Teacher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-50">
          <div className="text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedCourse.code}</span>
            <h2 className="text-xl font-bold text-primary tracking-tight mt-0.5">{selectedCourse.name}</h2>
          </div>
          {/* Teacher Info */}
          <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100/50">
            <div className={`w-9 h-9 rounded-full ${selectedCourse.teacher.avatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0 select-none`}>
              {selectedCourse.teacher.avatar}
            </div>
            <div className="text-left">
              <h5 className="font-bold text-xs text-primary leading-none">{selectedCourse.teacher.name}</h5>
              <p className="text-[9px] text-[#64748b] mt-1">{selectedCourse.teacher.email}</p>
            </div>
          </div>
        </div>

        {/* Compact Trimester Selector header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-gray-50 text-left">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Semanas y Material de Estudio
          </span>
          <div className="flex items-center gap-2 relative">
            <span className="text-xs font-bold text-gray-500">Filtrar por:</span>
            <div className="relative">
              <button
                onClick={() => setIsTrimesterDropdownOpen(!isTrimesterDropdownOpen)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-primary flex items-center gap-2 hover:bg-gray-100 transition-all cursor-pointer select-none"
              >
                <span>{activeTrimester}° Trimestre ({trimestersInfo.find(t => t.id === activeTrimester)?.period})</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              
              {isTrimesterDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20 animate-fade-in text-left">
                  {trimestersInfo.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveTrimester(t.id);
                        setExpandedWeeks({});
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
          </div>
        </div>

        {/* Weeks Syllabus Content (Timeline / Accordions) */}
        <div className="space-y-4">
          {trimesterWeeks.length > 0 ? (
            trimesterWeeks.map((wk) => {
              const isExpanded = !!expandedWeeks[wk.week];
              return (
                <div 
                  key={wk.week}
                  className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white"
                >
                  {/* Accordion Week Toggle Bar */}
                  <button
                    onClick={() => toggleWeek(wk.week)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/50 transition-colors text-left cursor-pointer"
                  >
                    <span className="font-bold text-xs text-primary">
                      Semana {wk.week}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    )}
                  </button>

                  {/* Accordion Content (Study Days) */}
                  {isExpanded && (
                    <div className="p-4 md:p-6 divide-y divide-gray-50 space-y-5">
                      {wk.days.map((day) => (
                        <div 
                          key={day.dayNum} 
                          className="pt-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-left"
                        >
                          {/* Day Column */}
                          <div className="md:col-span-2">
                            <span className="bg-[#031553]/10 text-[#031553] text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg">
                              Día {day.dayNum}
                            </span>
                            <h5 className="font-bold text-xs text-primary mt-2">{day.topic}</h5>
                          </div>

                          {/* Material (Class Document) */}
                          <div className="md:col-span-5 border border-gray-50 bg-gray-50/10 hover:bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <BookOpen className="w-4 h-4 text-[#031553] shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-primary truncate max-w-[200px]">{day.material.title}</p>
                                <span className="text-[9px] text-gray-400 font-semibold">{day.material.size}</span>
                              </div>
                            </div>
                            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-primary transition-all cursor-pointer">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Task (Activity Delivery) */}
                          <div className="md:col-span-5 border border-gray-50 rounded-xl p-3 flex gap-3 items-start">
                            <div className="mt-0.5 shrink-0">
                              {day.task.status === 'entregado' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-primary leading-tight truncate">{day.task.title}</h5>
                              <div className="flex items-center justify-between pt-0.5">
                                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  day.task.status === 'entregado'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {day.task.status}
                                </span>
                                <span className="text-[9px] text-gray-400 font-medium">{day.task.dueDate}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm">
              No hay material cargado para este trimestre.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
