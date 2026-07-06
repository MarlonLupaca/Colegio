'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  GraduationCap,
  Calendar,
  User,
  DoorOpen,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { sectionLetters } from '../data';

// ── Constantes ──────────────────────────────────────────────────────────────

const EDUCATION_LEVELS = [
  { value: 'PRIMARIA', label: 'Primaria' },
  { value: 'SECUNDARIA', label: 'Secundaria' },
];

const PRIMARIA_GRADES = [
  { value: 1, label: '1° Grado de Primaria' },
  { value: 2, label: '2° Grado de Primaria' },
  { value: 3, label: '3° Grado de Primaria' },
  { value: 4, label: '4° Grado de Primaria' },
  { value: 5, label: '5° Grado de Primaria' },
  { value: 6, label: '6° Grado de Primaria' },
];

const SECUNDARIA_GRADES = [
  { value: 1, label: '1° Año de Secundaria' },
  { value: 2, label: '2° Año de Secundaria' },
  { value: 3, label: '3° Año de Secundaria' },
  { value: 4, label: '4° Año de Secundaria' },
  { value: 5, label: '5° Año de Secundaria' },
];

// Genera rango de años académicos (año actual ± 2)
const buildYearOptions = () => {
  const current = new Date().getFullYear();
  return [current - 1, current, current + 1, current + 2].map((y) => ({
    value: y,
    label: String(y),
  }));
};

const YEAR_OPTIONS = buildYearOptions();

const EMPTY_FORM = {
  academicYear: new Date().getFullYear() + 1,
  educationLevel: 'PRIMARIA',
  gradeLevel: 1,
  sectionLetter: 'A',
  tutorTeacherId: '',
  classroomId: '',
};

// ── Subcomponente: Select estilizado con ícono ───────────────────────────────

function FieldSelect({ label, icon: Icon, name, value, onChange, children, error, required }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-primary/50" />}
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-slate-50 border rounded-xl py-2.5 pl-3 pr-8 text-xs text-primary outline-none transition-all cursor-pointer ${error ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus:border-primary/40 focus:ring-1 focus:ring-primary/10'
            }`}
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-[10px] text-rose-600 font-bold">{error}</p>}
    </div>
  );
}

// ── Subcomponente: Select de búsqueda enriquecido (para Tutor y Aula) ────────

function RichSelect({ label, icon: Icon, name, value, onChange, options, placeholder, loading, error, required, renderOption, renderSelected, getOptionId }) {
  // getOptionId permite adaptar el campo ID según el objeto (codigoUsuario para docentes, id para aulas)
  const resolveId = (opt) => getOptionId ? getOptionId(opt) : (opt.id ?? opt.value);

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-secondary uppercase tracking-wide flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-primary/50" />}
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className={`relative border rounded-xl overflow-hidden transition-all ${error ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/10'
        }`}>
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 text-xs text-secondary">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary/50" />
            Cargando...
          </div>
        ) : (
          <div className="relative">
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="w-full appearance-none bg-slate-50 py-2.5 pl-3 pr-8 text-xs text-primary outline-none cursor-pointer"
            >
              <option value="">{placeholder}</option>
              {options.map((opt) => (
                <option key={resolveId(opt)} value={resolveId(opt)}>
                  {renderOption(opt)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Preview de la selección actual */}
        {value && !loading && (() => {
          const selected = options.find((o) => String(resolveId(o)) === String(value));
          return selected ? (
            <div className="px-3 py-2 bg-primary/5 border-t border-gray-100 text-[10px] text-primary font-medium">
              {renderSelected(selected)}
            </div>
          ) : null;
        })()}
      </div>

      {error && <p className="text-[10px] text-rose-600 font-bold">{error}</p>}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function NewSectionModal({
  isOpen,
  onClose,
  onSubmit,
  // Listas para los selects — se llenarán con endpoints más adelante
  teachers = [],   // [{ id, firstName, lastName, speciality?, ... }]
  classrooms = [], // [{ id, name, building?, capacity?, ... }]
  loadingTeachers = false,
  loadingClassrooms = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gradeOptions =
    formData.educationLevel === 'PRIMARIA' ? PRIMARIA_GRADES : SECUNDARIA_GRADES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Si cambia el nivel y el grado ya no es válido, lo resetea
      if (name === 'educationLevel') {
        const maxGrade = value === 'SECUNDARIA' ? 5 : 6;
        if (prev.gradeLevel > maxGrade) next.gradeLevel = 1;
      }
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.academicYear) e.academicYear = 'El año académico es obligatorio';
    if (!formData.educationLevel) e.educationLevel = 'El nivel es obligatorio';
    if (!formData.gradeLevel) e.gradeLevel = 'El grado es obligatorio';
    if (!formData.sectionLetter) e.sectionLetter = 'La sección es obligatoria';
    if (!formData.tutorTeacherId) e.tutorTeacherId = 'Debes asignar un profesor tutor';
    if (!formData.classroomId) e.classroomId = 'Debes asignar un aula';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Payload exacto que espera el backend
    const payload = {
      academicYear: parseInt(formData.academicYear),
      tutorTeacherId: parseInt(formData.tutorTeacherId),
      educationLevel: formData.educationLevel,
      gradeLevel: parseInt(formData.gradeLevel),
      sectionLetter: formData.sectionLetter,
      classroom: { id: formData.classroomId },
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-gray-100/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#031553] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-white/70" />
            Registrar Nueva Sección
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left text-xs text-[#031553] overflow-y-auto max-h-[80vh]">

          {/* ── Bloque 1: Año y Nivel ── */}
          <div className="grid grid-cols-2 gap-4">
            <FieldSelect
              label="Año Académico"
              icon={Calendar}
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              error={errors.academicYear}
              required
            >
              {YEAR_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FieldSelect>

            <FieldSelect
              label="Nivel Educativo"
              icon={GraduationCap}
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              error={errors.educationLevel}
              required
            >
              {EDUCATION_LEVELS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FieldSelect>
          </div>

          {/* ── Bloque 2: Grado y Sección ── */}
          <div className="grid grid-cols-2 gap-4">
            <FieldSelect
              label="Grado Escolar"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              error={errors.gradeLevel}
              required
            >
              {gradeOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FieldSelect>

            <FieldSelect
              label="Letra de Sección"
              name="sectionLetter"
              value={formData.sectionLetter}
              onChange={handleChange}
              error={errors.sectionLetter}
              required
            >
              {sectionLetters.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FieldSelect>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-100 pt-1">
            <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest mb-4">
              Asignaciones
            </p>

            {/* ── Tutor ── */}
            <div className="space-y-4">
              <RichSelect
                label="Profesor Tutor"
                icon={User}
                name="tutorTeacherId"
                value={formData.tutorTeacherId}
                onChange={handleChange}
                options={teachers}
                placeholder="— Selecciona un profesor —"
                loading={loadingTeachers}
                error={errors.tutorTeacherId}
                required
                // Los docentes usan t.id como identificador para tutorTeacherId
                getOptionId={(t) => t.id}
                renderOption={(t) =>
                  `${t.nombres ?? ''} ${t.apellidos ?? ''}${t.especialidad ? ` · ${t.especialidad}` : ''}`
                }
                renderSelected={(t) => (
                  <span>
                    <span className="font-bold">{t.nombres} {t.apellidos}</span>
                    {t.especialidad && <span className="text-secondary ml-1">· {t.especialidad}</span>}
                    {t.codigoUsuario && <span className="text-primary/40 ml-1">#{t.codigoUsuario}</span>}
                  </span>
                )}
              />

              {/* ── Aula ── */}
              <RichSelect
                label="Aula / Salón"
                icon={DoorOpen}
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                options={classrooms}
                placeholder="— Selecciona un aula —"
                loading={loadingClassrooms}
                error={errors.classroomId}
                required
                renderOption={(c) =>
                  `${c.roomNumber ?? c.id}${c.building ? ` · ${c.building}` : ''}${c.maxCapacity ? ` (Cap. ${c.maxCapacity})` : ''}`
                }
                renderSelected={(c) => (
                  <span>
                    <span className="font-bold">Aula {c.roomNumber}</span>
                    {c.building && <span className="text-secondary ml-1">· {c.building}</span>}
                    {c.maxCapacity && <span className="text-primary/40 ml-1">· Cap. {c.maxCapacity} alumnos</span>}
                    {c.status && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${c.status === 'DISPONIBLE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>{c.status}</span>
                    )}
                  </span>
                )}
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all cursor-pointer text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer text-xs"
            >
              <Check className="w-3.5 h-3.5" /> Crear Sección
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}