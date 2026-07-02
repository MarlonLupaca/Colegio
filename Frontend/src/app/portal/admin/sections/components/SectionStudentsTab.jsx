// app/portal/admin/sections/components/SectionStudentsTab.jsx
'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Download,
  Printer,
  UserCheck,
  UserX,
  User
} from 'lucide-react';

export default function SectionStudentsTab({ section }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState([
    {
      id: '1',
      name: 'Ana María García Torres',
      email: 'ana.garcia@email.com',
      phone: '987654321',
      birthDate: '2014-05-15',
      status: 'ACTIVO',
      photo: null
    },
    {
      id: '2',
      name: 'Carlos Alberto Ruiz Pérez',
      email: 'carlos.ruiz@email.com',
      phone: '987654322',
      birthDate: '2014-08-22',
      status: 'ACTIVO',
      photo: null
    },
    {
      id: '3',
      name: 'Laura Sofía Mendoza Castro',
      email: 'laura.mendoza@email.com',
      phone: '987654323',
      birthDate: '2014-12-10',
      status: 'ACTIVO',
      photo: null
    },
    {
      id: '4',
      name: 'Jorge Luis Fernández Díaz',
      email: 'jorge.fernandez@email.com',
      phone: '987654324',
      birthDate: '2015-02-18',
      status: 'INACTIVO',
      photo: null
    }
  ]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = students.filter(s => s.status === 'ACTIVO').length;
  const inactiveCount = students.filter(s => s.status === 'INACTIVO').length;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-primary">
            Estudiantes Matriculados
          </h4>
          <p className="text-[10px] text-secondary/60 mt-0.5">
            {students.length} estudiantes en esta sección
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-all">
            <UserPlus className="w-3.5 h-3.5" />
            Matricular
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-secondary text-xs font-bold rounded-xl transition-all">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-secondary text-xs font-bold rounded-xl transition-all">
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center border border-blue-100/50">
          <p className="text-xl font-bold text-primary">{students.length}</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 text-center border border-emerald-100/50">
          <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Activos</p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-3 text-center border border-rose-100/50">
          <p className="text-xl font-bold text-rose-600">{inactiveCount}</p>
          <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Inactivos</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border border-gray-200 focus:border-primary/40 rounded-xl py-2 pl-9 pr-3 text-xs text-primary outline-none transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4 hidden md:table-cell">Email</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Teléfono</th>
                  <th className="py-3 px-4 hidden xl:table-cell">Fecha Nac.</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 px-4 text-secondary/60 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-primary truncate">{student.name}</p>
                          <p className="text-[9px] text-secondary/60 md:hidden">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-secondary/40" />
                        {student.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-secondary/40" />
                        {student.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell text-secondary/60">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-secondary/40" />
                        {new Date(student.birthDate).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                        student.status === 'ACTIVO'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-lg transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-secondary">No hay estudiantes</h4>
          <p className="text-xs text-secondary/60 mt-1">
            Esta sección aún no tiene estudiantes matriculados
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-secondary/60 border-t border-gray-100 pt-3">
        <span>Mostrando {filteredStudents.length} de {students.length} estudiantes</span>
        <span>Última actualización: hoy</span>
      </div>
    </div>
  );
}