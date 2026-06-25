'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { studentMenuItems } from './menuItems';

export default function StudentLayout({ children }) {
  return (
    <div className="h-screen bg-transparent text-text-primary flex justify-center items-center overflow-hidden ">
      {/* Unified Parent Container Card */}
      <div className="w-full h-screen shadow-2xl flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar menuItems={studentMenuItems} portalTitle="Estudiante" basePath="/portal/student" />

        {/* Main Content Area */}
        <main className="flex-1  px-4 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15 rounded-l-[40px] bg-card-dark">
          {/* Dynamic Header */}
          <Header
            welcomeText="Bienvenido de vuelta, Grace"
            userName="Grace Stanley"
            userCode="ALU10024"
            avatarText="GS"
            searchPlaceholder="Buscar tareas, cursos..."
          />

          {/* Children holds the current page content */}
          <div className="flex-1 relative px-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
