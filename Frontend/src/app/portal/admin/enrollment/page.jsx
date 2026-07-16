'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ArrowRight,
  FolderKanban,
  AlertCircle,
  Building2,
} from 'lucide-react';

const mockAdmissions = [
  {
    id: 101,
    applicantName: 'Sebastián Mendoza',
    applicantDni: '78899001',
    requestedGrade: '3ero de Primaria',
    guardianName: 'Martha Mendoza',
    guardianPhone: '+51944556677',
    applicationDate: '2026-06-28',
    status: 'PENDING',
    observations: 'Colegio de procedencia: San Agustín. Promedio excelente.',
  },
  {
    id: 102,
    applicantName: 'Valeria Castro',
    applicantDni: '79900112',
    requestedGrade: '1ero de Primaria',
    guardianName: 'Hugo Castro',
    guardianPhone: '+51922334455',
    applicationDate: '2026-06-29',
    status: 'APPROVED',
    observations: 'Documentación completa verificado.',
  },
  {
    id: 103,
    applicantName: 'Gabriel Poma',
    applicantDni: '70011223',
    requestedGrade: '5to de Primaria',
    guardianName: 'Rosa Poma',
    guardianPhone: '+51988776655',
    applicationDate: '2026-06-30',
    status: 'REJECTED',
    observations: 'Vacantes agotadas para 5to grado en este turno.',
  },
];

const mockEnrollments = [
  { id: 1, studentCode: 'EST-2026-0001', studentName: 'Roberto Gómez', grade: '3ero de Primaria A', condition: 'REGULAR', date: '2026-03-01' },
  { id: 2, studentCode: 'EST-2026-0002', studentName: 'Lucía Alva Mendoza', grade: '2do de Primaria B', condition: 'REGULAR', date: '2026-03-02' },
];

export default function EnrollmentPage() {
  const [activeTab, setActiveTab] = useState('admissions'); // 'admissions' | 'enrollment'
  const [admissions, setAdmissions] = useState(mockAdmissions);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [notification, setNotification] = useState(null);

  // New Enrollment Form State
  const [selectedStudent, setSelectedStudent] = useState('Sebastián Mendoza (DNI: 78899001)');
  const [targetSection, setTargetSection] = useState('3ero de Primaria A');
  const [condition, setCondition] = useState('REGULAR');

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setAdmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showNotice(`Solicitud #${id} actualizada a ${newStatus === 'APPROVED' ? 'APROBADA' : 'RECHAZADA'} en enrollment-service.`);
  };

  const handleEnrollStudent = (e) => {
    e.preventDefault();
    const newEnrollment = {
      id: Date.now(),
      studentCode: `EST-2026-000${enrollments.length + 1}`,
      studentName: selectedStudent.split('(')[0].trim(),
      grade: targetSection,
      condition: condition,
      date: new Date().toISOString().split('T')[0],
    };
    setEnrollments([newEnrollment, ...enrollments]);
    showNotice(`¡Matrícula confirmada! Alumno asignado a ${targetSection}.`);
  };

  return (
    <div className="w-full animate-fade-in pb-12 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031553] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <UserPlus className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Admisiones y Matrícula Escolar</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Módulo conectado al microservicio <code className="text-[#031553] font-bold">enrollment-service</code> (Puerto 8090).
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admissions'
                ? 'bg-[#031553] text-white shadow'
                : 'text-gray-500 hover:text-[#031553]'
            }`}
          >
            Solicitudes de Admisión
          </button>
          <button
            onClick={() => setActiveTab('enrollment')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'enrollment'
                ? 'bg-[#031553] text-white shadow'
                : 'text-gray-500 hover:text-[#031553]'
            }`}
          >
            Asignación y Matrícula
          </button>
        </div>
      </div>

      {/* TAB 1: ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {admissions.map((adm) => (
              <div
                key={adm.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Solicitud #{adm.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        adm.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : adm.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {adm.status === 'APPROVED' ? 'Aprobado' : adm.status === 'REJECTED' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[#031553] text-base">{adm.applicantName}</h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>DNI:</strong> {adm.applicantDni}</p>
                    <p><strong>Grado Solicitado:</strong> <span className="text-[#031553] font-semibold">{adm.requestedGrade}</span></p>
                    <p><strong>Apoderado:</strong> {adm.guardianName} ({adm.guardianPhone})</p>
                  </div>
                  <p className="text-[11px] text-gray-400 bg-gray-50 p-2 rounded-xl italic">&quot;{adm.observations}&quot;</p>
                </div>

                {adm.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => handleUpdateStatus(adm.id, 'APPROVED')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(adm.id, 'REJECTED')}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLMENT FORM & LIST */}
      {activeTab === 'enrollment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
            <h3 className="font-bold text-sm text-[#031553] flex items-center gap-2 border-b border-gray-50 pb-3">
              <Building2 className="w-4 h-4 text-[#031553]" /> Asignar Alumno a Sección (Matrícula)
            </h3>
            <form onSubmit={handleEnrollStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Postulante Aprobado</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-[#031553] outline-none focus:border-[#031553]"
                >
                  <option>Sebastián Mendoza (DNI: 78899001)</option>
                  <option>Valeria Castro (DNI: 79900112)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Sección de Destino</label>
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-[#031553] outline-none focus:border-[#031553]"
                >
                  <option>1ero de Primaria A</option>
                  <option>2do de Primaria A</option>
                  <option>3ero de Primaria A</option>
                  <option>3ero de Primaria B</option>
                  <option>4to de Primaria A</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Condición de Matrícula</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-[#031553] outline-none focus:border-[#031553]"
                >
                  <option value="REGULAR">REGULAR</option>
                  <option value="BECA_PARCIAL">BECA PARCIAL</option>
                  <option value="TRASLADO">TRASLADO EXTERNO</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#031553] hover:bg-[#020d36] text-white font-bold py-3 rounded-xl shadow transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                Confirmar Matrícula <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Enrolled List */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#031553]">Alumnos Matriculados Oficialmente (Año 2026)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Sección Asignada</th>
                    <th className="py-3 px-4">Condición</th>
                    <th className="py-3 px-4 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-500">{enr.studentCode}</td>
                      <td className="py-3.5 px-4 font-bold text-[#031553]">{enr.studentName}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-indigo-50 text-[#031553] font-bold px-2 py-1 rounded-md text-[11px]">
                          {enr.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-600">{enr.condition}</td>
                      <td className="py-3.5 px-4 text-right text-gray-400">{enr.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
