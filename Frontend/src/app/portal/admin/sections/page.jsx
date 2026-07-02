// app/portal/admin/sections/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderTree, Clock } from 'lucide-react';

import { initialSections, availableYears } from './data';
import SectionTree from './components/SectionTree';
import SectionInfoTab from './components/SectionInfoTab';
import SectionCoursesTab from './components/SectionCoursesTab';
import SectionStudentsTab from './components/SectionStudentsTab';
import SectionScheduleTab from './components/SectionScheduleTab'; // ✅ NUEVO
import NewSectionModal from './components/NewSectionModal';

export default function SectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedSection = Object.values(sections).reduce((found, year) => {
    if (found) return found;
    return Object.values(year).reduce((found2, level) => {
      if (found2) return found2;
      return Object.values(level).find(s => s.id === selectedSectionId) || null;
    }, null);
  }, null);

  const handleSelectSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setActiveTab('info');
  };

  const handleUpdateSection = (id, updatedData) => {
    setSections(prev => {
      const newSections = { ...prev };
      for (const yearKey in newSections) {
        for (const levelKey in newSections[yearKey]) {
          for (const sectionKey in newSections[yearKey][levelKey]) {
            if (newSections[yearKey][levelKey][sectionKey].id === id) {
              newSections[yearKey][levelKey][sectionKey] = updatedData;
              return newSections;
            }
          }
        }
      }
      return newSections;
    });
  };

  const handleNewSection = (newSection) => {
    setSections(prev => {
      const year = newSection.year.toString();
      const level = newSection.level;
      
      if (!prev[year]) prev[year] = {};
      if (!prev[year][level]) prev[year][level] = {};
      
      const sectionKey = `${newSection.grade}° ${newSection.section}`;
      prev[year][level][sectionKey] = newSection;
      
      return { ...prev };
    });
  };

  const handleCopyStructure = () => {
    alert('Copiar estructura del año anterior');
  };

  const renderTabContent = () => {
    if (!selectedSection) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
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
      case 'schedule': // ✅ NUEVO
        return <SectionScheduleTab section={selectedSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col pb-12 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="space-y-1.5 text-left">
          <button
            onClick={() => router.push('/portal/admin')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a Inicio</span>
          </button>
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

      {/* Main Layout */}
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-80 shrink-0 border-r border-gray-100">
            <SectionTree
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={handleSelectSection}
              onNewSection={() => setIsModalOpen(true)}
              onCopyStructure={handleCopyStructure}
            />
          </div>

          {/* Right Panel */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`pb-3 text-sm font-bold transition-colors ${
                      activeTab === 'info'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-secondary/60 hover:text-secondary'
                    }`}
                  >
                    Información
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`pb-3 text-sm font-bold transition-colors ${
                      activeTab === 'courses'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-secondary/60 hover:text-secondary'
                    }`}
                  >
                    Cursos y Docentes
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-3 text-sm font-bold transition-colors ${
                      activeTab === 'students'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-secondary/60 hover:text-secondary'
                    }`}
                  >
                    Estudiantes
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`pb-3 text-sm font-bold transition-colors ${
                      activeTab === 'schedule'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-secondary/60 hover:text-secondary'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                    Horarios
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <NewSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewSection}
        existingSections={sections}
        availableYears={availableYears}
      />
    </div>
  );
}