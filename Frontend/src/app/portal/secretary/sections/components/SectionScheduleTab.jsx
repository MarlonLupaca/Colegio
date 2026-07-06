// app/portal/secretary/sections/components/SectionScheduleTab.jsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2
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

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
          <Clock className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-bold text-secondary">Selecciona una sección</h3>
        <p className="text-xs text-secondary/60 mt-1">Haz clic en una sección del panel izquierdo</p>
      </div>
    );
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Cargar todos los bloques horarios
      const blocks = await apiFetch('/api/v1/time-blocks').catch(() => []);
      const sortedBlocks = (blocks || []).sort((a, b) =>
        (a.startTime || '').localeCompare(b.startTime || '')
      );
      setTimeBlocks(sortedBlocks);

      // 2. Cargar cursos asignados a esta sección con profesor asignado
      const allCls = await apiFetch('/api/v1/assigned-classes').catch(() => []);
      const teachers = await apiFetch('/api/user/usuarios/rol/DOCENTE').catch(() => []);
      const courses = await apiFetch('/api/v1/courses').catch(() => []);

      // Debug: ver estructura de los datos del API
      console.log('[ScheduleTab] section.id:', section.id);
      console.log('[ScheduleTab] allCls (primeros 3):', allCls?.slice(0, 3));

      const sectionCls = (allCls || [])
        .filter(cls => {
          // Comparar ID de sección de forma robusta (string vs string)
          const clsSectionId = cls.annualSections?.id;
          const sectionMatch = String(clsSectionId) === String(section.id);
          // Aceptar cualquier teacherId que sea truthy (no null, no 0, no undefined)
          const hasTeacher = cls.teacherId !== null && cls.teacherId !== undefined && cls.teacherId !== 0;
          return sectionMatch && hasTeacher;
        })
        .map(cls => {
          const courseInfo = (courses || []).find(c => String(c.id) === String(cls.courseId));
          const teacherInfo = (teachers || []).find(
            t => String(t.id) === String(cls.teacherId)
          );
          return {
            id: cls.id,
            courseId: cls.courseId,
            teacherId: cls.teacherId,
            name: courseInfo ? courseInfo.name : `Curso ID: ${cls.courseId}`,
            code: courseInfo ? courseInfo.code : '',
            teacher: teacherInfo
              ? `${teacherInfo.nombres} ${teacherInfo.apellidos}`
              : `Docente ID: ${cls.teacherId}`
          };
        });

      console.log('[ScheduleTab] sectionCls con docente:', sectionCls);
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
  };


  useEffect(() => {
    fetchData();
  }, [section]);

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-gray-100">
        <div>
          <h4 className="text-sm font-bold text-primary">Horario Escolar</h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {classSchedules.length} bloques asignados · {timeBlocks.length} bloques definidos
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
                className="w-full bg-white border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 text-xs text-primary outline-none transition-all"
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
                className="w-full bg-white border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 text-xs text-primary outline-none transition-all"
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
                className="w-full bg-white border border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2 text-xs text-primary outline-none transition-all cursor-pointer"
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

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs">Cargando horario...</span>
        </div>
      ) : timeBlocks.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-gray-100">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">Sin bloques horarios</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Crea primero los bloques horarios usando el botón de arriba
          </p>
        </div>
      ) : (
        <>
          {/* Aviso: no hay cursos con docente asignado */}
          {sectionClasses.length === 0 && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                No hay cursos con docente asignado en esta sección.
                Asigna profesores en la pestaña <strong>Cursos Asignados</strong> antes de armar el horario.
              </span>
            </div>
          )}

          {/* Grilla del Horario */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-left text-[10px] font-bold text-secondary/60 uppercase tracking-wider min-w-[130px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Bloque
                    </div>
                  </th>
                  {DAYS.map(day => (
                    <th
                      key={day.value}
                      className="py-3 px-3 text-center text-[10px] font-bold text-secondary/60 uppercase tracking-wider min-w-[130px]"
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
                      className={isBreak ? 'bg-amber-50/30' : 'hover:bg-slate-50/20 transition-colors'}
                    >
                      {/* Info del bloque */}
                      <td className="py-2.5 px-4 border-r border-gray-50">
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
                        // Bloques de tipo RECREO o ALMUERZO no permiten asignación
                        if (isBreak) {
                          return (
                            <td key={day.value} className="py-2.5 px-3">
                              <div className="flex items-center justify-center h-12 text-[10px] text-amber-300 font-medium select-none">
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
                              <div className="group relative bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 min-h-[58px] flex flex-col justify-between transition-all hover:shadow-sm">
                                <div className="pr-4">
                                  <p
                                    className="text-[10px] font-bold text-indigo-800 leading-tight truncate"
                                    title={cell.name}
                                  >
                                    {cell.name}
                                  </p>
                                  <p
                                    className="text-[9px] text-indigo-500 mt-0.5 truncate"
                                    title={cell.teacher}
                                  >
                                    {cell.teacher}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteSchedule(cell.scheduleId, cell.name)}
                                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-rose-100 text-indigo-300 hover:text-rose-600 rounded-md transition-all cursor-pointer"
                                  title="Retirar del horario"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : isSelected ? (
                              /* Selector de curso activo */
                              <div className="bg-white border-2 border-primary/40 rounded-xl p-2 shadow-md min-h-[58px] space-y-1.5 animate-fade-in">
                                <select
                                  value={selectedCourseId}
                                  onChange={e => setSelectedCourseId(e.target.value)}
                                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-primary outline-none cursor-pointer"
                                  autoFocus
                                >
                                  <option value="">Seleccionar curso...</option>
                                  {sectionClasses.map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                      {cls.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedCell(null);
                                      setSelectedCourseId('');
                                    }}
                                    className="flex-1 py-1 text-[9px] font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={handleAssignCourse}
                                    disabled={!selectedCourseId || submittingSchedule}
                                    className="flex-1 py-1 text-[9px] font-bold text-white bg-[#031553] hover:bg-[#020d36] rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    {submittingSchedule ? '...' : 'Asignar'}
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
                                className="w-full min-h-[58px] border border-dashed border-gray-200 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-30 group"
                                title="Asignar curso a este bloque"
                              >
                                <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary/50 transition-colors" />
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

          {/* Leyenda de tipos */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-secondary/60 pt-1 border-t border-gray-100">
            <span className="font-bold uppercase tracking-wider">Leyenda:</span>
            {BLOCK_TYPES.map(t => (
              <span
                key={t.value}
                className={`px-2 py-0.5 rounded-md border font-bold ${t.color}`}
              >
                {t.label}
              </span>
            ))}
            <span className="ml-auto">
              Haz clic en una celda vacía <strong className="text-primary">( + )</strong> para asignar un curso
            </span>
          </div>
        </>
      )}
    </div>
  );
}