// app/portal/admin/classrooms/components/ToastNotification.jsx
'use client';

import React from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <Check className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-600 shrink-0" />
  };

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    error: 'bg-rose-50 text-rose-800 border-rose-100',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-100'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border animate-slide-in text-xs font-semibold max-w-sm ${styles[toast.type]}`}>
      {icons[toast.type]}
      <span>{toast.message}</span>
    </div>
  );
}