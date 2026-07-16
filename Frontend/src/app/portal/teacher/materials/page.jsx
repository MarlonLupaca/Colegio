'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, FolderOpen, FileText, File, Trash2, Download,
  Eye, EyeOff, BookOpen, Calendar, Filter, Plus, X, Search,
  CheckCircle, AlertCircle, Clock, ChevronDown
} from 'lucide-react';
import { apiFetch, API_BASE_URL, cookies } from '@/config/api';
import { useToast } from '@/context/ToastContext';

// ─────────────── Helpers ───────────────
const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'pdf': return { color: '#ef4444', label: 'PDF' };
    case 'docx': return { color: '#3b82f6', label: 'WORD' };
    case 'xlsx': return { color: '#22c55e', label: 'EXCEL' };
    default: return { color: '#6b7280', label: tipo?.toUpperCase() || 'DOC' };
  }
};

const trimestreLabel = { PRIMERO: '1er Trimestre (Mar–May)', SEGUNDO: '2do Trimestre (Jun–Sep)', TERCERO: '3er Trimestre (Sep–Dic)' };

// ─────────────── Upload Modal ───────────────
function UploadModal({ isOpen, onClose, courses, onSuccess }) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1); // 1: select file, 2: fill metadata
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [courses_, setCourses_] = useState(courses || []);
  const [weeks, setWeeks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  const [form, setForm] = useState(() => {
    let codigo = '';
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      codigo = user.codigoUsuario || user.codigo || '';
    }
    return {
      titulo: '',
      descripcion: '',
      courseId: '',
      weekId: '',
      codigoDocente: codigo,
      esPublico: true
    };
  });
  // Estado de errores del formulario de materiales
  const [uploadErrors, setUploadErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFile(null);
        setStep(1);
        setForm(prev => {
          let codigo = '';
          if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            codigo = user.codigoUsuario || user.codigo || '';
          }
          return {
            titulo: '',
            descripcion: '',
            courseId: '',
            weekId: '',
            codigoDocente: codigo,
            esPublico: true
          };
        });
        setUploadErrors({});
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (form.courseId) {
      apiFetch(`/api/v1/weeks/course/${form.courseId}`)
        .then(setWeeks)
        .catch(() => setWeeks([]));
    } else {
      const timer = setTimeout(() => {
        setWeeks([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [form.courseId]);

  const handleFile = (f) => {
    const allowed = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowed.includes(f.type)) {
      showToast('Solo se permiten archivos PDF, DOCX y XLSX.', 'error');
      return;
    }
    setFile(f);
    setForm(prev => ({ ...prev, titulo: f.name.replace(/\.[^.]+$/, '') }));
    setStep(2);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    // Validación mejorada con errores en línea
    const errs = {};
    if (!form.titulo.trim()) {
      errs.titulo = 'El título del material es obligatorio';
    } else if (form.titulo.trim().length < 3) {
      errs.titulo = 'El título debe tener al menos 3 caracteres';
    }
    if (!form.courseId) {
      errs.courseId = 'Debes seleccionar un curso';
    }
    if (!form.codigoDocente) {
      errs.codigoDocente = 'El código del docente es obligatorio';
    }
    setUploadErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Por favor completa los campos requeridos.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const metadata = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        courseId: form.courseId,
        weekId: form.weekId || null,
        codigoDocente: form.codigoDocente,
        esPublico: form.esPublico
      };

      const token = cookies.get('token');
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/api/v1/materials/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      if (!res.ok) throw new Error('Error al subir el material');
      showToast('¡Material subido exitosamente!', 'success');
      onSuccess?.();
      handleClose();
    } catch (err) {
      showToast(err.message || 'Error al subir el material.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setForm({ titulo: '', descripcion: '', courseId: '', weekId: '', codigoDocente: '', esPublico: true });
    setUploadErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#031553] to-[#1a3a8f] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Subir Material</h3>
              <p className="text-white/60 text-[10px]">Paso {step} de 2</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step bar */}
        <div className="flex border-b border-gray-100 shrink-0">
          {[{ n: 1, label: 'Archivo' }, { n: 2, label: 'Información' }].map(s => (
            <div key={s.n} className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 transition-all ${step >= s.n ? 'border-[#031553] text-[#031553]' : 'border-transparent text-gray-400'}`}>
              {s.label}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${dragOver ? 'border-[#031553] bg-blue-50' : 'border-gray-200 hover:border-[#031553]/50 hover:bg-slate-50'}`}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#031553] to-[#1a3a8f] rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-gray-700 text-sm">Arrastra tu archivo aquí</p>
              <p className="text-gray-400 text-xs mt-1">o haz clic para seleccionar</p>
              <p className="text-gray-300 text-[10px] mt-3">PDF · DOCX · XLSX · Máx 20MB</p>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx" className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* File badge */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0" style={{ background: getFileIcon(file?.name?.split('.').pop()).color }}>
                  {getFileIcon(file?.name?.split('.').pop()).label}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-700 text-xs truncate">{file?.name}</p>
                  <p className="text-gray-400 text-[10px]">{formatBytes(file?.size)}</p>
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Título <span className="text-red-400">*</span></label>
                <input
                  className={`w-full border rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 transition-all ${
                    uploadErrors.titulo ? 'border-rose-400 ring-1 ring-rose-100' : 'border-gray-200'
                  }`}
                  value={form.titulo}
                  onChange={e => {
                    setForm(p => ({ ...p, titulo: e.target.value }));
                    if (uploadErrors.titulo) setUploadErrors(prev => ({ ...prev, titulo: null }));
                  }}
                  placeholder="Ej: Guía de Matemáticas - Semana 3"
                />
                {uploadErrors.titulo && <p className="text-[10px] text-rose-600 font-bold mt-1">{uploadErrors.titulo}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Descripción (opcional)</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 transition-all resize-none"
                  value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Breve descripción del contenido..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Curso <span className="text-red-400">*</span></label>
                  <select
                    className={`w-full border rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 bg-white cursor-pointer ${
                      uploadErrors.courseId ? 'border-rose-400 ring-1 ring-rose-100' : 'border-gray-200'
                    }`}
                    value={form.courseId}
                    onChange={e => {
                      setForm(p => ({ ...p, courseId: e.target.value, weekId: '' }));
                      if (uploadErrors.courseId) setUploadErrors(prev => ({ ...prev, courseId: null }));
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {courses_.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {uploadErrors.courseId && <p className="text-[10px] text-rose-600 font-bold mt-1">{uploadErrors.courseId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Semana</label>
                  <select className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 bg-white cursor-pointer"
                    value={form.weekId} onChange={e => setForm(p => ({ ...p, weekId: e.target.value }))} disabled={!form.courseId}>
                    <option value="">Sin semana</option>
                    {weeks.map(w => <option key={w.id} value={w.id}>{w.descripcion}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Código Docente <span className="text-red-400">*</span></label>
                <input className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 focus:ring-1 focus:ring-[#031553]/20 transition-all bg-slate-50"
                  value={form.codigoDocente} onChange={e => setForm(p => ({ ...p, codigoDocente: e.target.value }))} placeholder="DOC001" />
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  {form.esPublico ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  <div>
                    <p className="text-xs font-bold text-gray-700">{form.esPublico ? 'Público' : 'Privado'}</p>
                    <p className="text-[10px] text-gray-400">{form.esPublico ? 'Los alumnos pueden ver este material' : 'Solo tú puedes verlo'}</p>
                  </div>
                </div>
                <button onClick={() => setForm(p => ({ ...p, esPublico: !p.esPublico }))}
                  className={`w-10 h-5 rounded-full transition-all cursor-pointer ${form.esPublico ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform m-0.5 ${form.esPublico ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2 shrink-0 bg-white">
            <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl text-xs cursor-pointer transition-all">
              Atrás
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="bg-gradient-to-r from-[#031553] to-[#1a3a8f] hover:opacity-90 text-white font-bold px-5 py-2 rounded-xl shadow text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50">
              <Upload className="w-3.5 h-3.5" />
              {submitting ? 'Subiendo...' : 'Subir Material'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────── Material Card ───────────────
function MaterialCard({ material, onDelete, onDownload }) {
  const icon = getFileIcon(material.tipoArchivo);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm" style={{ background: icon.color }}>
          {icon.label}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-xs leading-tight truncate">{material.titulo}</h4>
          {material.descripcion && <p className="text-gray-400 text-[10px] mt-0.5 truncate">{material.descripcion}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] text-gray-400">{formatBytes(material.tamanoBytes)}</span>
            <span className="text-gray-300">·</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${material.esPublico ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              {material.esPublico ? '🔓 Público' : '🔒 Privado'}
            </span>
            {material.weekDescripcion && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-blue-500 font-medium truncate max-w-[120px]">{material.weekDescripcion?.split(' - ')[0]}</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-gray-300 mt-1">
            {material.fechaSubida ? new Date(material.fechaSubida).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-50 px-4 py-2 flex justify-end gap-1 bg-slate-50/50">
        <button onClick={() => onDownload(material)}
          className="flex items-center gap-1 text-[10px] font-bold text-[#031553] hover:bg-[#031553] hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
          <Download className="w-3 h-3" /> Descargar
        </button>
        <button onClick={() => onDelete(material)}
          className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer">
          <Trash2 className="w-3 h-3" /> Eliminar
        </button>
      </div>
    </div>
  );
}

// ─────────────── Main Page ───────────────
export default function MaterialsPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTrimestre, setSelectedTrimestre] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [codigoDocente, setCodigoDocente] = useState(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.codigoUsuario || user.codigo || '';
    }
    return '';
  });

  const loadCourses = useCallback(async () => {
    try {
      const data = await apiFetch('/api/v1/courses');
      setCourses(data);
    } catch {
      setCourses([]);
    }
  }, []);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/v1/materials/docente/${codigoDocente}`);
      setMaterials(data);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [codigoDocente]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCourses]);

  useEffect(() => {
    if (codigoDocente) {
      const timer = setTimeout(() => {
        loadMaterials();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [codigoDocente, loadMaterials]);

  useEffect(() => {
    if (selectedCourse) {
      apiFetch(`/api/v1/weeks/course/${selectedCourse}`)
        .then(setWeeks)
        .catch(() => setWeeks([]));
    } else {
      const timer = setTimeout(() => {
        setWeeks([]);
        setSelectedWeek('');
        setSelectedTrimestre('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedCourse]);

  const handleDownload = async (material) => {
    try {
      const token = cookies.get('token');
      const res = await fetch(`${API_BASE_URL}/api/v1/materials/download/${material.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.nombreOriginal || `material_${material.id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast('Error al descargar el archivo.', 'error');
    }
  };

  const handleDelete = async (material) => {
    if (!confirm(`¿Eliminar "${material.titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiFetch(`/api/v1/materials/${material.id}`, { method: 'DELETE' });
      showToast('Material eliminado correctamente.', 'success');
      loadMaterials();
    } catch {
      showToast('Error al eliminar el material.', 'error');
    }
  };

  // Filtros
  const filtered = materials.filter(m => {
    if (selectedCourse && String(m.courseId) !== String(selectedCourse)) return false;
    if (selectedWeek && String(m.weekId) !== String(selectedWeek)) return false;
    if (searchTerm && !m.titulo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const weeksByTrimestre = weeks.reduce((acc, w) => {
    acc[w.trimestre] = acc[w.trimestre] || [];
    acc[w.trimestre].push(w);
    return acc;
  }, {});

  const filteredWeeks = selectedTrimestre ? (weeksByTrimestre[selectedTrimestre] || []) : weeks;

  // Stats
  const totalPublic = materials.filter(m => m.esPublico).length;
  const totalPrivate = materials.filter(m => !m.esPublico).length;

  return (
    <div className="space-y-6 text-[#031553]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">Materiales Educativos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona los archivos de tus cursos</p>
        </div>
        <button onClick={() => setUploadOpen(true)}
          className="bg-gradient-to-r from-[#031553] to-[#1a3a8f] text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Subir Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: materials.length, icon: FolderOpen, color: 'from-[#031553] to-[#1a3a8f]' },
          { label: 'Públicos', value: totalPublic, icon: Eye, color: 'from-green-500 to-emerald-600' },
          { label: 'Privados', value: totalPrivate, icon: EyeOff, color: 'from-gray-400 to-gray-600' }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-800">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filtros</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Search */}
          <div className="relative col-span-2 md:col-span-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Buscar material..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#031553]/40 transition-all" />
          </div>
          {/* Curso */}
          <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setSelectedWeek(''); }}
            className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 bg-white cursor-pointer">
            <option value="">Todos los cursos</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {/* Trimestre */}
          <select value={selectedTrimestre} onChange={e => { setSelectedTrimestre(e.target.value); setSelectedWeek(''); }}
            disabled={!selectedCourse} className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 bg-white cursor-pointer disabled:opacity-50">
            <option value="">Todos los trimestres</option>
            {Object.keys(weeksByTrimestre).map(t => <option key={t} value={t}>{trimestreLabel[t]}</option>)}
          </select>
          {/* Semana */}
          <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)}
            disabled={!selectedCourse} className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553]/40 bg-white cursor-pointer disabled:opacity-50">
            <option value="">Todas las semanas</option>
            {filteredWeeks.map(w => <option key={w.id} value={w.id}>{w.descripcion?.split('(')[0].trim()}</option>)}
          </select>
        </div>
      </div>

      {/* Materials grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="w-6 h-6 border-2 border-[#031553]/30 border-t-[#031553] rounded-full animate-spin mr-2" />
          Cargando materiales...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-bold text-gray-500 text-sm">No hay materiales</p>
          <p className="text-gray-300 text-xs mt-1">Sube tu primer archivo haciendo clic en &quot;Subir Material&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(m => (
            <MaterialCard key={m.id} material={m} onDelete={handleDelete} onDownload={handleDownload} />
          ))}
        </div>
      )}

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        courses={courses}
        onSuccess={loadMaterials}
      />
    </div>
  );
}
