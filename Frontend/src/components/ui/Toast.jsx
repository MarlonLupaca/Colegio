'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const configs = {
    success: {
      bg: 'bg-[#031553]',
      text: 'text-white',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    error: {
      bg: 'bg-rose-950',
      text: 'text-white',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-950',
      text: 'text-white',
      icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
    }
  };

  const current = configs[type] || configs.success;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${current.bg} ${current.text} px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/5 animate-bounce min-w-[280px] max-w-sm`}>
      {current.icon}
      <span className="text-xs font-semibold flex-1 leading-snug">{message}</span>
      <button 
        onClick={onClose}
        className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
