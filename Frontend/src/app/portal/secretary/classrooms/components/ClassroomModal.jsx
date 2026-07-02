// app/portal/admin/classrooms/components/ClassroomModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { DoorOpen, X } from 'lucide-react';
import { classroomStatuses, classroomTypes, buildings } from '../data';

export default function ClassroomModal({
  isOpen,
  onClose,
  onSubmit,
  formType,
  currentClassroom,
  classrooms
}) {
  const [formData, setFormData] = useState({
    building: '',
    roomNumber: '',
    maxCapacity: '25',
    status: 'DISPONIBLE',
    type: 'AULA_NORMAL'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentClassroom) {
      setFormData({
        building: currentClassroom.building || '',
        roomNumber: currentClassroom.roomNumber || '',
        maxCapacity: currentClassroom.maxCapacity?.toString() || '25',
        status: currentClassroom.status || 'DISPONIBLE',
        type: currentClassroom.type || 'AULA_NORMAL'
      });
    } else {
      setFormData({
        building: '',
        roomNumber: '',
        maxCapacity: '25',
        status: 'DISPONIBLE',
        type: 'AULA_NORMAL'
      });
    }
    setErrors({});
  }, [currentClassroom, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.building.trim()) newErrors.building = 'El edificio es obligatorio';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'El número de aula es obligatorio';
    if (!formData.maxCapacity || parseInt(formData.maxCapacity) < 1 || parseInt(formData.maxCapacity) > 30) {
      newErrors.maxCapacity = 'La capacidad debe ser entre 1 y 30';
    }
    const exists = classrooms.some(c =>
      c.roomNumber === formData.roomNumber.trim() &&
      c.id !== currentClassroom?.id
    );
    if (exists) {
      newErrors.roomNumber = 'Ya existe un aula con este número';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-white/80" />
            <h3 className="font-bold text-sm tracking-tight">
              {formType === 'create' ? 'Crear Nueva Aula' : 'Editar Aula'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Building */}
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Edificio / Pabellón *
              </label>
              <select
                name="building"
                value={formData.building}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer ${
                  errors.building ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              >
                <option value="">Seleccionar edificio...</option>
                {buildings.map((building) => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
              {errors.building && <p className="text-[10px] text-rose-600 font-bold">{errors.building}</p>}
            </div>

            {/* Room Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Número de Aula *
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Ej. 101, A-202"
                className={`w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all ${
                  errors.roomNumber ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              />
              {errors.roomNumber && <p className="text-[10px] text-rose-600 font-bold">{errors.roomNumber}</p>}
            </div>

            {/* Max Capacity */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Capacidad Máxima *
              </label>
              <input
                type="number"
                name="maxCapacity"
                min="1"
                max="30"
                value={formData.maxCapacity}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all ${
                  errors.maxCapacity ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40'
                }`}
              />
              {errors.maxCapacity && <p className="text-[10px] text-rose-600 font-bold">{errors.maxCapacity}</p>}
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Tipo de Aula *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer"
              >
                {classroomTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                Estado *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 px-3 text-xs text-primary outline-none transition-all cursor-pointer"
              >
                {classroomStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-secondary hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer select-none"
            >
              {formType === 'create' ? 'Crear Aula' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}