'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Download, CheckCircle, Clock, BookOpenCheck, ChevronDown, ChevronUp, ArrowLeft, Users, GraduationCap, Plus, Upload, Trash2, X, HelpCircle } from 'lucide-react';
import { mockTeacherCourses, trimestersInfo } from './data';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState(mockTeacherCourses);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTrimester, setActiveTrimester] = useState(1); // 1, 2, or 3
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [isTrimesterDropdownOpen, setIsTrimesterDropdownOpen] = useState(false);
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'material' or 'task'
  const [modalWeek, setModalWeek] = useState(1);
  const [modalDay, setModalDay] = useState(1);
  
  // Form states
  const [topicName, setTopicName] = useState('');
  const [itemName, setItemName] = useState('');
  const [dueDateText, setDueDateText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const toggleWeek = (weekNum) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const handleDeleteItem = (type, week, day) => {
    setCourses((prevCourses) => 
      prevCourses.map((c) => {
        if (c.id === selectedCourseId) {
          const trimesterList = c.trimesters[activeTrimester] || [];
          const updatedTrimester = trimesterList.map((w) => {
            if (w.week === week) {
              const updatedDays = w.days.map((d) => {
                if (d.dayNum === day) {
                  return {
                    ...d,
                    material: type === 'material' ? null : d.material,
                    task: type === 'task' ? null : d.task
                  };
                }
                return d;
              });
              return { ...w, days: updatedDays };
            }
            return w;
          });
          
          setToastMessage(type === 'material' ? '¡Material eliminado correctamente!' : '¡Tarea eliminada correctamente!');
          return {
            ...c,
            trimesters: {
              ...c.trimesters,
              [activeTrimester]: updatedTrimester
            }
          };
        }
        return c;
      })
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleOpenModal = (type, week, day, currentTopic = '') => {
    setActiveModal(type);
    setModalWeek(week);
    setModalDay(day);
    setTopicName(currentTopic || '');
    setItemName('');
    setDueDateText('');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !topicName.trim()) return;

    setCourses((prevCourses) => 
      prevCourses.map((c) => {
        if (c.id === selectedCourseId) {
          const trimesterList = c.trimesters[activeTrimester] || [];
          
          const updatedTrimester = trimesterList.map((w) => {
            if (w.week === modalWeek) {
              const updatedDays = w.days.map((d) => {
                if (d.dayNum === modalDay) {
                  return {
                    ...d,
                    topic: topicName,
                    material: activeModal === 'material' 
                      ? { title: itemName, size: `${(Math.random() * 3 + 1).toFixed(1)} MB` }
                      : d.material,
                    task: activeModal === 'task'
                      ? { title: itemName, dueDate: dueDateText || 'Sin fecha límite' }
                      : d.task
                  };
                }
                return d;
              });
              return { ...w, days: updatedDays };
            }
            return w;
          });

          if (activeModal === 'material') {
            setToastMessage('¡Material de clase publicado exitosamente!');
          } else {
            setToastMessage('¡Tarea escolar asignada exitosamente!');
          }

          return {
            ...c,
            trimesters: {
              ...c.trimesters,
              [activeTrimester]: updatedTrimester
            }
          };
        }
        return c;
      })
    );

    setActiveModal(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Dashboard of all courses
  if (selectedCourseId === null) {
    return (
      <div className="w-full animate-fade-in pb-12 space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2 select-none">
            <BookOpenCheck className="w-4 h-4" /> Gestión de Mis Cursos
          </h3>
        </div>

        {/* Course cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setActiveTrimester(1);
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
                <p className="text-[10px] text-gray-400 font-bold">{course.section}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-2 text-left pt-1 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold leading-none">Alumnos</p>
                    <p className="text-[11px] text-primary font-bold mt-1 leading-none">{course.studentsCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold leading-none">Promedio</p>
                    <p className="text-[11px] text-[#031553] font-bold mt-1 leading-none">{course.averageGrade}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    );
  }

  const trimesterWeeks = selectedCourse.trimesters[activeTrimester] || [];
  const currentTrimesterInfo = trimestersInfo.find((t) => t.id === activeTrimester);

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#031553] text-white border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-fade-in max-w-sm text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-xs">Publicación Completa</h5>
            <p className="text-[10px] text-white/80 mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Back button & dropdown filter */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedCourseId(null)}
          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer select-none bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Cursos</span>
        </button>

        {/* Custom Trimester Selector Dropdown */}
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
                    setExpandedWeeks({});
                    setIsTrimesterDropdownOpen(false);
                  }}
                  className={`px-3 py-2 text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors flex flex-col ${
                    activeTrimester === t.id ? 'text-[#031553] bg-[#031553]/5' : 'text-gray-600'
                  }`}
                >
                  <span>{t.id}° Trimestre</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Course Editor Panel */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Header Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-50 text-left">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedCourse.code} • {selectedCourse.section}</span>
            <h2 className="text-xl font-bold text-primary tracking-tight mt-0.5">{selectedCourse.name}</h2>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100/50 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#031553]" />
            <span className="text-xs font-bold text-primary">{selectedCourse.studentsCount} Alumnos Matriculados</span>
          </div>
        </div>

        {/* Section title */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-50 text-left">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Semanas y Silabo del Curso
          </span>
        </div>

        {/* Weeks accordions */}
        <div className="space-y-4">
          {trimesterWeeks.length > 0 ? (
            trimesterWeeks.map((wk) => {
              const isExpanded = !!expandedWeeks[wk.week];
              return (
                <div 
                  key={wk.week}
                  className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white"
                >
                  {/* Week title block */}
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

                  {/* Accordion detail days list */}
                  {isExpanded && (
                    <div className="p-4 md:p-6 divide-y divide-gray-50 space-y-5">
                      {wk.days.map((day) => (
                        <div 
                          key={day.dayNum} 
                          className="pt-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-left"
                        >
                          {/* Day column */}
                          <div className="md:col-span-2">
                            <span className="bg-[#031553]/10 text-[#031553] text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg">
                              Día {day.dayNum}
                            </span>
                            <h5 className="font-bold text-xs text-primary mt-2">{day.topic || 'Tema por definir'}</h5>
                          </div>

                          <div className="md:col-span-5 space-y-2">
                            <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Material de Clase</span>
                            {day.material ? (
                              <div className="border border-gray-50 bg-gray-50/20 rounded-xl p-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <BookOpen className="w-4 h-4 text-[#031553] shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-primary truncate max-w-[150px]">{day.material.title}</p>
                                    <span className="text-[9px] text-gray-400 font-semibold">{day.material.size}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDeleteItem('material', wk.week, day.dayNum)}
                                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="border border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5">
                                <span className="text-[9px] font-semibold text-gray-300">Ningún material publicado</span>
                                <button 
                                  onClick={() => handleOpenModal('material', wk.week, day.dayNum, day.topic)}
                                  className="text-[9px] font-extrabold text-[#031553] uppercase bg-[#031553]/5 hover:bg-[#031553]/10 px-2 py-1 rounded-lg transition-colors cursor-pointer select-none"
                                >
                                  Publicar Documento
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="md:col-span-5 space-y-2">
                            <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Tarea Asignada</span>
                            {day.task ? (
                              <div className="border border-gray-50 rounded-xl p-3 flex items-start justify-between gap-2.5 bg-gray-50/20">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-xs text-primary leading-tight truncate">{day.task.title}</h5>
                                    <p className="text-[9px] text-gray-400 font-medium mt-1">Límite: {day.task.dueDate}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDeleteItem('task', wk.week, day.dayNum)}
                                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="border border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5">
                                <span className="text-[9px] font-semibold text-gray-300">Ninguna tarea programada</span>
                                <button 
                                  onClick={() => handleOpenModal('task', wk.week, day.dayNum, day.topic)}
                                  className="text-[9px] font-extrabold text-amber-700 uppercase bg-amber-50 hover:bg-amber-100/50 px-2 py-1 rounded-lg transition-colors cursor-pointer select-none"
                                >
                                  Asignar Tarea
                                </button>
                              </div>
                            )}
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
              No hay sílabo cargado en este trimestre.
            </div>
          )}
        </div>

      </div>

      {/* Upload/Assignment modal form */}
      {activeModal && (
        <div className="fixed inset-0 bg-[#031553]/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-left"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                {activeModal === 'material' ? <Upload className="w-4 h-4 text-[#031553]" /> : <FileText className="w-4 h-4 text-amber-500" />}
                <span>{activeModal === 'material' ? 'Publicar Material de Clase' : 'Crear Nueva Tarea'}</span>
              </h4>
              <button 
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target info */}
            <div className="bg-gray-50 rounded-xl p-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Semana {modalWeek}</span>
              <span>•</span>
              <span>Día {modalDay}</span>
            </div>

            {/* Topic input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Tema de la Clase (Sesión)
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Derivadas logarítmicas y trigonométricas"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary outline-none focus:border-[#031553] transition-colors"
              />
            </div>

            {/* Item Title input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                {activeModal === 'material' ? 'Título del Documento' : 'Título de la Tarea'}
              </label>
              <input
                type="text"
                required
                placeholder={activeModal === 'material' ? 'Ej. Diapositiva: Derivada de una Cadena.pdf' : 'Ej. Tarea 3: Ejercicios de Derivación'}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary outline-none focus:border-[#031553] transition-colors"
              />
            </div>

            {/* Task Due Date input */}
            {activeModal === 'task' && (
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Fecha y Hora de Entrega Límite
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 15 de Nov, 12:00"
                  value={dueDateText}
                  onChange={(e) => setDueDateText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary outline-none focus:border-[#031553] transition-colors"
                />
              </div>
            )}

            {/* Modal actions */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-primary border border-gray-100 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer select-none text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#031553] hover:bg-[#031553]/90 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer select-none text-center"
              >
                Publicar Ahora
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
