'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { teacherMenuItems } from './menuItems';

export default function TeacherLayout({ children }) {
  return (
    <div className="h-screen bg-transparent text-text-primary flex justify-center items-center overflow-hidden ">
      {/* Unified Parent Container Card */}
      <div className="w-full h-screen shadow-2xl flex overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar menuItems={teacherMenuItems} portalTitle="Docente" basePath="/portal/teacher" />

        {/* Main Content Area */}
        <main className="flex-1 px-8 flex flex-col h-full overflow-y-auto relative bg-bg-dark/15 rounded-l-[40px] bg-card-dark">
          {/* Dynamic Header */}
          <Header
            welcomeText="Bienvenido de vuelta, Prof. Mary"
            userName="Mary Johnson"
            userCode="DOC20415"
            avatarText="MJ"
            searchPlaceholder="Buscar alumnos, notas..."
          />

          {/* Children holds the current page content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
