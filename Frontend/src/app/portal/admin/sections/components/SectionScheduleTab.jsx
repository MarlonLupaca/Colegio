// app/portal/admin/sections/components/SectionScheduleTab.jsx
'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';

// Datos de ejemplo para días y bloques horarios
const DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' }
];

const TIME_BLOCKS = [
  { id: '1', start: '07:30', end: '08:15', label: '1° Bloque' },
  { id: '2', start: '08:15', end: '09:00', label: '2° Bloque' },
  { id: '3', start: '09:00', end: '09:45', label: '3° Bloque' },
  { id: '4', start: '09:45', end: '10:00', label: 'Recreo' },
  { id: '5', start: '10:00', end: '10:45', label: '4° Bloque' },
  { id: '6', start: '10:45', end: '11:30', label: '5° Bloque' },
  { id: '7', start: '11:30', end: '12:15', label: '6° Bloque' },
  { id: '8', start: '12:15', end: '13:00', label: '7° Bloque' }
];

// Horarios iniciales de ejemplo
const initialSchedule = [
  { id: '1', day: 'LUNES', block: '1', course: 'Matemáticas', teacher: 'María Pérez' },
  { id: '2', day: 'LUNES', block: '2', course: 'Comunicación', teacher: 'Juan Gómez' },
  { id: '3', day: 'MARTES', block: '1', course: 'Matemáticas', teacher: 'María Pérez' },
  { id: '4', day: 'MARTES', block: '3', course: 'Ciencia', teacher: 'Ana López' },
  { id: '5', day: 'MIERCOLES', block: '2', course: 'Historia', teacher: 'Roberto Torres' },
  { id: '6', day: 'JUEVES', block: '1', course: 'Inglés', teacher: 'Patricia Soto' },
  { id: '7', day: 'JUEVES', block: '4', course: 'Arte', teacher: 'Elena Vargas' },
  { id: '8', day: 'VIERNES', block: '2', course: 'Matemáticas', teacher: 'María Pérez' }
];

export default function SectionScheduleTab({ section }) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedDays, setExpandedDays] = useState({
    LUNES: true,
    MARTES: true,
    MIERCOLES: true,
    JUEVES: true,
    VIERNES: true
  });
  
  const [formData, setFormData] = useState({
    day: 'LUNES',
    block: '1',
    course: '',
    teacher: ''
  });

  const [errors, setErrors] = useState({});

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

  const toggleDay = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const getDaySchedule = (day) => {
    return schedule.filter(s => s.day === day);
  };

  const getCourseName = (courseId) => {
    const course = section.courses?.find(c => c.id === courseId);
    return course ? course.name : 'Curso no asignado';
  };

  const getTeacherName = (courseId) => {
    const course = section.courses?.find(c => c.id === courseId);
    return course ? course.teacher : 'Sin profesor';
  };

  const getBlockLabel = (blockId) => {
    const block = TIME_BLOCKS.find(b => b.id === blockId);
    return block ? `${block.start} - ${block.end}` : blockId;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.day) newErrors.day = 'El día es obligatorio';
    if (!formData.block) newErrors.block = 'El bloque es obligatorio';
    if (!formData.course) newErrors.course = 'El curso es obligatorio';
    
    // Verificar duplicado
    const exists = schedule.some(s => 
      s.day === formData.day && 
      s.block === formData.block && 
      s.id !== editingId
    );
    if (exists) {
      newErrors.duplicate = 'Ya existe un curso en este horario';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const newSchedule = {
      id: `s-${Date.now()}`,
      day: formData.day,
      block: formData.block,
      course: formData.course,
      teacher: formData.teacher
    };

    setSchedule(prev => [...prev, newSchedule]);
    setFormData({ day: 'LUNES', block: '1', course: '', teacher: '' });
    setIsAdding(false);
  };

  const handleEdit = (id) => {
    const item = schedule.find(s => s.id === id);
    if (item) {
      setFormData({
        day: item.day,
        block: item.block,
        course: item.course,
        teacher: item.teacher
      });
      setEditingId(id);
    }
  };

  const handleSaveEdit = () => {
    if (!validate()) return;

    setSchedule(prev => prev.map(s => 
      s.id === editingId 
        ? { ...s, ...formData }
        : s
    ));
    setFormData({ day: 'LUNES', block: '1', course: '', teacher: '' });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const handleCancel = () => {
    setFormData({ day: 'LUNES', block: '1', course: '', teacher: '' });
    setIsAdding(false);
    setEditingId(null);
    setErrors({});
  };

  const handleCopySchedule = () => {
    // Copiar horario de otra sección (simulado)
    alert('Funcionalidad: Copiar horario de otra sección');
  };

  // Obtener cursos disponibles para asignar
  const availableCourses = section.courses || [];

  // Agrupar horarios por día
  const scheduleByDay = DAYS.reduce((acc, day) => {
    acc[day.value] = getDaySchedule(day.value);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-primary">
            Horario de Clases
          </h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {schedule.length} bloques horarios asignados
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopySchedule}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-secondary text-xs font-bold rounded-xl transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar Horario
          </button>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Bloque
            </button>
          )}
        </div>
      </div>

      {/* Formulario de agregar/editar */}
      {(isAdding || editingId) && (
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h5 className="text-xs font-bold text-secondary uppercase tracking-wider">
            {editingId ? 'Editar Bloque Horario' : 'Agregar Nuevo Bloque'}
          </h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Día */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Día *
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all ${
                  errors.day ? 'border-rose-400' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                {DAYS.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            {/* Bloque */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Bloque *
              </label>
              <select
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all ${
                  errors.block ? 'border-rose-400' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                {TIME_BLOCKS.map(block => (
                  <option key={block.id} value={block.id}>
                    {block.label} ({block.start} - {block.end})
                  </option>
                ))}
              </select>
            </div>

            {/* Curso */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Curso *
              </label>
              <select
                value={formData.course}
                onChange={(e) => {
                  const courseId = e.target.value;
                  const course = availableCourses.find(c => c.id === courseId);
                  setFormData({ 
                    ...formData, 
                    course: courseId,
                    teacher: course ? course.teacher : ''
                  });
                }}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all ${
                  errors.course ? 'border-rose-400' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                <option value="">Seleccionar curso</option>
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            {/* Profesor (auto-completado) */}
            <div>
              <label className="text-[9px] font-bold text-secondary/60 uppercase tracking-wider block mb-1">
                Profesor
              </label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                placeholder="Nombre del profesor"
                className="w-full bg-white border border-gray-200 focus:border-primary/40 rounded-lg px-3 py-2 text-xs text-primary outline-none transition-all"
                disabled={!!availableCourses.find(c => c.id === formData.course)}
              />
            </div>
          </div>

          {errors.duplicate && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-rose-700 text-[10px] font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{errors.duplicate}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-bold text-secondary bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={editingId ? handleSaveEdit : handleAdd}
              className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg transition-all"
            >
              <Check className="w-3.5 h-3.5 inline mr-1" />
              {editingId ? 'Guardar Cambios' : 'Agregar Bloque'}
            </button>
          </div>
        </div>
      )}

      {/* Vista de Horario por Días */}
      {schedule.length > 0 ? (
        <div className="space-y-2">
          {DAYS.map((day) => {
            const daySchedule = scheduleByDay[day.value] || [];
            const isExpanded = expandedDays[day.value] !== false;

            return (
              <div key={day.value} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.value)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary/60" />
                    <span className="text-sm font-bold text-primary">{day.label}</span>
                    <span className="text-[10px] text-secondary/60">
                      {daySchedule.length} bloques
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-secondary/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-secondary/40" />
                  )}
                </button>

                {/* Day Content */}
                {isExpanded && (
                  <div className="p-3 space-y-1.5">
                    {daySchedule.length > 0 ? (
                      daySchedule.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 bg-white border border-gray-50 rounded-lg hover:border-gray-200 transition-all group"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-24 text-[10px] font-bold text-secondary/60">
                              {getBlockLabel(item.block)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-primary truncate">
                                {getCourseName(item.course)}
                              </p>
                              <p className="text-[10px] text-secondary/60 truncate">
                                Prof. {getTeacherName(item.course)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-primary rounded transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-secondary/40">
                        Sin bloques asignados para este día
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-gray-100">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">Sin horario asignado</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Haz clic en "Agregar Bloque" para crear el horario de esta sección
          </p>
        </div>
      )}

      {/* Footer Stats */}
      {schedule.length > 0 && (
        <div className="flex items-center justify-between text-[10px] text-secondary/60 border-t border-gray-100 pt-3">
          <span>Total: {schedule.length} bloques horarios</span>
          <span>{DAYS.filter(d => getDaySchedule(d.value).length > 0).length} días con clases</span>
        </div>
      )}
    </div>
  );
}