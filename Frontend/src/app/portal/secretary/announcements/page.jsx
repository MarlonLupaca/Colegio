'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  Send, 
  Trash2, 
  Clock, 
  ArrowLeft,
  FileText,
  UserCheck
} from 'lucide-react';
import { apiFetch } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

export default function SecretaryAnnouncementsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { askConfirmation } = useConfirmation();

  // Estados de datos
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: false
  });

  // Cargar publicaciones del backend
  const fetchAnnouncements = async () => {
    try {
      const data = await apiFetch('/api/v1/announcement');
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error cargando anuncios:', err.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Guardar publicación (POST)
  const handlePublish = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      showToast('El contenido de la publicación no puede estar vacío.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim() || 'Aviso General',
        content: formData.content.trim(),
        isPinned: formData.isPinned,
        authorName: 'Secretaría General',
        authorRole: 'Comunicaciones',
        authorAvatarBg: 'bg-[#031553]',
        likes: 0
      };

      await apiFetch('/api/v1/announcement', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('¡Anuncio publicado correctamente en la pizarra del colegio!', 'success');
      
      // Limpiar formulario y recargar
      setFormData({ title: '', content: '', isPinned: false });
      fetchAnnouncements();
    } catch (err) {
      showToast(err.message || 'No se pudo publicar el anuncio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar publicación (DELETE con confirmación)
  const handleDelete = async (announcement) => {
    const isConfirmed = await askConfirmation({
      title: 'Eliminar Anuncio Institucional',
      message: `¿Está seguro de que desea retirar permanentemente la publicación del panel general? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      await apiFetch(`/api/v1/announcement/${announcement.id}`, {
        method: 'DELETE'
      });

      showToast('La publicación ha sido retirada de la pizarra.', 'success');
      fetchAnnouncements();
    } catch (err) {
      showToast(err.message || 'Error al retirar la publicación.', 'error');
    }
  };

  return (
    <div className="w-full pb-12 space-y-6 animate-fade-in text-xs text-[#031553] text-left">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <button
            onClick={() => router.push('/portal/secretary')}
            className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a Inicio</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#031553]/10 rounded-xl text-[#031553]">
              <Megaphone className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold">Pizarra de Publicaciones</h1>
          </div>
          <p className="text-xs text-gray-400">
            Redacta avisos, comunicados e invitaciones institucionales que se verán en el panel de todos los portales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor de Redacción (Izquierda) */}
        <form onSubmit={handlePublish} className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-1.5 border-b pb-3 border-gray-100 uppercase tracking-wide text-secondary">
            Redactar Nuevo Comunicado
          </h2>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Título del Comunicado (Opcional)</label>
            <input
              type="text"
              placeholder="Ej. Comunicado N° 045: Entrega de Reportes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-primary outline-none focus:border-primary/40 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wide">Cuerpo del Mensaje *</label>
            <textarea
              required
              rows="6"
              placeholder="Escribe aquí el contenido del aviso oficial para alumnos, padres y docentes..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-primary outline-none focus:border-primary/40 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100 select-none">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20 cursor-pointer"
            />
            <label htmlFor="isPinned" className="text-[10px] font-bold text-gray-500 cursor-pointer uppercase tracking-wide">
              Fijar publicación arriba de la pizarra
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#031553] hover:bg-[#020d36] text-white font-bold py-2.5 px-6 rounded-xl shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Publicando...' : 'Publicar Anuncio'}
            </button>
          </div>
        </form>

        {/* Historial de Publicaciones (Derecha) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-1.5 border-b pb-3 border-gray-100 uppercase tracking-wide text-secondary">
            Publicaciones Recientes
          </h2>

          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {announcements.map((ann) => (
              <div key={ann.id} className="border border-gray-100 rounded-2xl p-4 space-y-2 hover:border-gray-200/80 transition-all relative group bg-slate-50/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      ann.isPinned ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-gray-500'
                    }`}>
                      {ann.isPinned ? '📌 Fijado' : 'Aviso'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ann.creationDate ? new Date(ann.creationDate).toLocaleDateString() : 'Reciente'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(ann)}
                    className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-rose-100/10"
                    title="Retirar anuncio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-[#031553]">{ann.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 border-t pt-2 border-slate-100">
                  <UserCheck className="w-3 h-3 text-indigo-400" />
                  <span>Publicado por: {ann.authorName || 'Secretaría'} ({ann.authorRole || 'Comunicaciones'})</span>
                </div>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center space-y-2">
                <FileText className="w-8 h-8 text-gray-300" />
                <p>No se registran anuncios en la base de datos.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
