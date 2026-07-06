'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Download, Search, BookOpen, Eye, Filter, Loader2, Calendar } from 'lucide-react';
import { apiFetch, API_BASE_URL, cookies } from '@/config/api';
import { useToast } from '@/context/ToastContext';

const formatBytes = (b) => {
  if (!b) return '';
  const k = 1024, s = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${s[i]}`;
};

const getFileExt = (tipo) => tipo?.toUpperCase() || 'DOC';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : '';

const TRIMESTRE_LABEL = {
  PRIMERO: '1er Trimestre',
  SEGUNDO: '2do Trimestre',
  TERCERO: '3er Trimestre',
};

export default function StudentMaterialsPage() {
  const { showToast } = useToast();
  const [courses, setCourses]               = useState([]);
  const [materials, setMaterials]           = useState([]);
  const [weeks, setWeeks]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTrimestre, setSelTrim]     = useState('');
  const [selectedWeek, setSelectedWeek]     = useState('');
  const [searchTerm, setSearchTerm]         = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/courses');
      setCourses(data);
      const all = [];
      for (const course of data) {
        try {
          const mats = await apiFetch(`/api/v1/materials/course/${course.id}`);
          all.push(...mats.filter(m => m.esPublico));
        } catch { /* ignorar */ }
      }
      setMaterials(all);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      apiFetch(`/api/v1/weeks/course/${selectedCourse}`)
        .then(setWeeks)
        .catch(() => setWeeks([]));
    } else {
      setWeeks([]);
      setSelectedWeek('');
      setSelTrim('');
    }
  }, [selectedCourse]);

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
      showToast('Descarga iniciada.', 'success');
    } catch {
      showToast('Error al descargar el archivo.', 'error');
    }
  };

  const weeksByTrimestre = weeks.reduce((acc, w) => {
    acc[w.trimestre] = acc[w.trimestre] || [];
    acc[w.trimestre].push(w);
    return acc;
  }, {});

  const filteredWeeks = selectedTrimestre
    ? (weeksByTrimestre[selectedTrimestre] || [])
    : weeks;

  const filtered = materials.filter(m => {
    if (selectedCourse && String(m.courseId) !== String(selectedCourse)) return false;
    if (selectedWeek && String(m.weekId) !== String(selectedWeek)) return false;
    if (searchTerm && !m.titulo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const courseMap = courses.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});

  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in text-xs text-[#031553]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/5 rounded-xl text-[#031553]">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#031553] tracking-tight">Materiales de Clase</h2>
            <p className="text-xs text-secondary mt-0.5">
              Accede a los recursos compartidos por tus docentes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-center shadow-sm">
            <p className="text-lg font-bold text-[#031553]">{materials.length}</p>
            <p className="text-[9px] text-secondary font-medium uppercase tracking-wider">Disponibles</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-center shadow-sm">
            <p className="text-lg font-bold text-[#031553]">{courses.length}</p>
            <p className="text-[9px] text-secondary font-medium uppercase tracking-wider">Cursos</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filtros
        </span>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Search */}
          <div className="relative col-span-2 md:col-span-1">
            <Search className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar material..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#031553] transition-all"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={e => { setSelectedCourse(e.target.value); setSelectedWeek(''); setSelTrim(''); }}
            className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553] bg-white cursor-pointer text-[#031553]"
          >
            <option value="">Todos los cursos</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={selectedTrimestre}
            onChange={e => { setSelTrim(e.target.value); setSelectedWeek(''); }}
            disabled={!selectedCourse}
            className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553] bg-white cursor-pointer text-[#031553] disabled:opacity-50"
          >
            <option value="">Todos los trimestres</option>
            {Object.keys(weeksByTrimestre).map(t => (
              <option key={t} value={t}>{TRIMESTRE_LABEL[t]}</option>
            ))}
          </select>
          <select
            value={selectedWeek}
            onChange={e => setSelectedWeek(e.target.value)}
            disabled={!selectedCourse}
            className="border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#031553] bg-white cursor-pointer text-[#031553] disabled:opacity-50"
          >
            <option value="">Todas las semanas</option>
            {filteredWeeks.map(w => (
              <option key={w.id} value={w.id}>
                Sem. {w.numeroSemana} ({fmtDate(w.fechaInicio)} – {fmtDate(w.fechaFin)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-secondary">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando materiales...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-[#031553] text-sm">Sin materiales disponibles</h4>
          <p className="text-xs text-secondary max-w-xs">
            Tus docentes aún no han compartido materiales públicos.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                {/* File badge */}
                <div className="w-10 h-10 rounded-xl bg-[#031553] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                  {getFileExt(m.tipoArchivo)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#031553] truncate">{m.titulo}</p>
                  {m.descripcion && (
                    <p className="text-[10px] text-secondary mt-0.5 truncate">{m.descripcion}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[9px] font-bold text-[#031553] bg-primary/5 border border-[#031553]/10 px-1.5 py-0.5 rounded-lg">
                      {courseMap[m.courseId] || 'Curso'}
                    </span>
                    {m.weekDescripcion && (
                      <span className="text-[10px] text-secondary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {m.weekDescripcion}
                      </span>
                    )}
                    <span className="text-[10px] text-secondary">{formatBytes(m.tamanoBytes)}</span>
                  </div>
                </div>

                {/* Download */}
                <button
                  onClick={() => handleDownload(m)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-[#031553] hover:bg-primary/5 border border-[#031553]/10 px-3 py-1.5 rounded-xl cursor-pointer transition-all shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
