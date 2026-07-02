'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Save,
  Plus,
  FileSpreadsheet,
  AlertCircle,
  MessageSquare,
  X,
  BookOpen,
} from 'lucide-react';

const mockExams = [
  { id: 1, title: 'Examen Parcial - Álgebra Lineal', course: 'Matemáticas', maxScore: 20, weight: '30%' },
  { id: 2, title: 'Práctica Calificada 1 - Fracciones', course: 'Matemáticas', maxScore: 20, weight: '20%' },
  { id: 3, title: 'Examen Bimestral Final', course: 'Matemáticas', maxScore: 20, weight: '50%' },
];

const initialRoster = [
  { id: 1, studentCode: 'EST-2026-0001', name: 'Roberto Gómez', score: 18.5, comment: 'Excelente dominio del tema.' },
  { id: 2, studentCode: 'EST-2026-0002', name: 'Lucía Alva Mendoza', score: 16.0, comment: 'Muy buen trabajo, resolver con más orden.' },
  { id: 3, studentCode: 'EST-2026-0003', name: 'Mateo Sandoval Quispe', score: 13.5, comment: 'Debe practicar ecuaciones algebraicas.' },
  { id: 4, studentCode: 'EST-2026-0004', name: 'Mariana Silva', score: 19.0, comment: 'Puntaje sobresaliente.' },
  { id: 5, studentCode: 'EST-2026-0005', name: 'Diego Benavides', score: 10.5, comment: 'Requiere nivelación urgente.' },
];

export default function GradingPage() {
  const [exams, setExams] = useState(mockExams);
  const [selectedExamId, setSelectedExamId] = useState(1);
  const [students, setStudents] = useState(initialRoster);
  const [notification, setNotification] = useState(null);
  const [isNewExamOpen, setIsNewExamOpen] = useState(false);

  // New Exam Form
  const [newExam, setNewExam] = useState({
    title: '',
    course: 'Matemáticas',
    maxScore: 20,
    weight: '25%',
  });

  const selectedExam = exams.find((e) => e.id === Number(selectedExamId));

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleScoreChange = (id, val) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score: Number(val) } : s))
    );
  };

  const handleCommentChange = (id, val) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, comment: val } : s))
    );
  };

  const handleSaveGrades = () => {
    showNotice(`¡Calificaciones del examen "${selectedExam?.title}" publicadas en grading-service en lote!`);
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    const created = { ...newExam, id: Date.now() };
    setExams([created, ...exams]);
    setSelectedExamId(created.id);
    setIsNewExamOpen(false);
    showNotice(`Evaluación "${created.title}" programada en exam-service.`);
  };

  const classAverage = (students.reduce((acc, curr) => acc + curr.score, 0) / students.length).toFixed(1);

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031553] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Registro de Evaluaciones y Calificaciones</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Conectado a <code className="text-[#031553] font-bold">exam-service</code> (8091) y <code className="text-[#031553] font-bold">grading-service</code> (8092).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewExamOpen(true)}
            className="flex items-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Programar Evaluación
          </button>
        </div>
      </div>

      {/* Selector and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Seleccionar Evaluación (exam-service)</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#031553] text-sm outline-none focus:border-[#031553]"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.course} - Peso: {ex.weight})
                </option>
              ))}
            </select>
          </div>
          {selectedExam && (
            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 block">Puntaje Máximo</span>
                <span className="font-extrabold text-[#031553] text-sm">{selectedExam.maxScore} pts</span>
              </div>
              <div className="border-l border-indigo-200 pl-4">
                <span className="text-[10px] font-bold text-indigo-700 block">Peso Porcentual</span>
                <span className="font-extrabold text-[#031553] text-sm">{selectedExam.weight}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#031553] text-white rounded-2xl p-5 shadow-md flex flex-col justify-center items-center text-center">
          <span className="text-[11px] font-bold uppercase text-indigo-200">Promedio del Salón</span>
          <div className="text-3xl font-black mt-1 text-emerald-400">{classAverage}</div>
          <span className="text-[10px] text-white/70 mt-1">Escala vigesimal (0-20)</span>
        </div>
      </div>

      {/* Grading Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#031553] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#031553]" /> Ingresar Notas por Alumno
          </h3>
          <span className="text-xs text-gray-400 font-semibold">Alumnos listados: {students.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                <th className="py-3.5 px-6">Código / Estudiante</th>
                <th className="py-3.5 px-6 w-36">Nota (0 - 20)</th>
                <th className="py-3.5 px-6">Comentario del Profesor (Realimentación)</th>
                <th className="py-3.5 px-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#031553] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-[#031553] text-sm">{s.name}</div>
                        <div className="text-[10px] text-gray-400 font-semibold">{s.studentCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={s.score}
                      onChange={(e) => handleScoreChange(s.id, e.target.value)}
                      className="w-24 p-2 bg-gray-50 border border-gray-200 rounded-xl font-extrabold text-base text-[#031553] text-center outline-none focus:border-[#031553]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Agregar comentario al alumno..."
                        value={s.comment}
                        onChange={(e) => handleCommentChange(s.id, e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#031553] text-[#031553]"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold">
                    {s.score >= 11 ? (
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[11px]">Aprobado</span>
                    ) : (
                      <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-[11px]">En Riesgo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSaveGrades}
            className="bg-[#031553] hover:bg-[#020d36] text-white font-bold px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" /> Publicar Calificaciones en Lote (GradeBatchDTO)
          </button>
        </div>
      </div>

      {/* New Exam Modal */}
      {isNewExamOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateExam} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-fade-in">
            <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Programar Nueva Evaluación (exam-service)</h3>
              <button type="button" onClick={() => setIsNewExamOpen(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Título de la Evaluación</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Práctica Calificada 2"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Curso</label>
                  <input
                    disabled
                    type="text"
                    value={newExam.course}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Peso %</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. 25%"
                    value={newExam.weight}
                    onChange={(e) => setNewExam({ ...newExam, weight: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewExamOpen(false)}
                className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#031553] text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-[#020d36] cursor-pointer"
              >
                Crear Evaluación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
