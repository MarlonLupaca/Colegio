'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, FolderKanban, UserPlus, FileCode, Settings, ShieldAlert } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'sections', label: 'Secciones', icon: FolderKanban },
  { id: 'enrollment', label: 'Matrículas', icon: UserPlus },
  { id: 'audit', label: 'Auditoría', icon: FileCode },
  { id: 'settings', label: 'Ajustes', icon: Settings }
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary p-4 flex justify-center items-center overflow-hidden">
      
      {/* Unified Parent Container Card */}
      <div className="w-full h-[calc(100vh-2rem)] bg-card-dark border border-white/5 rounded-[32px] shadow-2xl flex overflow-hidden">
        
        {/* Dynamic Sidebar */}
        <Sidebar
          menuItems={adminMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalTitle="Director"
          portalIcon={ShieldAlert}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15">
        
        {/* Dynamic Header */}
        <Header 
          welcomeText="Consola de Control - Director"
          userName="Administrador Principal"
          userCode="DIR00001"
          avatarText="AD"
          searchPlaceholder="Buscar logs, transacciones, roles..."
        />

        {/* Content Render based on Active Tab */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-primary-teal/20 to-accent-indigo/10 border border-primary-teal/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-bold">Estado de los Microservicios</h3>
                  <p className="text-text-secondary text-sm max-w-md">Todos los 24 servicios del backend se encuentran levantados y listos en la red. No hay alertas de seguridad en el servicio de auditoría.</p>
                </div>
                <button className="bg-primary-teal hover:bg-primary-hover text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary-teal/10 transition-colors">
                  Ver logs de auditoría
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audit logs summary */}
                <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4 lg:col-span-2">
                  <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">Eventos Recientes de Seguridad</h4>
                  <div className="space-y-3 text-xs text-text-secondary">
                    <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-3 rounded-xl">
                      <span>Inicio de sesión exitoso - Código: DIR00001</span>
                      <span className="text-[10px] text-text-secondary/50">Hace 2 min</span>
                    </div>
                    <div className="flex justify-between items-center bg-bg-dark/50 border border-white/5 p-3 rounded-xl">
                      <span>Creación de sección - 5to Grado Aula A por DIR00001</span>
                      <span className="text-[10px] text-text-secondary/50">Hace 2 horas</span>
                    </div>
                  </div>
                </div>

                {/* Performance Card */}
                <div className="bg-card-dark border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-sm tracking-wide text-text-secondary uppercase">Matrícula General</h4>
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-accent-indigo">1,240</span>
                    <p className="text-xs font-semibold text-text-primary mt-2">Alumnos Matriculados</p>
                    <p className="text-[10px] text-text-secondary mt-1">Meta del año lectivo: 95% alcanzado</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-lg font-bold text-text-secondary">Sección de {adminMenuItems.find(i => i.id === activeTab)?.label}</span>
              <p className="text-xs text-text-secondary/50 mt-1">Este módulo está listo para recibir la conexión del microservicio correspondiente.</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  );
}
