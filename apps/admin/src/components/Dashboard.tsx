import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Plus,
  Calendar,
  Building2,
  QrCode,
  X,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  Image as ImageIcon,
  ExternalLink,
  Link2,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { StudentProfile, RehearsalEvent, RoomBooking } from '../shared';

interface DashboardProps {
  students: StudentProfile[];
  rehearsals: RehearsalEvent[];
  bookings: RoomBooking[];
  pendingCount: number;
  setActiveTab: (tab: any) => void;
}

export interface AnnouncementSlide {
  id: number | string;
  tag: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  bg: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const DEFAULT_SLIDES: AnnouncementSlide[] = [
  {
    id: 1,
    tag: 'EVENTO ARTE & CULTURA',
    title: 'Ceremonia de BIENVENIDA GENERACIÓN 13',
    subtitle: 'Celebremos la llegada de una nueva generación de líderes que inspiran a través de las artes.',
    date: 'Lunes 17 de agosto • 16:00 hrs (CDT)',
    location: 'Centro de Congresos, Campus Monterrey',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4f46e5 100%)',
    ctaText: 'Formulario de Registro',
    ctaUrl: 'https://tec.mx',
  },
  {
    id: 2,
    tag: 'COMPAÑÍA ARTÍSTICA',
    title: 'Audiciones Abiertas Tec 2026',
    subtitle: 'Ensamble Musical, Comedia Musical, Baile Urbano y Canto Vocal de Tecnológico de Monterrey.',
    date: 'Viernes 21 de agosto • 15:00 hrs',
    location: 'Foro de Artes Escénicas',
    bg: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #2563eb 100%)',
    ctaText: 'Registrar Audición',
    ctaUrl: 'https://forms.gle/audiciones',
  },
  {
    id: 3,
    tag: 'RECONOCIMIENTO',
    title: 'Premios EXATEC Trayectoria Artística',
    subtitle: 'Nominaciones abiertas para estudiantes destacados en disciplinas escénicas del Tec.',
    date: 'Cierre: 30 de agosto',
    location: 'Nacional Tec',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #2563eb 100%)',
  },
];

const EMPTY_FALLBACK_SLIDE: AnnouncementSlide = {
  id: 'empty-1',
  tag: 'ARTE & CULTURA TEC',
  title: 'Espacio para Anuncios y Convocatorias',
  subtitle: 'Haz clic en "Editar Anuncio" o en el botón "+" para publicar noticias y avisos importantes.',
  date: 'Tec de Monterrey',
  location: 'Tec Campus Laguna (Torreón)',
  bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
};

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  rehearsals,
  bookings,
  pendingCount,
  setActiveTab,
}) => {
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');

  // Dynamic Announcement Slides State with localStorage persistence
  const [slides, setSlides] = useState<AnnouncementSlide[]>(() => {
    try {
      const saved = localStorage.getItem('organizarte_announcements_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SLIDES;
    } catch {
      return DEFAULT_SLIDES;
    }
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal Editor State
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | string | null>(null);

  // Form fields for slide editing / creation
  const [tag, setTag] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');

  // Save slides to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('organizarte_announcements_slides', JSON.stringify(slides));
    } catch (e) {
      console.warn('Could not save slides to localStorage', e);
    }
  }, [slides]);

  // Auto-advance banner carousel every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleOpenNewSlideModal = () => {
    setEditingSlideId(null);
    setTag('EVENTO TEC');
    setTitle('');
    setSubtitle('');
    setDate('');
    setLocation('');
    setImageUrl('');
    setCtaText('');
    setCtaUrl('');
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlideModal = (slide: AnnouncementSlide) => {
    setEditingSlideId(slide.id);
    setTag(slide.tag);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setDate(slide.date);
    setLocation(slide.location);
    setImageUrl(slide.imageUrl || '');
    setCtaText(slide.ctaText || '');
    setCtaUrl(slide.ctaUrl || '');
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingSlideId !== null) {
      const updated = slides.map((s) =>
        String(s.id) === String(editingSlideId)
          ? { ...s, tag, title, subtitle, date, location, imageUrl, ctaText, ctaUrl }
          : s
      );
      setSlides(updated);
      localStorage.setItem('organizarte_announcements_slides', JSON.stringify(updated));
    } else {
      const newSlide: AnnouncementSlide = {
        id: Date.now(),
        tag: tag || 'ANUNCIO',
        title,
        subtitle,
        date,
        location,
        bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        imageUrl,
        ctaText,
        ctaUrl,
      };
      const updated = [...slides.filter((s) => s.id !== 'empty-1'), newSlide];
      setSlides(updated);
      localStorage.setItem('organizarte_announcements_slides', JSON.stringify(updated));
      setCurrentSlide(updated.length - 1);
    }

    setIsSlideModalOpen(false);
  };

  const handleDeleteSlide = (id: number | string) => {
    const remaining = slides.filter((s) => String(s.id) !== String(id));
    const nextSlides = remaining.length > 0 ? remaining : [EMPTY_FALLBACK_SLIDE];
    setSlides(nextSlides);
    localStorage.setItem('organizarte_announcements_slides', JSON.stringify(nextSlides));
    setCurrentSlide(0);
    setIsSlideModalOpen(false);
  };

  const activeSlideObj = slides[currentSlide] || slides[0] || EMPTY_FALLBACK_SLIDE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '24px' }}>
      {/* 1. Header Banner & Dynamic Announcements Carousel */}
      <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{
          background: activeSlideObj.bg || 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          padding: '36px 40px',
          color: '#ffffff',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          backgroundImage: activeSlideObj.imageUrl ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${activeSlideObj.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {activeSlideObj.tag}
              </span>
              {activeSlideObj.date && (
                <span style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 600 }}>
                  {activeSlideObj.date}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, maxWidth: '780px', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '10px' }}>
              {activeSlideObj.title}
            </h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '650px', lineHeight: 1.5 }}>
              {activeSlideObj.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeSlideObj.ctaText && (
                <a
                  href={activeSlideObj.ctaUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}
                >
                  <span>{activeSlideObj.ctaText}</span>
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              )}

              <button
                onClick={() => handleOpenEditSlideModal(activeSlideObj)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Edit3 style={{ width: 14, height: 14 }} />
                <span>Editar Anuncio</span>
              </button>
            </div>

            {/* Carousel Dots & Add Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentSlide === idx ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}

              <button
                onClick={handleOpenNewSlideModal}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '6px',
                }}
                title="Publicar Nuevo Anuncio"
              >
                <Plus style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* KPI 1: Active Students */}
        <div
          className="executive-card"
          onClick={() => setActiveTab('approvals')}
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ALUMNOS ACTIVOS
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {activeStudents.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              <span>100% Inscripciones Activas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Approvals */}
        <div
          className="executive-card"
          onClick={() => setActiveTab('approvals')}
          style={{
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: pendingCount > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SOLICITUDES PENDIENTES
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: pendingCount > 0 ? '#f59e0b' : 'var(--text-main)', lineHeight: 1 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px' }}>
              {pendingCount > 0 ? '⚠️ Requieren validación' : '✓ Todo Aprobado'}
            </div>
          </div>
        </div>

        {/* KPI 3: Rehearsals Scheduled */}
        <div
          className="executive-card"
          onClick={() => setActiveTab('rehearsals')}
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ENSAYOS PROGRAMADOS
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {rehearsals.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginTop: '6px' }}>
              Agenda General de Convocatorias
            </div>
          </div>
        </div>

        {/* KPI 4: Room Bookings */}
        <div
          className="executive-card"
          onClick={() => setActiveTab('rooms')}
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PASES DE SALÓN DAE
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#cffafe', color: '#0e7490', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {bookings.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px' }}>
              Préstamos de Cubículos & Salones
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Modules Banner Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Availability Heatmap Module Card */}
        <div className="executive-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>MATRIZ DE DISPONIBILIDAD</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Horarios & Cruces de Clases
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Analiza los horarios cargados por los alumnos con sensibilidad de **1 Hora** y **30 Minutos**, detectando empalmes para convocatorias.
            </p>
          </div>
          <button onClick={() => setActiveTab('availability')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Ver Matriz de Disponibilidad</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Rehearsal Scheduler Module Card */}
        <div className="executive-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>PRÓXIMAS CONVOCATORIAS</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Ensayos & Pases de Asistencia
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Genera códigos QR de pase de lista y asigna ensayos por secciones (Sopranos, Trompetas, Ensamble Tutti).
            </p>
          </div>
          <button onClick={() => setActiveTab('rehearsals')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
            <span>Programar Convocatoria</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* 4. Edit Announcement Slide Modal */}
      {isSlideModalOpen && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '560px', padding: '32px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {editingSlideId !== null ? 'Editar Anuncio Destacado' : 'Publicar Nuevo Anuncio'}
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  ETIQUETA / CATEGORÍA
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Ej: EVENTO ARTE & CULTURA, AUDICIONES, CONCIERTO"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  TÍTULO DEL ANUNCIO *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Ceremonia de Bienvenida 2026"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  DESCRIPCIÓN / SUBTÍTULO
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Describe brevemente la información del anuncio..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    FECHA & HORA
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ej: Lunes 17 de agosto • 16:00 hrs"
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    UBICACIÓN
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Centro de Congresos"
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                {editingSlideId !== null && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(editingSlideId)}
                    className="btn-danger"
                  >
                    <Trash2 style={{ width: 16, height: 16 }} />
                    <span>Eliminar Anuncio</span>
                  </button>
                )}

                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                  <button type="button" onClick={() => setIsSlideModalOpen(false)} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    <Save style={{ width: 16, height: 16 }} />
                    <span>Guardar Anuncio</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
