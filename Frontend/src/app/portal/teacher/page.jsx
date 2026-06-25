'use client';

import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Users, FileText, Award, Settings, BookOpenCheck } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const teacherMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-courses', label: 'Mis Cursos', icon: BookOpen },
  { id: 'attendance', label: 'Asistencia', icon: Users },
  { id: 'assignments', label: 'Tareas', icon: FileText },
  { id: 'grading', label: 'Calificaciones', icon: Award },
  { id: 'settings', label: 'Ajustes', icon: Settings }
];

export default function TeacherPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary p-4 flex justify-center items-center overflow-hidden">
      
      {/* Unified Parent Container Card */}
      <div className="w-full h-[calc(100vh-2rem)] bg-card-dark border border-white/5 rounded-[32px] shadow-2xl flex overflow-hidden">
        
        {/* Dynamic Sidebar */}
        <Sidebar
          menuItems={teacherMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalTitle="Docente"
          portalIcon={BookOpenCheck}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15">
        
        {/* Dynamic Header */}
        <Header 
          welcomeText="Bienvenido de vuelta, Prof. Mary"
          userName="Mary Johnson"
          userCode="DOC20415"
          avatarText="MJ"
          searchPlaceholder="Buscar alumnos, notas..."
        />

        {/* Content Render based on Active Tab */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-accent-indigo/20 to-primary-teal/10 border border-accent-indigo/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-bold">¡Hola Mary!</h3>
                  <p className="text-text-secondary text-sm max-w-md">Tienes 2 clases programadas para hoy. Aún no has tomado asistencia para tu clase de Robótica Básica de las 11:00.</p>
                </div>
                <button className="bg-accent-indigo hover:bg-accent-indigo/80 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-accent-indigo/10 transition-colors">
                  Tomar Asistencia
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course List Card */}
                <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4 lg:col-span-2">
                  <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">Clases a dictar Hoy</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-4 rounded-xl hover:border-accent-indigo/30 transition-all duration-200">
                      <div>
                        <h5 className="font-bold text-sm">Electrónica Analógica - 5to B</h5>
                        <p className="text-xs text-text-secondary mt-1">Aula 102 • 09:45 - 10:30</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-accent-indigo/10 text-accent-indigo rounded-lg">Finalizado</span>
                    </div>
                    <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-4 rounded-xl hover:border-accent-indigo/30 transition-all duration-200">
                      <div>
                        <h5 className="font-bold text-sm">Robótica Básica - 5to A</h5>
                        <p className="text-xs text-text-secondary mt-1">Laboratorio de Ciencias • 11:00 - 12:45</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-primary-teal/10 text-primary-teal rounded-lg">Por dictar</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">Resumen de Alumnos</h4>
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-indigo to-primary-teal">94.8%</span>
                    <p className="text-xs font-semibold text-text-primary mt-2">Asistencia Promedio</p>
                    <p className="text-[10px] text-text-secondary mt-1">De todos tus salones este mes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-lg font-bold text-text-secondary">Sección de {teacherMenuItems.find(i => i.id === activeTab)?.label}</span>
              <p className="text-xs text-text-secondary/50 mt-1">Este módulo está listo para recibir la conexión del microservicio correspondiente.</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  );
}
