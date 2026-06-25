'use client';

import React, { useState } from 'react';
import { Clock, MapPin, User, Printer, Calendar } from 'lucide-react';

const scheduleData = {
  section: '5° Año - Sección A',
  classroom: 'Aula 302 - Pabellón B',
  periods: [
    { time: '08:00 - 09:30', name: '1° Hora' },
    { time: '09:30 - 11:00', name: '2° Hora' },
    { time: '11:00 - 11:30', name: 'Recreo', isBreak: true },
    { time: '11:30 - 13:00', name: '3° Hora' },
    { time: '13:00 - 14:00', name: 'Almuerzo', isBreak: true },
    { time: '14:00 - 15:30', name: '4° Hora' },
  ],
  days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  classes: {
    Lunes: {
      '08:00 - 09:30': { subject: 'Matemática I', teacher: 'Lic. Martha Wayne', room: 'Aula 302', bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 icon-indigo' },
      '09:30 - 11:00': { subject: 'Física General', teacher: 'Msc. Albert Finch', room: 'Laboratorio A', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 icon-emerald' },
      '11:30 - 13:00': { subject: 'Literatura y Redacción', teacher: 'Msc. Emma Watson', room: 'Aula 302', bg: 'bg-rose-50 border-rose-200 text-rose-900 icon-rose' },
      '14:00 - 15:30': { subject: 'Computación e Informática', teacher: 'Ing. Sarah Connor', room: 'Lab Cómputo 1', bg: 'bg-slate-50 border-slate-200 text-slate-900 icon-slate' },
    },
    Martes: {
      '08:00 - 09:30': { subject: 'Álgebra Lineal', teacher: 'Dr. James Brown', room: 'Aula 302', bg: 'bg-violet-50 border-violet-200 text-violet-900 icon-violet' },
      '09:30 - 11:00': { subject: 'Química Orgánica', teacher: 'Dr. Bruce Banner', room: 'Laboratorio B', bg: 'bg-teal-50 border-teal-200 text-teal-900 icon-teal' },
      '11:30 - 13:00': { subject: 'Matemática I', teacher: 'Lic. Martha Wayne', room: 'Aula 302', bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 icon-indigo' },
      '14:00 - 15:30': { subject: 'Física General', teacher: 'Msc. Albert Finch', room: 'Aula 302', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 icon-emerald' },
    },
    Miércoles: {
      '08:00 - 09:30': { subject: 'Computación e Informática', teacher: 'Ing. Sarah Connor', room: 'Lab Cómputo 1', bg: 'bg-slate-50 border-slate-200 text-slate-900 icon-slate' },
      '09:30 - 11:00': { subject: 'Literatura y Redacción', teacher: 'Msc. Emma Watson', room: 'Aula 302', bg: 'bg-rose-50 border-rose-200 text-rose-900 icon-rose' },
      '11:30 - 13:00': { subject: 'Álgebra Lineal', teacher: 'Dr. James Brown', room: 'Aula 302', bg: 'bg-violet-50 border-violet-200 text-violet-900 icon-violet' },
      '14:00 - 15:30': { subject: 'Química Orgánica', teacher: 'Dr. Bruce Banner', room: 'Aula 302', bg: 'bg-teal-50 border-teal-200 text-teal-900 icon-teal' },
    },
    Jueves: {
      '08:00 - 09:30': { subject: 'Matemática I', teacher: 'Lic. Martha Wayne', room: 'Aula 302', bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 icon-indigo' },
      '09:30 - 11:00': { subject: 'Física General', teacher: 'Msc. Albert Finch', room: 'Laboratorio A', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 icon-emerald' },
      '11:30 - 13:00': { subject: 'Química Orgánica', teacher: 'Dr. Bruce Banner', room: 'Aula 302', bg: 'bg-teal-50 border-teal-200 text-teal-900 icon-teal' },
      '14:00 - 15:30': { subject: 'Literatura y Redacción', teacher: 'Msc. Emma Watson', room: 'Aula 302', bg: 'bg-rose-50 border-rose-200 text-rose-900 icon-rose' },
    },
    Viernes: {
      '08:00 - 09:30': { subject: 'Álgebra Lineal', teacher: 'Dr. James Brown', room: 'Aula 302', bg: 'bg-violet-50 border-violet-200 text-violet-900 icon-violet' },
      '09:30 - 11:00': { subject: 'Computación e Informática', teacher: 'Ing. Sarah Connor', room: 'Lab Cómputo 1', bg: 'bg-slate-50 border-slate-200 text-slate-900 icon-slate' },
      '11:30 - 13:00': { subject: 'Literatura y Redacción', teacher: 'Msc. Emma Watson', room: 'Aula 302', bg: 'bg-rose-50 border-rose-200 text-rose-900 icon-rose' },
      '14:00 - 15:30': { subject: 'Matemática I', teacher: 'Lic. Martha Wayne', room: 'Aula 302', bg: 'bg-indigo-50 border-indigo-200 text-indigo-900 icon-indigo' },
    }
  }
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('Lunes');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full animate-fade-in pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Main Schedule Panel (Left Column on Desktop) */}
      <div className="lg:col-span-10 space-y-6">

        {/* Schedule grid/timeline card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          
          {/* Desktop View (Grid/Table) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse table-fixed min-w-[950px]">
              <thead>
                <tr>
                  <th className="w-[10%] p-3 text-xs font-extrabold text-gray-400 uppercase border-b border-gray-100 text-center">
                    Hora
                  </th>
                  {scheduleData.days.map((day) => (
                    <th key={day} className="w-[18%] p-3 text-xs font-extrabold text-primary uppercase border-b border-gray-100 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleData.periods.map((period, idx) => {
                  if (period.isBreak) {
                    return (
                      <tr key={idx} className="bg-gray-50/50">
                        <td className="p-3 border-y border-gray-100 text-center">
                          <span className="text-[10px] font-bold text-gray-400">{period.time}</span>
                        </td>
                        <td colSpan={5} className="p-3 border-y border-gray-100 text-center font-bold text-xs text-gray-500 uppercase tracking-widest">
                          {period.name}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={idx}>
                      <td className="p-4 border-b border-gray-50 text-center align-middle">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-primary">{period.name}</span>
                          <p className="text-[10px] text-gray-400 font-semibold">{period.time}</p>
                        </div>
                      </td>
                      {scheduleData.days.map((day) => {
                        const classInfo = scheduleData.classes[day]?.[period.time];
                        return (
                          <td key={day} className="p-2.5 border-b border-gray-50 align-top h-28">
                            {classInfo ? (
                              <div className={`h-full rounded-xl border p-3 flex flex-col justify-between text-left hover:shadow-sm transition-shadow ${classInfo.bg}`}>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-xs leading-tight line-clamp-2">
                                    {classInfo.subject}
                                  </h4>
                                  <div className="flex items-center gap-1 opacity-70">
                                    <User className="w-3.5 h-3.5 shrink-0" />
                                    <span className="text-[9px] font-semibold truncate max-w-[120px]">{classInfo.teacher}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-70 mt-2">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-[9px] font-extrabold">{classInfo.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full border border-dashed border-gray-100 rounded-xl bg-gray-50/10 flex items-center justify-center">
                                <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-wider">Libre</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Tabbed Timeline) */}
          <div className="lg:hidden space-y-6">
            {/* Day selection tabs */}
            <div className="flex overflow-x-auto gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-150 scrollbar-none">
              {scheduleData.days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`py-2 px-4 text-xs font-bold rounded-xl transition-all flex-1 min-w-[70px] cursor-pointer text-center ${
                    activeDay === day
                      ? 'bg-[#031553] text-white shadow-md'
                      : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>

            {/* Timeline for active day */}
            <div className="space-y-4">
              {scheduleData.periods.map((period, idx) => {
                if (period.isBreak) {
                  return (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 block">{period.time}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5 block">{period.name}</span>
                    </div>
                  );
                }

                const classInfo = scheduleData.classes[activeDay]?.[period.time];

                return (
                  <div key={idx} className="flex gap-4 items-stretch text-left">
                    {/* Time label */}
                    <div className="w-20 flex flex-col justify-center items-end text-right shrink-0">
                      <span className="text-xs font-extrabold text-primary">{period.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{period.time}</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-0.5 bg-gray-100 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                    </div>

                    {/* Course Card */}
                    <div className="flex-1">
                      {classInfo ? (
                        <div className={`rounded-2xl border p-4 flex flex-col justify-between hover:shadow-sm transition-all ${classInfo.bg}`}>
                          <div className="space-y-2">
                            <h4 className="font-bold text-xs leading-snug">
                              {classInfo.subject}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 opacity-70">
                                <User className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-[10px] font-semibold">{classInfo.teacher}</span>
                              </div>
                              <div className="flex items-center gap-1.5 opacity-70">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-[10px] font-bold">{classInfo.room}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Hora Libre</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Info Panel / Sidebar (Right Column on Desktop) */}
      <div className="lg:col-span-2 space-y-6 text-left">
        
        {/* Info Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-gray-50 pb-3">
            <span className="text-[10px] font-extrabold text-[#031553] bg-[#031553]/5 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Detalles del Aula
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-gray-400 font-semibold leading-none">Grado y Sección</p>
              <p className="text-xs font-bold text-primary mt-1.5 leading-none">{scheduleData.section}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold leading-none">Salón Físico</p>
              <p className="text-xs font-bold text-primary mt-1.5 leading-none">{scheduleData.classroom}</p>
            </div>
          </div>
        </div>

        {/* Print Options Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-gray-50 pb-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
              Acciones
            </span>
          </div>
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-primary bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Horario</span>
          </button>
        </div>

      </div>

    </div>
  );
}
