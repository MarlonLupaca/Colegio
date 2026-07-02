'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
  Users,
  AlertCircle,
} from 'lucide-react';

const rosterStudents = [
  { id: 1, studentCode: 'EST-2026-0001', name: 'Roberto Gómez', status: 'PRESENT', obs: '' },
  { id: 2, studentCode: 'EST-2026-0002', name: 'Lucía Alva Mendoza', status: 'PRESENT', obs: '' },
  { id: 3, studentCode: 'EST-2026-0003', name: 'Mateo Sandoval Quispe', status: 'LATE', obs: 'Demora por tráfico' },
  { id: 4, studentCode: 'EST-2026-0004', name: 'Mariana Silva', status: 'PRESENT', obs: '' },
  { id: 5, studentCode: 'EST-2026-0005', name: 'Diego Benavides', status: 'ABSENT', obs: 'Sin justificación' },
];

export default function AttendancePage() {
  const [section, setSection] = useState('3ero de Primaria A');
  const [course, setCourse] = useState('Matemáticas / Álgebra');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState(rosterStudents);
  const [notification, setNotification] = useState(null);

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleObsChange = (id, newObs) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, obs: newObs } : s))
    );
  };

  const handleMarkAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSaveBatch = () => {
    showNotice(`¡Asistencia del salón ${section} guardada exitosamente en attendance-service en lote!`);
  };

  // Stats
  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const lateCount = students.filter((s) => s.status === 'LATE').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031553] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner & Selectors */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <CalendarCheck className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Toma Rápida de Asistencia por Aula</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Módulo en lote conectado al microservicio <code className="text-[#031553] font-bold">attendance-service</code> (Puerto 8084).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 font-bold mb-1">Sección</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#031553] outline-none"
            >
              <option>3ero de Primaria A</option>
              <option>4to de Primaria A</option>
              <option>5to de Primaria B</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 font-bold mb-1">Curso</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#031553] outline-none"
            >
              <option>Matemáticas / Álgebra</option>
              <option>Comunicación</option>
              <option>Ciencias Naturales</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 font-bold mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#031553] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Presentes</span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">{presentCount}</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase">Tardanzas</span>
            <div className="text-2xl font-black text-amber-800 mt-0.5">{lateCount}</div>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase">Faltas</span>
            <div className="text-2xl font-black text-rose-800 mt-0.5">{absentCount}</div>
          </div>
          <XCircle className="w-8 h-8 text-rose-500 opacity-80" />
        </div>
      </div>

      {/* Roster List Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h3 className="font-bold text-sm text-[#031553] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#031553]" /> Lista de Alumnos ({students.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll('PRESENT')}
              className="text-[11px] bg-gray-100 hover:bg-emerald-600 hover:text-white font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Marcar todos Presente
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {students.map((s, idx) => (
            <div key={s.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-gray-400">#{idx + 1}</span>
                <div className="w-9 h-9 rounded-full bg-[#031553] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {s.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-[#031553] text-sm">{s.name}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{s.studentCode}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Status Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, 'PRESENT')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      s.status === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-gray-500 hover:text-emerald-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Presente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, 'LATE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      s.status === 'LATE'
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-gray-500 hover:text-amber-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Tardanza
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, 'ABSENT')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      s.status === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-gray-500 hover:text-rose-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Falta
                  </button>
                </div>

                {/* Observation Input */}
                <input
                  type="text"
                  placeholder="Observación opcional..."
                  value={s.obs}
                  onChange={(e) => handleObsChange(s.id, e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-44 outline-none focus:border-[#031553] text-[#031553]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Bottom */}
        <div className="pt-4 border-t border-gray-50 flex justify-end">
          <button
            onClick={handleSaveBatch}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" /> Guardar Asistencia del Salón en Lote
          </button>
        </div>
      </div>
    </div>
  );
}
