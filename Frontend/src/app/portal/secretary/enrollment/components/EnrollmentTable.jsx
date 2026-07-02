'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EnrollmentTable({ enrollments, students, sections, onDeleteEnrollment }) {
  
  // Helper para buscar nombres
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.nombres} ${student.apellidos}` : `Estudiante (ID: ${studentId})`;
  };

  const getStudentCode = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.codigoUsuario : 'ALXXXXXX';
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(sec => sec.id.toString() === sectionId?.toString());
    return section ? (section.name || `${section.gradeLevel}° Grado - Sección ${section.sectionCode || 'A'}`) : `Aula (ID: ${sectionId})`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-[#031553]">
      <h2 className="text-sm font-bold border-b pb-3 border-gray-100">
        Estudiantes Matriculados en el Período
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-2.5 px-4">Estudiante / Código</th>
              <th className="py-2.5 px-4">Sección Asignada</th>
              <th className="py-2.5 px-4">Año Lectivo</th>
              <th className="py-2.5 px-4">Estado</th>
              <th className="py-2.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {enrollments.map((en) => (
              <tr key={en.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#031553]">{getStudentName(en.studentId)}</div>
                  <div className="text-[9px] text-gray-400 font-mono font-bold mt-0.5">{getStudentCode(en.studentId)}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-gray-600">
                  {getSectionName(en.sectionId)}
                </td>
                <td className="py-3 px-4 text-gray-500 font-medium">{en.academicYear}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    en.status === 'CONFIRMADA'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {en.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onDeleteEnrollment(en.id)}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center border border-rose-100"
                    title="Anular Matrícula"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No hay matrículas registradas en el período actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
