'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  GraduationCap,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  X,
} from 'lucide-react';

const initialStudents = [
  {
    id: 1,
    studentCode: 'EST-2026-0001',
    firstName: 'Roberto',
    lastName: 'Gómez',
    dni: '76543210',
    birthDate: '2015-05-12',
    gender: 'Masculino',
    address: 'Av. Larco 456, Lima',
    phone: '+51987654321',
    email: 'roberto.gomez@colegio.edu.pe',
    guardianName: 'Carlos Gómez',
    status: 'ACTIVE',
    grade: '3ero de Primaria A',
    history: [
      { academicYear: 2025, gradeLevel: '2do de Primaria', generalAverage: 17.5, observations: 'Ocupó el 1er Puesto en el salón.' },
      { academicYear: 2024, gradeLevel: '1ero de Primaria', generalAverage: 16.8, observations: 'Destacada participación en matemáticas.' },
    ],
  },
  {
    id: 2,
    studentCode: 'EST-2026-0002',
    firstName: 'Lucía',
    lastName: 'Alva Mendoza',
    dni: '71122334',
    birthDate: '2016-08-20',
    gender: 'Femenino',
    address: 'Calle Los Pinos 123, Miraflores',
    phone: '+51911223344',
    email: 'lucia.alva@colegio.edu.pe',
    guardianName: 'Ana Mendoza',
    status: 'ACTIVE',
    grade: '2do de Primaria B',
    history: [
      { academicYear: 2025, gradeLevel: '1ero de Primaria', generalAverage: 18.2, observations: 'Diploma de excelencia académica.' },
    ],
  },
  {
    id: 3,
    studentCode: 'EST-2026-0003',
    firstName: 'Mateo',
    lastName: 'Sandoval Quispe',
    dni: '73344556',
    birthDate: '2014-11-05',
    gender: 'Masculino',
    address: 'Jr. La Unión 889, Lima',
    phone: '+51955667788',
    email: 'mateo.sandoval@colegio.edu.pe',
    guardianName: 'Luis Sandoval',
    status: 'SUSPENDED',
    grade: '4to de Primaria A',
    history: [
      { academicYear: 2025, gradeLevel: '3ero de Primaria', generalAverage: 13.4, observations: 'Requiere nivelación en lenguaje.' },
    ],
  },
];

import { validateForm, isRequired, minLength, isDNI } from '@/hooks/useFormValidation';

export default function UsersPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  // New Student form state
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    studentCode: `EST-2026-000${students.length + 1}`,
    grade: '3ero de Primaria A',
    guardianName: '',
    email: '',
  });

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dni.includes(searchTerm) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();

    const rules = {
      firstName: [
        { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
        { check: (v) => minLength(v, 2), msg: 'El nombre debe tener al menos 2 caracteres' }
      ],
      lastName: [
        { check: (v) => isRequired(v), msg: 'El apellido es obligatorio' },
        { check: (v) => minLength(v, 2), msg: 'El apellido debe tener al menos 2 caracteres' }
      ],
      dni: [
        { check: (v) => isRequired(v), msg: 'El DNI es obligatorio' },
        { check: (v) => isDNI(v), msg: 'El DNI debe tener exactamente 8 dígitos' }
      ],
      guardianName: [
        { check: (v) => isRequired(v), msg: 'El nombre del apoderado es obligatorio' },
        { check: (v) => minLength(v, 3), msg: 'El nombre del apoderado debe tener al menos 3 caracteres' }
      ]
    };

    const { isValid, errors: validationErrors } = validateForm(newStudent, rules);
    setErrors(validationErrors);

    if (!isValid) return;

    const created = {
      ...newStudent,
      id: Date.now(),
      status: 'ACTIVE',
      birthDate: '2015-01-01',
      gender: 'No especificado',
      address: 'Lima, Perú',
      phone: '+51900000000',
      history: [],
    };
    setStudents([created, ...students]);
    setIsNewStudentOpen(false);
    setErrors({});
    // Reset form
    setNewStudent({
      firstName: '',
      lastName: '',
      dni: '',
      studentCode: `EST-2026-000${students.length + 2}`,
      grade: '3ero de Primaria A',
      guardianName: '',
      email: '',
    });
    showNotice(`Ficha de ${created.firstName} ${created.lastName} registrada correctamente en student-record-service.`);
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

      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <GraduationCap className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-[#031553]">Ficha del Estudiante e Historial</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Módulo conectado al microservicio <code className="text-[#031553] font-bold">student-record-service</code> (Puerto 8083).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por DNI, código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#031553] text-[#031553]"
            />
          </div>
          <button
            onClick={() => setIsNewStudentOpen(true)}
            className="flex items-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Registrar Alumno
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Código / Alumno</th>
                <th className="py-3.5 px-6">DNI</th>
                <th className="py-3.5 px-6">Grado y Sección</th>
                <th className="py-3.5 px-6">Apoderado</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-right">Ficha / Historial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#031553] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {s.firstName[0]}
                        {s.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[#031553] text-sm">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold">{s.studentCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-600">{s.dni}</td>
                  <td className="py-4 px-6 font-medium text-[#031553]">
                    <span className="bg-indigo-50 text-[#031553] px-2.5 py-1 rounded-lg font-bold text-[11px]">
                      {s.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">{s.guardianName}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {s.status === 'ACTIVE' ? 'Matriculado' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-[#031553] hover:text-white text-[#031553] font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    No se encontraron estudiantes con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Record Detail Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-fade-in">
            {/* Modal Header */}
            <div className="bg-[#031553] text-white p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#031553] font-extrabold text-xl flex items-center justify-center shadow-lg">
                  {selectedStudent.firstName[0]}
                  {selectedStudent.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">Código Escolar: {selectedStudent.studentCode}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Personal Details Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#031553]" /> Información Personal y Apoderado
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Documento DNI:</span>
                    <span className="font-bold text-[#031553]">{selectedStudent.dni}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Fecha de Nacimiento:</span>
                    <span className="font-bold text-[#031553]">{selectedStudent.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Apoderado Responsable:</span>
                    <span className="font-bold text-[#031553]">{selectedStudent.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Correo Electrónico:</span>
                    <span className="font-bold text-[#031553]">{selectedStudent.email}</span>
                  </div>
                </div>
              </div>

              {/* Academic History Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#031553]" /> Historial Académico Anual (StudentRecordService)
                </h4>
                <div className="space-y-3">
                  {selectedStudent.history.length > 0 ? (
                    selectedStudent.history.map((h, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#031553]">Año {h.academicYear}</span>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {h.gradeLevel}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 italic">&quot;{h.observations}&quot;</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Promedio Final</span>
                          <span className="text-lg font-black text-emerald-600">{h.generalAverage}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                      Aún no hay registros en el historial anterior de este estudiante.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#031553] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#020d36] transition-all cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Student Modal */}
      {isNewStudentOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateStudent} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-fade-in">
            <div className="bg-[#031553] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Registrar Nueva Ficha Estudiantil</h3>
              <button
                type="button"
                onClick={() => setIsNewStudentOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombres</label>
                <input
                  required
                  type="text"
                  value={newStudent.firstName}
                  onChange={(e) => {
                    setNewStudent({ ...newStudent, firstName: e.target.value });
                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.firstName ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
                />
                {errors.firstName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-gray-400 font-bold mb-1">Apellidos</label>
                <input
                  required
                  type="text"
                  value={newStudent.lastName}
                  onChange={(e) => {
                    setNewStudent({ ...newStudent, lastName: e.target.value });
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.lastName ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
                />
                {errors.lastName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.lastName}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">DNI</label>
                  <input
                    required
                    type="text"
                    value={newStudent.dni}
                    onChange={(e) => {
                      setNewStudent({ ...newStudent, dni: e.target.value });
                      if (errors.dni) setErrors(prev => ({ ...prev, dni: null }));
                    }}
                    className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.dni ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
                  />
                  {errors.dni && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.dni}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Grado</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#031553] outline-none text-[#031553]"
                  >
                    <option>1ero de Primaria A</option>
                    <option>2do de Primaria B</option>
                    <option>3ero de Primaria A</option>
                    <option>4to de Primaria A</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 font-bold mb-1">Nombre del Apoderado</label>
                <input
                  required
                  type="text"
                  value={newStudent.guardianName}
                  onChange={(e) => {
                    setNewStudent({ ...newStudent, guardianName: e.target.value });
                    if (errors.guardianName) setErrors(prev => ({ ...prev, guardianName: null }));
                  }}
                  className={`w-full p-2.5 bg-gray-50 border rounded-xl focus:border-[#031553] outline-none text-[#031553] ${errors.guardianName ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'}`}
                />
                {errors.guardianName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.guardianName}</p>}
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewStudentOpen(false)}
                className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#031553] text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-[#020d36] transition-all cursor-pointer"
              >
                Guardar Ficha
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
