'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpenCheck,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Upload,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Calendar,
  FolderOpen,
  X,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { apiFetch, API_BASE_URL, cookies } from '@/config/api';
import { useToast } from '@/context/ToastContext';

// ─────────────── Helpers ───────────────
const TRIMESTRE_INFO = {
  PRIMERO: { label: '1er Trimestre', period: 'Mar – May' },
  SEGUNDO: { label: '2do Trimestre', period: 'Jun – Sep' },
  TERCERO: { label: '3er Trimestre', period: 'Sep – Dic' },
};

const formatBytes = (b) => {
  if (!b) return '';
  const k = 1024,
    s = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${s[i]}`;
};

const getFileExt = (tipo) => tipo?.toUpperCase() || 'DOC';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : '');

// ─────────────── Upload Modal ───────────────
function UploadModal({ isOpen, onClose, week, courseId, codigoDocente, onSuccess }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDesc] = useState('');
  const [esPublico, setPublico] = useState(true);
  const [submitting, setSub] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFile(null);
        setTitulo('');
        setDesc('');
        setPublico(true);
        setErrors({});
      }, 0);
    }
  }, [isOpen]);

  const handleFile = (f) => {
    const ok = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!ok.includes(f.type)) {
      showToast('Solo PDF, DOCX o XLSX.', 'error');
      return;
    }
    setFile(f);
    if (errors.file) setErrors(prev => ({ ...prev, file: null }));
    if (!titulo) setTitulo(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!file) newErrors.file = 'Debe seleccionar un archivo';
    if (!titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (titulo.trim().length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Por favor complete los campos requeridos.', 'error');
      return;
    }

    setSub(true);
    try {
      const metadata = { titulo, descripcion, courseId, weekId: week.id, codigoDocente, esPublico };
      const token = cookies.get('token');
      const fd = new FormData();
      fd.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      fd.append('file', file);
      const res = await fetch(`${API_BASE_URL}/api/v1/materials/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      showToast('Material subido correctamente.', 'success');
      onSuccess?.();
      onClose();
    } catch {
      showToast('Error al subir el material.', 'error');
    } finally {
      setSub(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#031553] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> Subir Material
            </h3>
            <p className="text-white/60 text-[10px] mt-0.5">
              {week?.descripcion} · {fmtDate(week?.fechaInicio)} – {fmtDate(week?.fechaFin)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Drop zone */}
          {!file ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#031553] bg-[#031553]/5'
                    : errors.file ? 'border-rose-400 bg-rose-50/10' : 'border-gray-200 hover:border-[#031553]/40 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-7 h-7 text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-500">Arrastra o haz clic para seleccionar</p>
                <p className="text-[10px] text-gray-400 mt-1">PDF · DOCX · XLSX · Máx 20MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.xlsx"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />
              </div>
              {errors.file && <p className="text-[10px] text-rose-600 font-bold mt-1 text-center">{errors.file}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-[#031553] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {getFileExt(file.name.split('.').pop())}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#031553] truncate">{file.name}</p>
                <p className="text-[10px] text-gray-400">{formatBytes(file.size)}</p>
              </div>
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              className={`w-full border rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553] transition-all ${
                errors.titulo ? 'border-rose-400 ring-1 ring-rose-200' : 'border-gray-200'
              }`}
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (errors.titulo) setErrors(prev => ({ ...prev, titulo: null }));
              }}
              placeholder="Ej: Guía de ejercicios Semana 3"
            />
            {errors.titulo && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.titulo}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Descripción (opcional)
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553] transition-all resize-none"
              value={descripcion}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descripción breve del contenido..."
            />
          </div>

          {/* Visibilidad */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              {esPublico ? <Eye className="w-4 h-4 text-[#10b981]" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              <div>
                <p className="text-xs font-bold text-[#031553]">{esPublico ? 'Público' : 'Privado'}</p>
                <p className="text-[10px] text-gray-400">
                  {esPublico ? 'Visible para los alumnos' : 'Solo tú puedes verlo'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPublico(!esPublico)}
              className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${esPublico ? 'bg-[#10b981]' : 'bg-gray-300'}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-all ${esPublico ? 'left-5' : 'left-0.5'}`}
              />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !file}
            className="flex-1 py-2 bg-[#031553] hover:bg-[#020d36] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {submitting ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────── Week Row ───────────────
function WeekRow({ week, courseId, codigoDocente, expanded, onToggle, materialCount = 0 }) {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState([]);
  const [loadingMats, setLoadingM] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const loadMaterials = useCallback(async () => {
    setLoadingM(true);
    try {
      const data = await apiFetch(`/api/v1/materials/week/${week.id}`);
      setMaterials(data);
    } catch {
      setMaterials([]);
    } finally {
      setLoadingM(false);
    }
  }, [week.id]);

  useEffect(() => {
    if (expanded && materials.length === 0) {
      const timer = setTimeout(() => {
        loadMaterials();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [expanded, materials.length, loadMaterials]);

  const handleDownload = async (m) => {
    try {
      const token = cookies.get('token');
      const res = await fetch(`${API_BASE_URL}/api/v1/materials/download/${m.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = m.nombreOriginal || `material_${m.id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast('Error al descargar.', 'error');
    }
  };

  const handleDelete = async (m) => {
    if (!confirm(`¿Eliminar "${m.titulo}"?`)) return;
    try {
      await apiFetch(`/api/v1/materials/${m.id}`, { method: 'DELETE' });
      setMaterials((prev) => prev.filter((x) => x.id !== m.id));
      showToast('Material eliminado.', 'success');
    } catch {
      showToast('Error al eliminar.', 'error');
    }
  };

  // Conteo actualizado: usa materialCount hasta que se carguen los reales
  const displayCount = expanded ? materials.length : materialCount;
  const isEmpty = displayCount === 0;

  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${
        isEmpty ? 'border-dashed border-gray-200 bg-white opacity-70 hover:opacity-90' : 'border-gray-100 bg-white'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isEmpty ? 'bg-gray-100' : 'bg-primary/5'
            }`}
          >
            <span className={`text-[10px] font-black ${isEmpty ? 'text-gray-400' : 'text-[#031553]'}`}>
              {week.numeroSemana}
            </span>
          </div>
          <div>
            <p className={`font-bold text-xs ${isEmpty ? 'text-gray-400' : 'text-[#031553]'}`}>
              Semana {week.numeroSemana}
            </p>
            <p className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {fmtDate(week.fechaInicio)} – {fmtDate(week.fechaFin)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <span className="text-[10px] font-bold bg-primary/5 text-[#031553] px-2 py-0.5 rounded-full border border-[#031553]/10">
              {displayCount} archivo{displayCount !== 1 ? 's' : ''}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-secondary" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-50 p-4 space-y-3 bg-gray-50/30">
          {loadingMats ? (
            <div className="flex items-center justify-center py-6 text-secondary">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cargando materiales...
            </div>
          ) : (
            <>
              {materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-300">
                  <FolderOpen className="w-8 h-8 mb-2" />
                  <p className="text-xs text-secondary">Sin materiales en esta semana</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {materials.map((m) => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#031553] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                        {getFileExt(m.tipoArchivo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#031553] truncate">{m.titulo}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-secondary">{formatBytes(m.tamanoBytes)}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              m.esPublico
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}
                          >
                            {m.esPublico ? 'Público' : 'Privado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDownload(m)}
                          className="p-1.5 hover:bg-primary/5 text-secondary hover:text-[#031553] rounded-lg cursor-pointer transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          className="p-1.5 hover:bg-red-50 text-secondary hover:text-red-500 rounded-lg cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setUploadOpen(true)}
                className="w-full border-2 border-dashed border-[#031553]/15 hover:border-[#031553]/40 hover:bg-primary/5 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold text-secondary hover:text-[#031553] cursor-pointer transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Subir material a esta semana
              </button>
            </>
          )}
        </div>
      )}

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        week={week}
        courseId={courseId}
        codigoDocente={codigoDocente}
        onSuccess={() => {
          loadMaterials();
          setUploadOpen(false);
        }}
      />
    </div>
  );
}

// ─────────────── Course Detail ───────────────
function CourseDetail({ course, codigoDocente, onBack }) {
  const [activeTrimestre, setActiveTrimestre] = useState('PRIMERO');
  const [weeks, setWeeks] = useState([]);
  const [loadingW, setLoadingW] = useState(true);
  const [expandedWeeks, setExp] = useState({});
  // mapa weekId → cantidad de materiales (pre-cargado)
  const [countByWeek, setCountByWeek] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoadingW(true);
      try {
        // Cargar semanas y materiales del curso en paralelo
        const [weeksData, matsData] = await Promise.all([
          apiFetch(`/api/v1/weeks/course/${course.id}`),
          apiFetch(`/api/v1/materials/course/${course.id}`).catch(() => []),
        ]);
        setWeeks(weeksData);
        // Agrupar materiales por weekId
        const counts = {};
        for (const m of matsData) {
          if (m.weekId) counts[m.weekId] = (counts[m.weekId] || 0) + 1;
        }
        setCountByWeek(counts);
      } catch {
        setWeeks([]);
      } finally {
        setLoadingW(false);
      }
    };
    load();
  }, [course.id]);

  const weeksByTrimestre = weeks.reduce((acc, w) => {
    acc[w.trimestre] = acc[w.trimestre] || [];
    acc[w.trimestre].push(w);
    return acc;
  }, {});

  const activeWeeks = weeksByTrimestre[activeTrimestre] || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + Trimestre tabs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#031553] hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-100 cursor-pointer transition-all bg-white"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Cursos
        </button>

        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1">
          {Object.entries(TRIMESTRE_INFO).map(([key, info]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTrimestre(key);
                setExp({});
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeTrimestre === key ? 'bg-[#031553] text-white shadow-sm' : 'text-secondary hover:text-[#031553]'
              }`}
            >
              {info.period}
            </button>
          ))}
        </div>
      </div>

      {/* Course header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{course.code}</span>
            <h2 className="text-lg font-bold text-[#031553] mt-0.5">{course.name}</h2>
          </div>
          <span className="text-[10px] font-bold text-[#031553] bg-primary/5 border border-[#031553]/10 px-2.5 py-1 rounded-lg shrink-0">
            {TRIMESTRE_INFO[activeTrimestre].label} · {TRIMESTRE_INFO[activeTrimestre].period}
          </span>
        </div>
        {course.description && <p className="text-xs text-secondary mt-2">{course.description}</p>}
      </div>

      {/* Weeks */}
      <div className="space-y-3 pb-6">
        {loadingW ? (
          <div className="flex items-center justify-center py-16 text-secondary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando semanas...
          </div>
        ) : activeWeeks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm font-bold text-secondary">Sin semanas para este trimestre</p>
          </div>
        ) : (
          activeWeeks.map((w) => (
            <WeekRow
              key={w.id}
              week={w}
              courseId={course.id}
              codigoDocente={codigoDocente}
              expanded={!!expandedWeeks[w.id]}
              onToggle={() => setExp((prev) => ({ ...prev, [w.id]: !prev[w.id] }))}
              materialCount={countByWeek[w.id] || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────── Main Page ───────────────
export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelected] = useState(null);
  const [codigoDocente, setCodigo] = useState(() => typeof window !== 'undefined' ? cookies.get('userCode') || '' : '');

  const loadCourses = async (teacherCode) => {
    if (!teacherCode) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const teacherCourses = await apiFetch(`/api/v1/courses/teacher/${teacherCode}`);
      setCourses(teacherCourses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codigoDocente) {
      const timer = setTimeout(() => {
        loadCourses(codigoDocente);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [codigoDocente]);

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} codigoDocente={codigoDocente} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in text-xs text-[#031553]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-sm text-[#031553] flex items-center gap-2 select-none">
          <BookOpenCheck className="w-4 h-4" /> Gestión de Mis Cursos
        </h3>
        <span className="text-xs text-secondary">
          {courses.length} curso{courses.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-secondary">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando cursos...
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
            <BookOpen className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-[#031553] text-sm">No hay cursos disponibles</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelected(course)}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#031553]/15 transition-all cursor-pointer group"
            >
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">{course.code}</span>
                <h4 className="font-bold text-sm text-[#031553] group-hover:text-[#031553]/80 transition-colors leading-snug">
                  {course.name}
                </h4>
                {course.description && <p className="text-[10px] text-secondary line-clamp-2">{course.description}</p>}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-secondary font-medium">
                  <BookOpen className="w-3 h-3" />
                  {course.educationLevel === 'PRIMARIA' ? 'Primaria' : 'Secundaria'}
                  {course.gradeLevel && ` · ${course.gradeLevel}°`}
                </div>
                <span className="text-[10px] font-bold text-secondary group-hover:text-[#031553] transition-colors">
                  Ver semanas
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
