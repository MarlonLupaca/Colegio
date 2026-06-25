'use client';

import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  CheckCircle2,
  Pin,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Send,
} from 'lucide-react';
import Image from 'next/image';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Dirección Académica',
      role: 'Coordinación General',
      avatar: 'DA',
      avatarBg: 'bg-[#031553]',
      isVerified: true,
    },
    time: 'Hace 10 minutos',
    content:
      '¡Ya está aquí la Semana de la Ciencia y Tecnología 2026! 🚀 Participa en los diferentes talleres de robótica, programación y proyectos científicos. Las inscripciones para presentar tus proyectos grupales ya se encuentran abiertas en la secretaría del colegio. ¡Demuestra tu talento creativo!',
    image: '/Img/login.png',
    likes: 42,
    hasLiked: false,
    isPinned: true,
    commentsList: [
      {
        id: 1,
        author: 'Prof. Mary Johnson',
        avatar: 'MJ',
        avatarBg: 'bg-emerald-600',
        text: 'Excelente iniciativa. Estaré apoyando a los alumnos de 5to en el laboratorio de robótica.',
        time: 'Hace 5 min',
      },
      {
        id: 2,
        author: 'Mateo Sandoval',
        avatar: 'MS',
        avatarBg: 'bg-indigo-600',
        text: '¡Increíble! Ya inscribí a mi grupo para el concurso de programación en Python.',
        time: 'Hace 2 min',
      },
    ],
  },
  {
    id: 2,
    author: {
      name: 'Administración El Sauce Azul',
      role: 'Oficina de Comunicaciones',
      avatar: 'AD',
      avatarBg: 'bg-emerald-600',
      isVerified: true,
    },
    time: 'Hace 2 horas',
    content:
      '📢 Comunicado N° 045: Entrega de Informes Académicos.\n\nSe informa a los padres de familia y alumnos que los reportes de rendimiento correspondientes al segundo bimestre ya se encuentran digitalizados y disponibles para su descarga desde el panel de Calificaciones en cada uno de sus portales.',
    likes: 28,
    hasLiked: false,
    isPinned: false,
    commentsList: [
      {
        id: 1,
        author: 'Laura Stanley',
        avatar: 'LS',
        avatarBg: 'bg-amber-600',
        text: 'Gracias por la información, ya pude descargar el reporte de mi hija sin problemas.',
        time: 'Hace 1 hora',
      },
    ],
  },
  {
    id: 3,
    author: {
      name: 'Soporte Técnico',
      role: 'Sistemas e Infraestructura',
      avatar: 'ST',
      avatarBg: 'bg-slate-700',
      isVerified: false,
    },
    time: 'Ayer a las 18:30',
    content:
      '🔧 Mantenimiento de Servidores Programado.\n\nEste sábado realizaremos actualizaciones de seguridad de rutina en la base de datos central de 22:00 a 02:00. El ingreso a la plataforma estará suspendido de forma temporal durante este intervalo. Agradecemos enormemente su paciencia.',
    likes: 12,
    hasLiked: false,
    isPinned: false,
    commentsList: [],
  },
];

const upcomingEvents = [
  {
    id: 1,
    day: 14,
    title: 'Feria de Ciencias y Tecnología',
    time: '09:00 - 13:00',
    location: 'Coliseo Principal',
    category: 'Académico',
    dotColor: 'bg-indigo-600',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  {
    id: 2,
    day: 22,
    title: 'Simulacro Multipeligro',
    time: '10:00 AM',
    location: 'Patios del Colegio',
    category: 'Seguridad',
    dotColor: 'bg-rose-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  {
    id: 3,
    day: 23,
    title: 'Taller de Python Avanzado',
    time: '15:30 - 17:00',
    location: 'Lab de Computación 2',
    category: 'Talleres',
    dotColor: 'bg-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    id: 4,
    day: 31,
    title: 'Evaluaciones Bimestrales',
    time: '08:00 - 14:00',
    location: 'Aulas de Clase',
    category: 'Exámenes',
    dotColor: 'bg-amber-600',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-100',
  },
];

// Calendar calculations for October 2026
// October 1st, 2026 is a Thursday.
// Lun: empty, Mar: empty, Mie: empty, Jue: 1, Vie: 2, Sab: 3, Dom: 4.
const calendarDays = [
  { day: null, hasEvent: false }, // Lun
  { day: null, hasEvent: false }, // Mar
  { day: null, hasEvent: false }, // Mie
  { day: 1, hasEvent: false },
  { day: 2, hasEvent: false },
  { day: 3, hasEvent: false },
  { day: 4, hasEvent: false },
  { day: 5, hasEvent: false },
  { day: 6, hasEvent: false },
  { day: 7, hasEvent: false },
  { day: 8, hasEvent: false },
  { day: 9, hasEvent: false },
  { day: 10, hasEvent: false },
  { day: 11, hasEvent: false },
  { day: 12, hasEvent: false },
  { day: 13, hasEvent: false },
  { day: 14, hasEvent: true, eventId: 1 }, // Event 1
  { day: 15, hasEvent: false },
  { day: 16, hasEvent: false },
  { day: 17, hasEvent: false },
  { day: 18, hasEvent: false },
  { day: 19, hasEvent: false },
  { day: 20, hasEvent: false },
  { day: 21, hasEvent: false },
  { day: 22, hasEvent: true, eventId: 2 }, // Event 2
  { day: 23, hasEvent: true, eventId: 3 }, // Event 3
  { day: 24, hasEvent: false },
  { day: 25, hasEvent: false },
  { day: 26, hasEvent: false },
  { day: 27, hasEvent: false },
  { day: 28, hasEvent: false },
  { day: 29, hasEvent: false },
  { day: 30, hasEvent: false },
  { day: 31, hasEvent: true, eventId: 4 }, // Event 4
  { day: null, hasEvent: false }, // Next month fill
];

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function AnnouncementBoard() {
  const [posts, setPosts] = useState(mockPosts);
  const [selectedDay, setSelectedDay] = useState(14); // Default to first event day
  const [commentInputs, setCommentInputs] = useState({});

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsList: [
              ...post.commentsList,
              {
                id: Date.now(),
                author: 'Tú',
                avatar: 'YO',
                avatarBg: 'bg-[#031553]',
                text: commentText,
                time: 'Hace un momento',
              },
            ],
          };
        }
        return post;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const selectedEvent = upcomingEvents.find((e) => e.day === selectedDay);

  return (
    <div className="w-full animate-fade-in pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Social Feed (2/3 width, fully responsive) */}
        <div className="lg:col-span-2 space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col relative"
            >
              {/* Pinned Tag */}
              {post.isPinned && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  <Pin className="w-3 h-3 rotate-45 fill-amber-600" />
                  <span>Anclado</span>
                </div>
              )}

              {/* Post Header */}
              <div className="p-4 pb-0 flex gap-3 items-center ">
                <div
                  className={`w-10 h-10 rounded-full ${post.author.avatarBg} flex items-center justify-center font-bold text-white text-xs select-none`}
                >
                  {post.author.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm text-primary truncate hover:underline cursor-pointer">
                      {post.author.name}
                    </h3>
                    {post.author.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-none mt-0.5">
                    {post.author.role} • {post.time}
                  </p>
                </div>
                {!post.isPinned && (
                  <button className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Post Body (Content Text) */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-[#031553] leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Optional Post Image */}
              {post.image && (
                <div className="relative w-full aspect-video border-y border-gray-50 bg-gray-50">
                  <Image src={post.image} alt="Post attachment" fill priority className="object-cover" />
                </div>
              )}

              {/* Post Metrics Stats */}
              <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 font-semibold border-b border-gray-50">
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                  <span className="bg-[#031553]/10 p-0.5 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-[#031553] fill-[#031553]" />
                  </span>
                  {post.likes} reacciones
                </span>
                <span className="hover:underline cursor-pointer">{post.commentsList.length} comentarios</span>
              </div>

              {/* Action Buttons (Share Removed) */}
              <div className="px-2 py-1 flex items-center justify-between text-sm font-bold text-gray-500 border-b border-gray-50">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all cursor-pointer ${
                    post.hasLiked ? 'text-[#031553]' : 'hover:text-primary'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-[#031553]' : ''}`} />
                  <span>Reaccionar</span>
                </button>

                <button className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-primary transition-all cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comentar</span>
                </button>
              </div>

              {/* Real Comments Section */}
              <div className="p-4 bg-gray-50/50 space-y-4">
                {post.commentsList.length > 0 && (
                  <div className="space-y-3.5">
                    {post.commentsList.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 items-start">
                        <div
                          className={`w-7.5 h-7.5 rounded-full ${comment.avatarBg} flex items-center justify-center font-bold text-white text-[10px] select-none shrink-0`}
                        >
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-100 rounded-2xl px-3.5 py-2 inline-block max-w-full text-left">
                            <span className="font-bold text-xs text-primary block leading-none hover:underline cursor-pointer mb-1">
                              {comment.author}
                            </span>
                            <p className="text-xs text-[#031553] leading-relaxed break-words">{comment.text}</p>
                          </div>
                          <span className="text-[8px] text-gray-400 block ml-2 pt-0.5">{comment.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input Form */}
                <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2 items-center">
                  <div className="w-7.5 h-7.5 rounded-full bg-[#031553] flex items-center justify-center font-bold text-white text-[10px] select-none shrink-0">
                    YO
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-full px-3.5 py-1.5 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      className="flex-1 bg-transparent text-xs text-primary outline-none placeholder:text-gray-300"
                    />
                    <button
                      type="submit"
                      className="text-primary hover:text-primary-hover transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </article>
          ))}
        </div>

        {/* Right Side: Interactive Monthly Calendar Card (Takes full space) */}
        <div className="space-y-6 sticky top-21 left-0 h-fit">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-5">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2 select-none">
                <CalendarIcon className="w-4 h-4" /> Calendario Escolar
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary select-none">Octubre 2026</span>
              </div>
            </div>

            {/* Monthly Calendar Grid */}
            <div className="space-y-2">
              {/* Week Days Headers */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 select-none">
                {weekDays.map((wd) => (
                  <div key={wd}>{wd}</div>
                ))}
              </div>

              {/* Days Boxes */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((cell, idx) => {
                  if (cell.day === null) {
                    return <div key={idx} className="aspect-square" />;
                  }

                  const isSelected = cell.day === selectedDay;
                  const event = upcomingEvents.find((e) => e.day === cell.day);

                  return (
                    <button
                      key={idx}
                      onClick={() => cell.hasEvent && setSelectedDay(cell.day)}
                      disabled={!cell.hasEvent}
                      className={`aspect-square rounded-lg flex flex-col justify-between p-1.5 text-[10px] font-semibold transition-all select-none relative ${
                        cell.hasEvent
                          ? isSelected
                            ? 'bg-[#031553] text-white shadow-md shadow-[#031553]/15'
                            : 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 text-[#031553] cursor-pointer'
                          : 'text-gray-400 cursor-default'
                      }`}
                    >
                      <span>{cell.day}</span>
                      {cell.hasEvent && !isSelected && (
                        <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 ${event.dotColor}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Event Details Panel (Rich details to occupy space) */}
            {selectedEvent ? (
              <div className="p-4 rounded-xl border border-gray-50 bg-gray-50/50 space-y-3 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${selectedEvent.badgeStyle}`}
                  >
                    {selectedEvent.category}
                  </span>
                  <span className="text-[9px] font-bold text-primary">Día {selectedEvent.day} de Octubre</span>
                </div>
                <h4 className="font-extrabold text-xs text-primary leading-tight">{selectedEvent.title}</h4>
                <div className="space-y-1.5 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-[10px] text-gray-400 py-6">
                Selecciona un día marcado para ver los detalles del evento escolar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
