// app/portal/secretary/sections/components/SectionScheduleTab.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  BookOpen,
  AlertTriangle,
  Info
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

const DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' }
];

const BLOCK_TYPES = [
  { value: 'CLASS', label: 'Clase', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'CLASE', label: 'Clase', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'RECREO', label: 'Recreo', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'ALMUERZO', label: 'Almuerzo', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

const BLOCK_FORM_TYPES = [
  { value: 'CLASE', label: 'Clase' },
  { value: 'RECREO', label: 'Recreo' },
  { value: 'ALMUERZO', label: 'Almuerzo' }
];

const getTypeStyle = (type) => {
  const found = BLOCK_TYPES.find(t => t.value === type);
  return found ? found.color : 'bg-gray-50 text-gray-600 border-gray-200';
};

const getTypeLabel = (type) => {
  const found = BLOCK_TYPES.find(t => t.value === type);
  return found ? found.label : type;
};

export default function SectionScheduleTab({ section }) {
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  const [timeBlocks, setTimeBlocks] = useState([]);
  const [sectionClasses, setSectionClasses] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulario de nuevo bloque horario
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockForm, setBlockForm] = useState({ startTime: '', endTime: '', type: 'CLASE' });
  const [submittingBlock, setSubmittingBlock] = useState(false);

  // Celda seleccionada para asignar curso
  const [selectedCell, setSelectedCell] = useState(null); // { timeBlockId, dayOfWeek }
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const fetchData = useCallback(async () => {
    if (!section?.id) return;
    setLoading(true);
    try {
      // 1. Cargar todos los bloques horarios
      const blocks = await apiFetch('/api/v1/time-blocks').catch(() => []);
      const sortedBlocks = (blocks || []).sort((a, b) =>
        (a.startTime || '').localeCompare(b.startTime || '')
      );
      setTimeBlocks(sortedBlocks);

      // 2. Cargar cursos asignados a esta sección
      const allCls = await apiFetch(`/api/v1/annual-sections/${section.id}/courses-with-teachers`).catch(() => []);

      const sectionCls = (allCls || [])
        .filter(cls => {
          // Aceptar cualquier clase que tenga docente asignado en su curso
          const hasTeacher = cls.teacherCode !== null && cls.teacherCode !== undefined && cls.teacherCode !== '';
          return hasTeacher;
        })
        .map(cls => {
          return {
            id: cls.id,
            courseId: cls.courseId,
            teacherCode: cls.teacherCode,
            name: cls.courseName || `Curso ID: ${cls.courseId}`,
            code: cls.courseCode || '',
            teacher: cls.teacherName || 'Docente',
            hoursPerWeek: cls.hoursPerWeek || 4 // fallback if null
          };
        });

      setSectionClasses(sectionCls);

      // 3. Cargar horarios de la sección
      const allSchedules = await apiFetch('/api/v1/class-schedules').catch(() => []);
      const sectionClassIds = new Set(sectionCls.map(c => c.id));
      const filteredSchedules = (allSchedules || []).filter(s =>
        sectionClassIds.has(s.assignedClassId)
      );
      setClassSchedules(filteredSchedules);
    } catch (err) {
      console.error('Error cargando horario:', err.message);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    if (section) {
      fetchData();
    }
  }, [section, fetchData]);

  // Crear un nuevo bloque horario
  const handleCreateBlock = async () => {
    if (!blockForm.startTime || !blockForm.endTime || !blockForm.type) {
      showToast('Completa todos los campos del bloque horario.', 'error');
      return;
    }
    if (blockForm.startTime >= blockForm.endTime) {
      showToast('La hora de inicio debe ser menor a la hora de fin.', 'error');
      return;
    }
    setSubmittingBlock(true);
    try {
      await apiFetch('/api/v1/time-blocks', {
        method: 'POST',
        body: JSON.stringify({
          startTime: blockForm.startTime + ':00',
          endTime: blockForm.endTime + ':00',
          type: blockForm.type
        })
      });
      showToast('Bloque horario creado correctamente.', 'success');
      setBlockForm({ startTime: '', endTime: '', type: 'CLASE' });
      setShowBlockForm(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Error al crear el bloque horario.', 'error');
    } finally {
      setSubmittingBlock(false);
    }
  };

  // Asignar un curso a una celda del horario
  const handleAssignCourse = async () => {
    if (!selectedCell || !selectedCourseId) {
      showToast('Selecciona un curso para asignar.', 'error');
      return;
    }
    setSubmittingSchedule(true);
    try {
      await apiFetch('/api/v1/class-schedules', {
        method: 'POST',
        body: JSON.stringify({
          timeBlock: { id: selectedCell.timeBlockId },
          dayOfWeek: selectedCell.dayOfWeek,
          assignedClassId: selectedCourseId
        })
      });
      showToast('Curso asignado al horario correctamente.', 'success');
      setSelectedCell(null);
      setSelectedCourseId('');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Error al asignar el curso al horario.', 'error');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  // Eliminar una entrada del horario
  const handleDeleteSchedule = async (scheduleId, courseName) => {
    const confirmed = await askConfirmation({
      title: 'Retirar del Horario',
      message: `¿Deseas quitar "${courseName}" de este bloque horario?`,
      confirmLabel: 'Retirar',
      cancelLabel: 'Cancelar'
    });
    if (!confirmed) return;
    try {
      await apiFetch(`/api/v1/class-schedules/${scheduleId}`, { method: 'DELETE' });
      showToast('Entrada del horario retirada correctamente.', 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Error al retirar del horario.', 'error');
    }
  };

  // Obtener la asignación de una celda (bloque + día)
  const getCellSchedule = (timeBlockId, dayOfWeek) => {
    const schedule = classSchedules.find(
      s => s.timeBlock?.id === timeBlockId && s.dayOfWeek === dayOfWeek
    );
    if (!schedule) return null;
    const cls = sectionClasses.find(c => c.id === schedule.assignedClassId);
    return cls ? { scheduleId: schedule.id, ...cls } : null;
  };

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
          <Clock className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-bold text-secondary">Selecciona una sección</h3>
        <p className="text-xs text-secondary/60 mt-1">Haz clic en una sección para administrar su horario</p>
      </div>
    );
  }

  // Calculate statistics
  const maxWeeklyHours = section.maxWeeklyHours || 30;
  const totalAssignedHours = sectionClasses.reduce((sum, c) => sum + (c.hoursPerWeek || 0), 0);
  const totalScheduledHours = classSchedules.length;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-gray-100">
        <div>
          <h4 className="text-sm font-bold text-[#031553]">Control y Programación de Horario</h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            Año Escolar: {section.academicYear} · Capacidad Horaria Máxima: {maxWeeklyHours} horas/semana
          </p>
        </div>
        <button
          onClick={() => {
            setShowBlockForm(v => !v);
            setBlockForm({ startTime: '', endTime: '', type: 'CLASE' });
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#031553] hover:bg-[#020d36] text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          {showBlockForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showBlockForm ? 'Cancelar' : 'Nuevo Bloque Horario'}
        </button>
      </div>

      {/* Formulario de nuevo bloque horario */}
      {showBlockForm && (
        <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
          <h5 className="text-xs font-bold text-secondary uppercase tracking-wider">
            Crear Nuevo Bloque Horario
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hora inicio */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Hora Inicio *
              </label>
              <input
                type="time"
                value={blockForm.startTime}
                onChange={e => setBlockForm({ ...blockForm, startTime: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 rounded-xl px-3 py-2 text-xs text-[#031553] outline-none transition-all"
              />
            </div>

            {/* Hora fin */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Hora Fin *
              </label>
              <input
                type="time"
                value={blockForm.endTime}
                onChange={e => setBlockForm({ ...blockForm, endTime: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 rounded-xl px-3 py-2 text-xs text-[#031553] outline-none transition-all"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Tipo *
              </label>
              <select
                value={blockForm.type}
                onChange={e => setBlockForm({ ...blockForm, type: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 rounded-xl px-3 py-2 text-xs text-[#031553] outline-none transition-all cursor-pointer"
              >
                {BLOCK_FORM_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setShowBlockForm(false);
                setBlockForm({ startTime: '', endTime: '', type: 'CLASE' });
              }}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateBlock}
              disabled={submittingBlock}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {submittingBlock ? 'Guardando...' : 'Crear Bloque'}
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacidad de Sección</p>
            <h5 className="text-xl font-bold text-[#031553] mt-1">{maxWeeklyHours} horas / sem</h5>
          </div>
          <Calendar className="w-7 h-7 text-indigo-400/60" />
        </div>

        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Horas Matriculadas</p>
            <h5 className={`text-xl font-bold mt-1 ${totalAssignedHours > maxWeeklyHours ? 'text-rose-600' : 'text-emerald-600'}`}>
              {totalAssignedHours} / {maxWeeklyHours} horas
            </h5>
          </div>
          <BookOpen className="w-7 h-7 text-emerald-400/60" />
        </div>

        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Programación Horaria</p>
            <h5 className="text-xl font-bold text-indigo-600 mt-1">{totalScheduledHours} horas fijadas</h5>
          </div>
          <Clock className="w-7 h-7 text-indigo-500/60" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs">Cargando horario...</span>
        </div>
      ) : timeBlocks.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-gray-100">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">Sin bloques horarios</h4>
          <p className="text-xs text-secondary/60 mt-1">Crea primero los bloques horarios usando el botón de arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grilla de horario (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {sectionClasses.length === 0 && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  No hay cursos asignados con docente en esta sección.
                  Asigna materias antes de armar el horario.
                </span>
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-xs bg-white">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-left text-[10px] font-bold text-secondary/60 uppercase tracking-wider min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Bloque
                      </div>
                    </th>
                    {DAYS.map(day => (
                      <th
                        key={day.value}
                        className="py-3 px-3 text-center text-[10px] font-bold text-secondary/60 uppercase tracking-wider min-w-[120px]"
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {timeBlocks.map(block => {
                    const isBreak = block.type !== 'CLASS' && block.type !== 'CLASE';
                    return (
                      <tr
                        key={block.id}
                        className={isBreak ? 'bg-amber-50/20' : 'hover:bg-slate-50/10 transition-colors'}
                      >
                        {/* Info del bloque */}
                        <td className="py-3 px-4 border-r border-gray-50">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${getTypeStyle(block.type)}`}>
                              {getTypeLabel(block.type)}
                            </span>
                            <p className="text-[11px] font-bold text-primary tabular-nums">
                              {block.startTime?.slice(0, 5)} – {block.endTime?.slice(0, 5)}
                            </p>
                          </div>
                        </td>

                        {/* Celdas por día */}
                        {DAYS.map(day => {
                          if (isBreak) {
                            return (
                              <td key={day.value} className="py-2.5 px-3">
                                <div className="flex items-center justify-center h-12 text-[10px] text-amber-400 font-bold select-none">
                                  —
                                </div>
                              </td>
                            );
                          }

                          const cell = getCellSchedule(block.id, day.value);
                          const isSelected =
                            selectedCell?.timeBlockId === block.id &&
                            selectedCell?.dayOfWeek === day.value;

                          return (
                            <td key={day.value} className="py-1.5 px-2">
                              {cell ? (
                                /* Celda ocupada */
                                <div className="group relative bg-indigo-50 border border-indigo-200 rounded-xl p-2 min-h-[58px] flex flex-col justify-between transition-all hover:shadow-xs">
                                  <div className="pr-4">
                                    <p className="text-[10px] font-bold text-indigo-900 leading-tight truncate" title={cell.name}>
                                      {cell.name}
                                    </p>
                                    <p className="text-[8px] text-indigo-500 mt-0.5 truncate" title={cell.teacher}>
                                      {cell.teacher}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSchedule(cell.scheduleId, cell.name)}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-rose-100 text-indigo-300 hover:text-rose-600 rounded-md transition-all cursor-pointer"
                                    title="Retirar del horario"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : isSelected ? (
                                /* Selector de curso activo */
                                <div className="bg-white border-2 border-[#031553]/40 rounded-xl p-1.5 shadow-md min-h-[58px] space-y-1 animate-fade-in">
                                  <select
                                    value={selectedCourseId}
                                    onChange={e => setSelectedCourseId(e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-1.5 py-1 text-[10px] text-[#031553] outline-none cursor-pointer"
                                    autoFocus
                                  >
                                    <option value="">Curso...</option>
                                    {sectionClasses.map(cls => {
                                      const count = classSchedules.filter(s => s.assignedClassId === cls.id).length;
                                      const remaining = cls.hoursPerWeek - count;
                                      return (
                                        <option 
                                          key={cls.id} 
                                          value={cls.id}
                                          disabled={remaining <= 0}
                                        >
                                          {cls.name} ({remaining > 0 ? `Falta ${remaining}h` : 'Completo'})
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setSelectedCell(null);
                                        setSelectedCourseId('');
                                      }}
                                      className="flex-1 py-0.5 text-[8px] font-bold text-gray-500 hover:bg-gray-100 rounded-md transition-all cursor-pointer"
                                    >
                                      No
                                    </button>
                                    <button
                                      onClick={handleAssignCourse}
                                      disabled={!selectedCourseId || submittingSchedule}
                                      className="flex-1 py-0.5 text-[8px] font-bold text-white bg-[#031553] hover:bg-[#020d36] rounded-md transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      Si
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Celda vacía */
                                <button
                                  onClick={() => {
                                    if (sectionClasses.length === 0) return;
                                    setSelectedCell({ timeBlockId: block.id, dayOfWeek: day.value });
                                    setSelectedCourseId('');
                                  }}
                                  disabled={sectionClasses.length === 0}
                                  className="w-full min-h-[58px] border border-dashed border-gray-200 rounded-xl hover:border-[#031553]/40 hover:bg-[#031553]/5 transition-all cursor-pointer flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-30 group"
                                >
                                  <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-3 text-[9px] text-secondary/60 pt-1">
              <span className="font-bold uppercase tracking-wider">Leyenda:</span>
              {BLOCK_TYPES.map(t => (
                <span key={t.value} className={`px-2 py-0.5 rounded-md border font-bold ${t.color}`}>
                  {t.label}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1">
                <Info className="w-3 h-3 text-[#031553]" />
                Haz clic en una celda vacía para asignar
              </span>
            </div>
          </div>

          {/* Sidebar de control de cursos (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs space-y-3">
              <h5 className="text-xs font-bold text-[#031553] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Cursos por Programar
              </h5>
              
              <div className="divide-y divide-gray-50 max-h-[350px] overflow-y-auto pr-1 space-y-2">
                {sectionClasses.map(cls => {
                  const scheduledCount = classSchedules.filter(s => s.assignedClassId === cls.id).length;
                  const percent = Math.min(100, Math.round((scheduledCount / cls.hoursPerWeek) * 100));
                  const isCompleted = scheduledCount >= cls.hoursPerWeek;
                  const missingHours = cls.hoursPerWeek - scheduledCount;

                  return (
                    <div key={cls.id} className="pt-2 first:pt-0 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-[#031553] truncate" title={cls.name}>{cls.name}</p>
                          <p className="text-[9px] text-gray-400 truncate" title={cls.teacher}>{cls.teacher}</p>
                        </div>
                        <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {scheduledCount}/{cls.hoursPerWeek}h
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Warning or status label */}
                      <div className="flex items-center justify-between text-[9px]">
                        {isCompleted ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Horario Completo
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Faltan {missingHours} horas
                          </span>
                        )}
                        <span className="text-gray-400">{percent}% programado</span>
                      </div>
                    </div>
                  );
                })}

                {sectionClasses.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6 italic">No hay materias docentes asignadas</p>
                )}
              </div>
            </div>

            {/* Listado de cursos sin programar completamente */}
            {sectionClasses.some(c => classSchedules.filter(s => s.assignedClassId === c.id).length < c.hoursPerWeek) && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-2">
                <h6 className="text-[10px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Alerta de Programación
                </h6>
                <p className="text-[10px] text-amber-700">
                  La sección tiene asignaturas cuyas horas semanales aún no se han programado por completo en la grilla. Completa los bloques vacíos para cumplir con la malla curricular.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}