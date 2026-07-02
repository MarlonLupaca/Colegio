'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  UserCheck
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import AddStudentsModal from './AddStudentsModal';

export default function SectionStudentsTab({ section }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar estudiantes oficiales matriculados en esta sección
  const fetchStudents = async () => {
    if (!section?.id) return;
    setLoading(true);
    try {
      // 1. Obtener inscripciones de la sección
      const enrollments = await apiFetch(`/api/enrollment/enrollments/section/${section.id}`);
      
      // 2. Obtener todos los alumnos registrados
      const allUsers = await apiFetch('/api/user/usuarios');
      const filteredStudents = allUsers ? allUsers.filter(u => u.rol === 'ALUMNO') : [];

      // 3. Cruzar datos
      const studentsInSection = enrollments.map(en => {
        const studentInfo = filteredStudents.find(st => st.id === en.studentId);
        return {
          id: en.id,
          studentId: en.studentId,
          name: studentInfo ? `${studentInfo.nombres} ${studentInfo.apellidos}` : `Estudiante (ID: ${en.studentId})`,
          code: studentInfo ? studentInfo.codigoUsuario : 'ALXXXXXX',
          email: studentInfo?.email || 'No registrado',
          phone: studentInfo?.telefono || 'No registrado',
          status: en.status === 'CONFIRMADA' ? 'ACTIVO' : 'INACTIVO'
        };
      });

      setStudents(studentsInSection);
    } catch (err) {
      console.error('Error cargando estudiantes de la sección:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [section]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
          <Users className="w-12 h-12" />
        </div>
        <h3 className="text-sm font-bold text-secondary">Selecciona una sección</h3>
        <p className="text-xs text-secondary/60 mt-1">Haz clic en una sección del panel izquierdo</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-gray-100">
        <div>
          <h4 className="text-sm font-bold text-primary">
            Estudiantes Matriculados
          </h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {students.length} estudiantes en esta sección
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-[#031553] hover:bg-[#020d36] text-white text-[10px] font-bold py-2 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Inscribir Alumnos
        </button>
      </div>

      <AddStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionId={section.id}
        onSuccess={fetchStudents}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-100 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-primary placeholder-gray-400 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Students list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando lista de clase...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((s) => (
            <div key={s.id} className="bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-start gap-3 transition-all relative">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary font-bold flex items-center justify-center text-xs shrink-0 select-none">
                {s.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="pr-6">
                  <h5 className="font-bold text-xs text-primary truncate" title={s.name}>
                    {s.name}
                  </h5>
                  <span className="text-[9px] font-bold text-secondary font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    {s.code}
                  </span>
                </div>
                
                <div className="space-y-1 text-[10px] text-secondary/80">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`absolute top-4 right-4 flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                s.status === 'ACTIVO'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                <UserCheck className="w-2.5 h-2.5" />
                {s.status}
              </span>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-400">
              No hay estudiantes registrados en esta sección escolar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}