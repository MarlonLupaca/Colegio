'use client';

import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Calendar, Award, CreditCard, Settings, GraduationCap } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const studentMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
  { id: 'schedule', label: 'Horarios', icon: Calendar },
  { id: 'grades', label: 'Calificaciones', icon: Award },
  { id: 'billing', label: 'Pagos', icon: CreditCard },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-screen bg-transparent text-text-primary flex justify-center items-center overflow-hidden ">
      {/* Unified Parent Container Card */}
      <div className="w-full h-screen   shadow-2xl flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar
          menuItems={studentMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalTitle="Estudiante"
          portalIcon={GraduationCap}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15  rounded-l-[40px] bg-card-dark">
          {/* Dynamic Header */}
          <Header
            welcomeText="Bienvenido de vuelta, Grace"
            userName="Grace Stanley"
            userCode="ALU10024"
            avatarText="GS"
            searchPlaceholder="Buscar tareas, cursos..."
          />

          {/* Content Render based on Active Tab */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Highlight Banner */}
                <div className="bg-gradient-to-r from-primary-teal/20 to-accent-indigo/10 border border-primary-teal/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold">¡Hola Grace!</h3>
                    <p className="text-text-secondary text-sm max-w-md">
                      Tienes 3 tareas nuevas pendientes para esta semana. Comienza a repasar tus lecciones de hoy.
                    </p>
                  </div>
                  <button className="bg-primary-teal hover:bg-primary-hover text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary-teal/10 transition-colors">
                    Ver mis tareas
                  </button>
                </div>

                {/* Grid content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Course List Card */}
                  <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4 lg:col-span-2">
                    <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">Mis Clases de Hoy</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-4 rounded-xl hover:border-primary-teal/30 transition-all duration-200">
                        <div>
                          <h5 className="font-bold text-sm">Electrónica Analógica</h5>
                          <p className="text-xs text-text-secondary mt-1">Docente: Mary Johnson • 09:45 - 10:30</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-primary-teal/10 text-primary-teal rounded-lg">
                          En curso
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-4 rounded-xl hover:border-primary-teal/30 transition-all duration-200">
                        <div>
                          <h5 className="font-bold text-sm">Robótica Básica</h5>
                          <p className="text-xs text-text-secondary mt-1">Docente: James Brown • 11:00 - 12:45</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-white/5 text-text-secondary rounded-lg">
                          Próximo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Card */}
                  <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">
                      Rendimiento Académico
                    </h4>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-accent-indigo">
                        95.4%
                      </span>
                      <p className="text-xs font-semibold text-text-primary mt-2">Promedio General</p>
                      <p className="text-[10px] text-text-secondary mt-1">¡Excelente trabajo este bimestre!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="text-lg font-bold text-text-secondary">
                  Sección de {studentMenuItems.find((i) => i.id === activeTab)?.label}
                </span>
                <p className="text-xs text-text-secondary/50 mt-1">
                  Este módulo está listo para recibir la conexión del microservicio correspondiente.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
