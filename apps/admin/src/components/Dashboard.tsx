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
      return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
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
    if (slides.length === 0) return;
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
      setSlides((prev) =>
        prev.map((s) =>
          s.id === editingSlideId
            ? { ...s, tag, title, subtitle, date, location, imageUrl, ctaText, ctaUrl }
            : s
        )
      );
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
      setSlides((prev) => [...prev, newSlide]);
      setCurrentSlide(slides.length);
    }

    setIsSlideModalOpen(false);
  };

  const handleDeleteSlide = (id: number | string) => {
    if (window.confirm('¿Deseas eliminar permanentemente este anuncio destacado?')) {
      const remaining = slides.filter((s) => String(s.id) !== String(id));
      const fallback = remaining.length > 0 ? remaining : DEFAULT_SLIDES;
      setSlides(fallback);
      setCurrentSlide(0);
      setIsSlideModalOpen(false);
    }
  };

  const activeSlideObj = slides[currentSlide] || DEFAULT_SLIDES[0];

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
          zIndex: 1,
        }}>
          {/* Subtle Ambient Background Mesh */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '999px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {activeSlideObj.tag}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                {activeSlideObj.date}
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.2, maxWidth: '720px', marginBottom: '8px' }}>
              {activeSlideObj.title}
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '640px', fontWeight: 500, lineHeight: 1.5 }}>
              {activeSlideObj.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {activeSlideObj.ctaUrl && (
                <a
                  href={activeSlideObj.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#ffffff',
                    color: '#1e3a8a',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}
                >
                  <span>{activeSlideObj.ctaText || 'Más Información'}</span>
                  <ExternalLink style={{ width: 16, height: 16 }} />
                </a>
              )}

              <button
                onClick={() => handleOpenEditSlideModal(activeSlideObj)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '8px 14px',
                  borderRadius: '10px',
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

            {/* Carousel Navigation Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: idx === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}

              <button
                onClick={handleOpenNewSlideModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
                title="Agregar nuevo anuncio"
              >
                <Plus style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* KPI 1: Active Students */}
        <div
          onClick={() => setActiveTab('approvals')}
          className="executive-card"
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alumnos Activos
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {activeStudents.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-accent)', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              <span>+100% Inscripciones Activas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Approvals */}
        <div
          onClick={() => setActiveTab('approvals')}
          className="executive-card"
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Solicitudes Pendientes
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingCount > 0 ? 'var(--rose-accent)' : 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: pendingCount > 0 ? 'var(--rose-accent)' : 'var(--text-muted)', fontWeight: 700, marginTop: '6px' }}>
              {pendingCount > 0 ? '⚠️ Requiere Revisión Directiva' : '✓ Todo Aprobado'}
            </div>
          </div>
        </div>

        {/* KPI 3: Rehearsals Scheduled */}
        <div
          onClick={() => setActiveTab('rehearsals')}
          className="executive-card"
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ensayos Programados
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--violet-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {rehearsals.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--violet-accent)', fontWeight: 700, marginTop: '6px' }}>
              Agenda General de Convocatorias
            </div>
          </div>
        </div>

        {/* KPI 4: Room Bookings */}
        <div
          onClick={() => setActiveTab('rooms')}
          className="executive-card"
          style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pases de Salón DAE
            </span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {bookings.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--cyan-accent)', fontWeight: 700, marginTop: '6px' }}>
              Préstamos de Cubículos & Salones
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Action Hub: Availability Matrix & Rehearsals Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Quick Access Availability Card */}
        <div className="executive-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
              MATRIZ DE DISPONIBILIDAD
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Horarios & Cruces de Clases
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Analiza los horarios cargados por los alumnos con sensibilidad de **1 Hora** y **30 Minutos**, detectando empalmes para convocatorias.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('availability')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <span>Ver Matriz de Disponibilidad</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Quick Access Upcoming Rehearsals */}
        <div className="executive-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '12px' }}>
              PRÓXIMAS CONVOCATORIAS
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Ensayos & Pases de Asistencia
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Genera códigos QR de pase de lista y asigna ensayos por secciones (Sopranos, Trompetas, Ensamble Tutti).
            </p>
          </div>

          <button
            onClick={() => setActiveTab('rehearsals')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
          >
            <span>Programar Convocatoria</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Slide Modal Editor */}
      {isSlideModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="executive-card" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingSlideId ? 'Editar Anuncio Destacado' : 'Crear Nuevo Anuncio'}
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
                  placeholder="Ej: EVENTO ARTE & CULTURA"
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  TÍTULO DEL ANUNCIO *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Ceremonia de Bienvenida Generación 13"
                  required
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
                  placeholder="Descripción concisa..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px' }}
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
