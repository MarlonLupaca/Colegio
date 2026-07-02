'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { secretaryMenuItems } from './menuItems';

export default function SecretaryLayout({ children }) {
  return (
    <div className="h-screen bg-transparent text-text-primary flex justify-center items-center overflow-hidden ">
      {/* Unified Parent Container Card */}
      <div className="w-full h-screen shadow-2xl flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar menuItems={secretaryMenuItems} portalTitle="Secretaría" basePath="/portal/secretary" />

        {/* Main Content Area */}
        <main className="flex-1 px-4 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15 rounded-l-[40px] bg-card-dark">
          {/* Dynamic Header */}
          <Header
            welcomeText="Consola de Administración - Secretaría"
            userName="Personal Administrativo"
            userCode="SEC00001"
            avatarText="SE"
            searchPlaceholder="Buscar alumnos, matrículas, secciones..."
          />

          {/* Children holds the current page content */}
          <div className="flex-1 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
