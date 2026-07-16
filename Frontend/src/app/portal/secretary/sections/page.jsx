'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  GraduationCap, 
  Calendar, 
  Users, 
  Building,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

import NewSectionModal from './components/NewSectionModal';
import SectionDetailModal from './components/SectionDetailModal';
import AddStudentsModal from './components/AddStudentsModal';
import AddCoursesModal from './components/AddCoursesModal';

const SECTIONS_ENDPOINT = '/api/v1/annual-sections';

export default function SectionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  const [rawSections, setRawSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false); // creation/editing modal
  const [editSection, setEditSection] = useState(null);
  const [detailSection, setDetailSection] = useState(null);
  const [studentSection, setStudentSection] = useState(null);
  const [courseSection, setCourseSection] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('todos');
  const [levelFilter, setLevelFilter] = useState('todos');

  // Ref to avoid infinite loops
  const teachersRef = useRef(teachers);
  useEffect(() => {
    teachersRef.current = teachers;
  }, [teachers]);

  const fetchSections = useCallback(async (resolvedTeachers) => {
    setLoading(true);
    try {
      const data = await apiFetch(SECTIONS_ENDPOINT);
      setRawSections(data || []);
    } catch (err) {
      console.error('Error cargando secciones:', err.message);
      showToast('No se pudieron cargar las secciones.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const data = await apiFetch('/api/user/usuarios/rol/DOCENTE');
      setTeachers(data || []);
    } catch (err) {
      console.warn('No se pudieron cargar docentes:', err.message);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadClassrooms = async () => {
    setLoadingClassrooms(true);
    try {
      const data = await apiFetch('/api/v1/classrooms');
      setClassrooms(data || []);
    } catch (err) {
      console.warn('No se pudieron cargar las aulas:', err.message);
    } finally {
      setLoadingClassrooms(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadTeachers();
      fetchSections();
    };
    init();
  }, [fetchSections]);

  const openNewSectionModal = async () => {
    setEditSection(null);
    setIsModalOpen(true);
    loadClassrooms();
  };

  const openEditSectionModal = async (section) => {
    setEditSection(section);
    setIsModalOpen(true);
    loadClassrooms();
  };

  const handleDeleteSection = async (section) => {
    const isConfirmed = await askConfirmation({
      title: 'ELIMINAR SECCIÓN',
      message: `¿Está seguro de que desea eliminar la sección "${section.gradeLevel}° ${section.sectionLetter}" del año académico ${section.academicYear}? Esto retirará permanentemente todas sus asignaciones de alumnos e historial de horario.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`${SECTIONS_ENDPOINT}/${section.id}`, {
        method: 'DELETE'
      });
      showToast('Sección eliminada correctamente.', 'success');
      fetchSections();
    } catch (err) {
      showToast(err.message || 'Error al eliminar la sección.', 'error');
    }
  };

  const handleSectionSubmit = async (payload) => {
    try {
      if (editSection) {
        await apiFetch(`${SECTIONS_ENDPOINT}/${editSection.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Sección actualizada con éxito.', 'success');
      } else {
        const result = await apiFetch(SECTIONS_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(`Sección ${result.gradeLevel}° ${result.sectionLetter} creada con éxito.`, 'success');
      }
      fetchSections();
      setIsModalOpen(false);
      setEditSection(null);
    } catch (err) {
      showToast(err.message || 'Error al guardar la sección.', 'error');
    }
  };

  const getTutorName = (tutorCode) => {
    if (!tutorCode) return 'Sin asignar';
    const found = teachers.find(t => t.codigoUsuario === tutorCode);
    return found ? `${found.nombres} ${found.apellidos}` : tutorCode;
  };

  const getLevelLabel = (level) => {
    return level?.toUpperCase() === 'PRIMARIA' ? 'Primaria' : 'Secundaria';
  };

  // Get dynamic academic years for filters
  const academicYears = Array.from(new Set(rawSections.map(s => s.academicYear))).sort((a, b) => b - a);

  // Filter sections
  const filteredSections = rawSections.filter(s => {
    const tutorName = getTutorName(s.tutorCode).toLowerCase();
    const matchesSearch = 
      s.educationLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${s.gradeLevel}° ${s.sectionLetter}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorName.includes(searchTerm.toLowerCase()) ||
      (s.classroom?.roomNumber && String(s.classroom.roomNumber).includes(searchTerm)) ||
      (s.id && String(s.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.code && String(s.code).toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesYear = academicYearFilter === 'todos' || String(s.academicYear) === academicYearFilter;
    const matchesLevel = levelFilter === 'todos' || s.educationLevel?.toUpperCase() === levelFilter.toUpperCase();

    return matchesSearch && matchesYear && matchesLevel;
  });

  return (
    <div className="w-full flex flex-col pb-12 space-y-6 animate-fade-in text-xs text-[#031553]">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <Users className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#031553]">Secciones y Aulas</h1>
              <p className="text-xs text-secondary mt-0.5">Administra las secciones del plantel, inscribe estudiantes y gestiona sus horarios.</p>
            </div>
          </div>
        </div>
        <button
          onClick={openNewSectionModal}
          className="flex items-center gap-2 bg-[#031553] hover:bg-[#020d36] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Crear Sección
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por grado, tutor, aula o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#031553] text-[#031553]"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-[#031553] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#031553] cursor-pointer"
          >
            <option value="todos">Todos los Niveles</option>
            <option value="PRIMARIA">Primaria</option>
            <option value="SECUNDARIA">Secundaria</option>
          </select>

          {/* Academic Year Filter */}
          <select
            value={academicYearFilter}
            onChange={(e) => setAcademicYearFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-[#031553] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#031553] cursor-pointer"
          >
            <option value="todos">Todos los Años</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections Table List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando secciones...</div>
        ) : filteredSections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Sección / Grado</th>
                  <th className="py-3.5 px-6">Nivel</th>
                  <th className="py-3.5 px-6">Profesor Tutor</th>
                  <th className="py-3.5 px-6">Aula asignada</th>
                  <th className="py-3.5 px-6">Año</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredSections.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#031553] text-sm">
                      {s.gradeLevel}° &quot;{s.sectionLetter}&quot;
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize font-bold text-gray-600 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {getLevelLabel(s.educationLevel)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-semibold">
                      {getTutorName(s.tutorCode)}
                    </td>
                    <td className="py-4 px-6">
                      {s.classroom ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600">
                          <Building className="w-3 h-3 text-gray-400" /> Aula {s.classroom.roomNumber} ({s.classroom.building})
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No asignada</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-600">
                      {s.academicYear}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => setStudentSection(s)}
                          className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-2 py-1.5 rounded-xl transition-all cursor-pointer border border-emerald-100 font-semibold flex items-center gap-1"
                          title="Inscribir alumnos"
                        >
                          <UserCheck className="w-3 h-3" /> Alumnos
                        </button>
                        <button
                          onClick={() => setCourseSection(s)}
                          className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-2 py-1.5 rounded-xl transition-all cursor-pointer border border-indigo-100 font-semibold flex items-center gap-1"
                          title="Asignar materias"
                        >
                          <BookOpen className="w-3 h-3" /> Cursos
                        </button>
                        <button
                          onClick={() => setDetailSection({
                            id: s.id,
                            grade: s.gradeLevel,
                            section: s.sectionLetter,
                            level: s.educationLevel,
                            year: s.academicYear,
                            tutorCode: s.tutorCode,
                            academicYear: s.academicYear,
                            maxWeeklyHours: s.maxWeeklyHours || 30,
                            room: s.classroom ? `${s.classroom.roomNumber} · ${s.classroom.building}` : null
                          })}
                          className="bg-slate-100 hover:bg-slate-700 text-[#031553] hover:text-white p-2 rounded-xl transition-all cursor-pointer border border-gray-200"
                          title="Ver Horario / Detalle"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditSectionModal(s)}
                          className="bg-gray-100 hover:bg-[#031553] hover:text-white text-[#031553] p-2 rounded-xl transition-all cursor-pointer border border-gray-200/40"
                          title="Editar sección"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(s)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-xl transition-all cursor-pointer border border-rose-100"
                          title="Eliminar sección"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 rounded-full text-secondary/40">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary text-sm">No se encontraron secciones</h4>
            <p className="text-xs text-secondary max-w-xs">
              No hay secciones registradas para el año académico y nivel educativo seleccionados.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Crear / Editar Sección */}
      {isModalOpen && (
        <NewSectionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditSection(null);
          }}
          editSection={editSection}
          onSubmit={handleSectionSubmit}
          teachers={teachers}
          classrooms={classrooms}
          loadingTeachers={loadingTeachers}
          loadingClassrooms={loadingClassrooms}
        />
      )}

      {/* Modal: Detalle (Horario, Cursos, Alumnos) */}
      {detailSection && (
        <SectionDetailModal
          isOpen={!!detailSection}
          onClose={() => setDetailSection(null)}
          section={detailSection}
        />
      )}

      {/* Modal: Asignar Alumnos */}
      {studentSection && (
        <AddStudentsModal
          isOpen={!!studentSection}
          onClose={() => setStudentSection(null)}
          sectionId={studentSection.id}
          onSuccess={() => fetchSections()}
        />
      )}

      {/* Modal: Asignar Cursos */}
      {courseSection && (
        <AddCoursesModal
          isOpen={!!courseSection}
          onClose={() => setCourseSection(null)}
          sectionId={courseSection.id}
          educationLevel={courseSection.educationLevel}
          gradeLevel={courseSection.gradeLevel}
          onSuccess={() => fetchSections()}
        />
      )}
    </div>
  );
}