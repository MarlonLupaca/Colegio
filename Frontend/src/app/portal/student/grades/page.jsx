'use client';

import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Filter,
  Calendar,
} from 'lucide-react';

const studentCourses = [
  {
    id: 101,
    name: 'Matemáticas / Álgebra Lineal',
    teacher: 'Prof. Mary Johnson',
    period: 'BIMESTER_2',
    average: 17.5,
    status: 'APPROVED',
    grades: [
      { id: 1, examTitle: 'Práctica Calificada 1', score: 16.5, date: '2026-05-15', weight: '20%', comment: 'Buen procedimiento en ecuaciones.' },
      { id: 2, examTitle: 'Examen Parcial de Álgebra', score: 18.5, date: '2026-06-10', weight: '30%', comment: '¡Excelente examen! Puntaje perfecto en resolución de problemas.' },
      { id: 3, examTitle: 'Proyecto Grupal de Matemáticas', score: 17.0, date: '2026-06-24', weight: '50%', comment: 'Destacada participación grupal.' },
    ],
  },
  {
    id: 102,
    name: 'Comunicación y Literatura',
    teacher: 'Prof. Carlos Rivera',
    period: 'BIMESTER_2',
    average: 15.8,
    status: 'APPROVED',
    grades: [
      { id: 4, examTitle: 'Control de Lectura - Cien Años de Soledad', score: 15.0, date: '2026-05-18', weight: '40%', comment: 'Correcta comprensión lectora.' },
      { id: 5, examTitle: 'Ensayo Literario', score: 16.5, date: '2026-06-12', weight: '60%', comment: 'Buena redacción y riqueza de vocabulario.' },
    ],
  },
  {
    id: 103,
    name: 'Ciencias Naturales y Biología',
    teacher: 'Prof. Elena Salazar',
    period: 'BIMESTER_2',
    average: 14.0,
    status: 'APPROVED',
    grades: [
      { id: 6, examTitle: 'Informe de Laboratorio celular', score: 14.0, date: '2026-05-22', weight: '100%', comment: 'Cumple con los requisitos mínimos solicitados.' },
    ],
  },
];

export default function StudentGradesPage() {
  const [period, setPeriod] = useState('BIMESTER_2');
  const [courses] = useState(studentCourses);

  const totalAverage = (courses.reduce((acc, curr) => acc + curr.average, 0) / courses.length).toFixed(1);

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <Award className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Mi Libreta de Calificaciones Digital</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Conectado al microservicio <code className="text-[#031553] font-bold">grading-service</code> (Puerto 8092) • Alumno: <strong className="text-gray-600">Roberto Gómez</strong>
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 text-xs">
          <Calendar className="w-4 h-4 text-gray-400 ml-2" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent font-bold text-[#031553] outline-none pr-3 py-1 cursor-pointer"
          >
            <option value="BIMESTER_1">1er Bimestre</option>
            <option value="BIMESTER_2">2do Bimestre (Actual)</option>
            <option value="BIMESTER_3">3er Bimestre</option>
            <option value="FINAL">Promedio Anual Final</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#031553] text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">Promedio General Acumulado</span>
            <div className="text-4xl font-black mt-1 text-emerald-400">{totalAverage}</div>
            <span className="text-[11px] text-white/70 mt-1 block">Rendimiento Sobresaliente</span>
          </div>
          <TrendingUp className="w-12 h-12 text-white/20" />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Cursos Aprobados</span>
            <div className="text-3xl font-black mt-1 text-emerald-600">{courses.filter((c) => c.status === 'APPROVED').length} de {courses.length}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Ningún curso en riesgo</span>
          </div>
          <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Evaluaciones Rendidas</span>
            <div className="text-3xl font-black mt-1 text-[#031553]">{courses.reduce((acc, c) => acc + c.grades.length, 0)}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Registros sincronizados</span>
          </div>
          <BookOpen className="w-12 h-12 text-[#031553]/15" />
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Course Header */}
            <div className="p-5 bg-gray-50/75 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#031553] text-white flex items-center justify-center font-bold text-sm">
                  {course.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#031553] text-base">{course.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{course.teacher}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Promedio del Curso</span>
                  <span className="text-2xl font-black text-emerald-600">{course.average.toFixed(1)}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> APROBADO
                </span>
              </div>
            </div>

            {/* Grades Table */}
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase">
                    <th className="py-2.5 px-4">Evaluación</th>
                    <th className="py-2.5 px-4">Fecha</th>
                    <th className="py-2.5 px-4">Peso %</th>
                    <th className="py-2.5 px-4">Nota</th>
                    <th className="py-2.5 px-4">Comentarios y Realimentación del Docente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {course.grades.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-[#031553]">{g.examTitle}</td>
                      <td className="py-3.5 px-4 text-gray-500">{g.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-gray-100 text-[#031553] font-bold px-2 py-0.5 rounded text-[10px]">
                          {g.weight}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-base text-emerald-600">{g.score.toFixed(1)}</td>
                      <td className="py-3.5 px-4 text-gray-600 italic">
                        <div className="flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span>"{g.comment}"</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
