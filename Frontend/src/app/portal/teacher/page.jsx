'use client';

import React from 'react';

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Highlight Banner */}
      <div className="bg-primary-teal/5 border border-primary-teal/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold">¡Hola Mary!</h3>
          <p className="text-text-secondary text-sm max-w-md">Tienes 2 clases programadas para hoy. Aún no has tomado asistencia para tu clase de Robótica Básica de las 11:00.</p>
        </div>
        <button className="bg-accent-indigo hover:bg-accent-indigo/80 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-accent-indigo/10 transition-colors cursor-pointer">
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
            <span className="text-5xl font-extrabold text-primary-teal">94.8%</span>
            <p className="text-xs font-semibold text-text-primary mt-2">Asistencia Promedio</p>
            <p className="text-[10px] text-text-secondary mt-1">De todos tus salones este mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
