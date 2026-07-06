'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderTree } from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

import SectionTree from './components/SectionTree';
import SectionInfoTab from './components/SectionInfoTab';
import SectionCoursesTab from './components/SectionCoursesTab';
import SectionStudentsTab from './components/SectionStudentsTab';
import SectionScheduleTab from './components/SectionScheduleTab';
import NewSectionModal from './components/NewSectionModal';

const SECTIONS_ENDPOINT = '/api/v1/annual-sections';

export default function SectionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  const [rawSections, setRawSections] = useState([]);
  const [sectionsGrouped, setSectionsGrouped] = useState({});
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Datos para el modal de nueva sección
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  
  const buildGroupedTree = (flatList, teachersList = []) => {
    const tree = { primaria: {}, secundaria: {} };
    flatList.forEach((s) => {
      const level = s.educationLevel?.toLowerCase(); 
      if (!tree[level]) tree[level] = {};

      const sectionKey = `${s.gradeLevel}° ${s.sectionLetter}`;

      tree[level][sectionKey] = {
        id: s.id,
        level: s.educationLevel,
        grade: s.gradeLevel,
        section: s.sectionLetter,
        academicYear: s.academicYear,
        tutorTeacherId: s.tutorTeacherId,
        classroomId: s.classroom?.id,
        maxStudents: s.classroom?.maxCapacity || 30,
        room: s.classroom
          ? `${s.classroom.roomNumber} · ${s.classroom.building}`
          : 'Por asignar',
        classroomStatus: s.classroom?.status || 'DISPONIBLE',
        classroomType: s.classroom?.type || '',
        status: 'ACTIVE',
        tutor: (() => {
          if (!s.tutorTeacherId) return 'Sin asignar';
          const found = teachersList.find(
            (t) => String(t.id) === String(s.tutorTeacherId) || String(t.codigoUsuario) === String(s.tutorTeacherId)
          );
          return found ? `${found.nombres} ${found.apellidos}` : `ID: ${s.tutorTeacherId}`;
        })(),
      };
    });
    return tree;
  };


  const fetchSections = async (resolvedTeachers = teachers) => {
    setLoading(true);
    try {
      const data = await apiFetch(SECTIONS_ENDPOINT);
      setRawSections(data || []);
      setSectionsGrouped(buildGroupedTree(data || [], resolvedTeachers));
    } catch (err) {
      console.error('Error cargando secciones:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const init = async () => {
      let resolvedTeachers = [];
      try {
        const tData = await apiFetch('/api/user/usuarios/rol/DOCENTE');
        resolvedTeachers = tData || [];
        setTeachers(resolvedTeachers);
      } catch (err) {
        console.warn('No se pudieron cargar docentes al inicio:', err.message);
      }
      fetchSections(resolvedTeachers);
    };
    init();
  }, []);


  const openNewSectionModal = async () => {
    setIsModalOpen(true);

    if (teachers.length === 0) {
      setLoadingTeachers(true);
      try {
        const data = await apiFetch('/api/user/usuarios/rol/DOCENTE');
        setTeachers(data || []);
      } catch (err) {
        showToast('No se pudieron cargar los docentes.', 'error');
      } finally {
        setLoadingTeachers(false);
      }
    }

    if (classrooms.length === 0) {
      setLoadingClassrooms(true);
      try {
        const data = await apiFetch('/api/v1/classrooms');
        setClassrooms(data || []);
      } catch (err) {
        showToast('No se pudieron cargar las aulas.', 'error');
      } finally {
        setLoadingClassrooms(false);
      }
    }
  };

  const selectedSection = rawSections.find(s => s.id === selectedSectionId)
    ? {
        id: selectedSectionId,
        ...buildGroupedTree(rawSections.filter(s => s.id === selectedSectionId), teachers)[
          rawSections.find(s => s.id === selectedSectionId).educationLevel?.toLowerCase()
        ]?.[
          `${rawSections.find(s => s.id === selectedSectionId).gradeLevel}° ${rawSections.find(s => s.id === selectedSectionId).sectionLetter}`
        ]
      }
    : null;

  const handleSelectSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setActiveTab('info');
  };


  const handleNewSectionSubmit = async (payload) => {
    try {
      const result = await apiFetch(SECTIONS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast(`Sección ${result.gradeLevel}° ${result.sectionLetter} creada con éxito.`);
      fetchSections();
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Error al crear la sección.', 'error');
    }
  };

  const handleUpdateSection = async (id, updatedUIData) => {
    const isConfirmed = await askConfirmation({
      title: 'Actualizar Salón / Sección',
      message: '¿Está seguro de que desea guardar los cambios en esta aula?',
      confirmLabel: 'Guardar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      const payload = {
        academicYear: parseInt(updatedUIData.academicYear),
        tutorTeacherId: updatedUIData.tutorTeacherId ? parseInt(updatedUIData.tutorTeacherId) : null,
        educationLevel: updatedUIData.level?.toUpperCase(),
        gradeLevel: parseInt(updatedUIData.grade),
        sectionLetter: updatedUIData.section?.toUpperCase(),
        classroom: updatedUIData.classroomId ? { id: updatedUIData.classroomId } : null
      };

      await apiFetch(`${SECTIONS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      showToast('Sección actualizada correctamente.', 'success');
      let resolvedTeachers = teachers;
      try {
        const tData = await apiFetch('/api/user/usuarios/rol/DOCENTE');
        resolvedTeachers = tData || [];
        setTeachers(resolvedTeachers);
      } catch (err) {
        console.warn('No se pudieron recargar docentes:', err.message);
      }
      fetchSections(resolvedTeachers);
    } catch (err) {
      showToast(err.message || 'Error al actualizar sección.', 'error');
    }
  };

  const renderTabContent = () => {
    if (!selectedSection) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="p-6 bg-gray-50 rounded-full text-gray-300 mb-4">
            <FolderTree className="w-16 h-16" />
          </div>
          <h3 className="text-base font-bold text-secondary">Selecciona una sección</h3>
          <p className="text-sm text-secondary/60 mt-1 max-w-sm">
            Haz clic en cualquier sección del panel izquierdo para ver su información detallada
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'info':
        return <SectionInfoTab section={selectedSection} onUpdate={handleUpdateSection} />;
      case 'courses':
        return <SectionCoursesTab section={selectedSection} onUpdate={handleUpdateSection} />;
      case 'students':
        return <SectionStudentsTab section={selectedSection} />;
      case 'schedule':
        return <SectionScheduleTab section={selectedSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col pb-12 space-y-6 animate-fade-in text-xs text-[#031553]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/5 rounded-xl text-primary">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary tracking-tight">Gestión de Secciones</h2>
              <p className="text-xs text-secondary mt-0.5">Organiza las secciones académicas por año y nivel educativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
        {/* Left Side Tree */}
        <div className="lg:col-span-4 border-r border-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando aulas...</div>
          ) : (
            <SectionTree
              sections={sectionsGrouped}
              selectedSectionId={selectedSectionId}
              onSelectSection={handleSelectSection}
              onNewSection={openNewSectionModal}
            />
          )}
        </div>

        {/* Right Side Detail Tabs */}
        <div className="lg:col-span-8 p-6 flex flex-col h-full">
          {selectedSection && (
            <div className="flex border-b border-gray-100 mb-6">
              {[
                { id: 'info', label: 'Información Aula' },
                { id: 'students', label: 'Alumnos del Salón' },
                { id: 'courses', label: 'Cursos Asignados' },
                { id: 'schedule', label: 'Horario Escolar' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-3.5 font-bold border-b-2 text-xs transition-colors cursor-pointer ${
                    activeTab === t.id
                      ? 'border-[#031553] text-[#031553]'
                      : 'border-transparent text-gray-400 hover:text-[#031553]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 text-left">{renderTabContent()}</div>
        </div>
      </div>

      {/* Modal: Nueva Sección */}
      {isModalOpen && (
        <NewSectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewSectionSubmit}
          teachers={teachers}
          classrooms={classrooms}
          loadingTeachers={loadingTeachers}
          loadingClassrooms={loadingClassrooms}
        />
      )}
    </div>
  );
}