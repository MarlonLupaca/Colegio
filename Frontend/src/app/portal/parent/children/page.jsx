'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowLeft, 
  GraduationCap, 
  Calendar,
  Layers,
  Heart,
  Tag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch, cookies } from '@/config/api';

export default function ParentChildrenPage() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyChildren = async () => {
      const parentCode = cookies.get('userCode');
      if (!parentCode) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Obtener la lista de alumnos asociados al padre
        const linkages = await apiFetch(`/api/user/padre-alumno/padre/${parentCode}`).catch(() => []);
        
        // 2. Cruzar información de cada hijo
        const resolvedChildren = await Promise.all(
          linkages.map(async (link) => {
            try {
              // Obtener perfil detallado del estudiante del endpoint correcto
              const profile = await apiFetch(`/api/user/usuarios/${link.codigoAlumno}`);
              
              // Obtener matrícula activa en enrollment-service para saber su sección
              let classroomLabel = 'Sin matricular / Por asignar';
              let gradeLabel = 'Por asignar';

              if (profile && profile.id) {
                const activeEnrollment = await apiFetch(`/api/enrollment/enrollments/student/${profile.id}/active`).catch(() => null);
                if (activeEnrollment && activeEnrollment.sectionId) {
                  // Obtener detalles de la sección del section-service
                  const secDetails = await apiFetch(`/api/v1/sections/${activeEnrollment.sectionId}`).catch(() => null);
                  if (secDetails) {
                    classroomLabel = `${secDetails.gradeLevel}° "${secDetails.sectionName.toUpperCase()}"`;
                    gradeLabel = secDetails.educationLevel === 'primaria' ? 'Primaria' : 'Secundaria';
                  }
                }
              }

              return {
                id: link.id,
                codigo: link.codigoAlumno,
                parentesco: link.parentesco || 'HIJO(A)',
                nombres: profile ? profile.nombres : 'Estudiante',
                apellidos: profile ? profile.apellidos : 'Sauce Azul',
                dni: profile ? profile.dni : 'No registrado',
                email: profile ? profile.email : 'No registrado',
                aula: classroomLabel,
                nivel: gradeLabel
              };
            } catch (err) {
              console.warn(`No se pudo resolver datos para el hijo ${link.codigoAlumno}:`, err.message);
              return {
                id: link.id,
                codigo: link.codigoAlumno,
                parentesco: link.parentesco,
                nombres: 'Estudiante vinculado',
                apellidos: '',
                aula: 'No asignada',
                nivel: 'No asignado'
              };
            }
          })
        );

        setChildren(resolvedChildren);
      } catch (err) {
        console.error('Error cargando hijos:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyChildren();
  }, []);

  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in text-xs text-[#031553] text-left">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <button
            onClick={() => router.push('/portal/parent')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a Inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold">Mis Hijos</h1>
          </div>
          <p className="text-xs text-gray-400">
            Monitorea los datos generales, matrícula y estado de tus hijos inscritos en la institución educativa.
          </p>
        </div>
      </div>

      {/* Children Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Buscando vinculaciones familiares...</div>
      ) : children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white border border-gray-100/70 hover:border-indigo-100/80 rounded-3xl p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-full -z-10 group-hover:bg-indigo-50/50 transition-colors" />

              {/* Avatar and Info Header */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#031553] text-white font-extrabold flex items-center justify-center text-sm shadow-inner select-none">
                  {child.nombres.substring(0, 1) + child.apellidos.substring(0, 1)}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {child.parentesco}
                  </span>
                  <h4 className="font-bold text-sm text-[#031553] mt-1">
                    {child.nombres} {child.apellidos}
                  </h4>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-3.5 border-t border-slate-50 pt-4 text-secondary/80">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    Nombre Completo
                  </span>
                  <span className="font-bold text-[#031553] text-right max-w-[150px] truncate">
                    {child.nombres} {child.apellidos}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Código Alumno
                  </span>
                  <span className="font-bold text-primary font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                    {child.codigo}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" /> Nivel Académico
                  </span>
                  <span className="font-bold text-primary capitalize">
                    {child.nivel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Salón / Aula
                  </span>
                  <span className="font-bold text-[#031553] bg-indigo-50/40 px-2 py-0.5 rounded-md border border-indigo-100/10">
                    {child.aula}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    Correo Institucional
                  </span>
                  <span className="font-semibold text-primary truncate max-w-[150px] text-right" title={child.email}>
                    {child.email}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> DNI / Cédula
                  </span>
                  <span className="font-semibold text-primary">
                    {child.dni}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-3">
          <Heart className="w-12 h-12 text-rose-300 animate-pulse" />
          <h3 className="text-sm font-bold text-secondary">Sin vinculaciones familiares</h3>
          <p className="text-xs text-secondary/60">
            No se registran alumnos asignados a tu cuenta de apoderado. Contacte a la secretaría del colegio.
          </p>
        </div>
      )}

    </div>
  );
}
