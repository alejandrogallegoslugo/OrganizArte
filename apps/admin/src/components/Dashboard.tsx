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
    tag: 'EVENTO TEC',
    title: 'Ceremonia de BIENVENIDA GENERACIÓN 13',
    subtitle: 'Celebremos la llegada de una nueva generación de líderes que inspiran.',
    date: 'Lunes 17 de agosto • 16:00 hrs (CDT)',
    location: 'Centro de Congresos, Campus Monterrey',
    bg: 'linear-gradient(160deg, #0284c7 0%, #0033a0 100%)',
    imageUrl: '/banner.png',
    ctaText: 'Formulario de Registro',
    ctaUrl: 'https://tec.mx',
  },
  {
    id: 2,
    tag: 'COMPAÑÍA ARTÍSTICA',
    title: 'Audiciones Abiertas Tec 2026',
    subtitle: 'Ensamble Musical, Comedia Musical, Baile y Teatro de Tecnológico de Monterrey.',
    date: 'Viernes 21 de agosto • 15:00 hrs',
    location: 'Foro de Artes Escénicas',
    bg: 'linear-gradient(160deg, #7c3aed 0%, #0033a0 100%)',
    ctaText: 'Registrar Audición',
    ctaUrl: 'https://forms.gle/audiciones',
  },
  {
    id: 3,
    tag: 'RECONOCIMIENTO',
    title: 'Premios EXATEC Trayectoria',
    subtitle: 'Nominaciones abiertas para estudiantes destacados en artes escénicas Tec.',
    date: 'Cierre: 30 de agosto',
    location: 'Nacional Tec',
    bg: 'linear-gradient(160deg, #059669 0%, #0033a0 100%)',
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
  const [showEditSlideModal, setShowEditSlideModal] = useState(false);

  // Form state for creating or editing announcement slides
  const [editingSlideId, setEditingSlideId] = useState<number | string | null>(null);
  const [formTag, setFormTag] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBg, setFormBg] = useState('linear-gradient(160deg, #0284c7 0%, #0033a0 100%)');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaUrl, setFormCtaUrl] = useState('');

  // Save slides to localStorage
  useEffect(() => {
    localStorage.setItem('organizarte_announcements_slides', JSON.stringify(slides));
  }, [slides]);

  // Ensure currentSlide is within bounds
  const validSlideIndex = Math.min(currentSlide, Math.max(0, slides.length - 1));

  // Open modal to edit current slide or create a new slide
  const openEditModalForSlide = (slide?: AnnouncementSlide) => {
    if (slide) {
      setEditingSlideId(slide.id);
      setFormTag(slide.tag);
      setFormTitle(slide.title);
      setFormSubtitle(slide.subtitle);
      setFormDate(slide.date);
      setFormLocation(slide.location);
      setFormBg(slide.bg);
      setFormImageUrl(slide.imageUrl || '');
      setFormCtaText(slide.ctaText || '');
      setFormCtaUrl(slide.ctaUrl || '');
    } else {
      setEditingSlideId(null);
      setFormTag('AVISO ARTÍSTICO');
      setFormTitle('');
      setFormSubtitle('');
      setFormDate('Próximamente');
      setFormLocation('Tec Campus Laguna');
      setFormBg('linear-gradient(160deg, #ec4899 0%, #0033a0 100%)');
      setFormImageUrl('');
      setFormCtaText('');
      setFormCtaUrl('');
    }
    setShowEditSlideModal(true);
  };

  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingSlideId !== null) {
      // Update existing slide
      setSlides((prev) =>
        prev.map((s) =>
          s.id === editingSlideId
            ? {
                ...s,
                tag: formTag,
                title: formTitle,
                subtitle: formSubtitle,
                date: formDate,
                location: formLocation,
                bg: formBg,
                imageUrl: formImageUrl,
                ctaText: formCtaText,
                ctaUrl: formCtaUrl,
              }
            : s
        )
      );
    } else {
      // Create new slide
      const newSlide: AnnouncementSlide = {
        id: Date.now(),
        tag: formTag || 'ANUNCIO',
        title: formTitle,
        subtitle: formSubtitle,
        date: formDate,
        location: formLocation,
        bg: formBg,
        imageUrl: formImageUrl,
        ctaText: formCtaText,
        ctaUrl: formCtaUrl,
      };
      setSlides((prev) => [...prev, newSlide]);
      setCurrentSlide(slides.length);
    }
    setShowEditSlideModal(false);
  };

  const handleDeleteSlide = (id: number | string) => {
    if (slides.length <= 1) {
      alert('Debes mantener al menos 1 aviso en el carrusel.');
      return;
    }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setCurrentSlide(0);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    setSlides(newSlides);
    setCurrentSlide(targetIndex);
  };

  // Accordion open state for work@arteycultura card
  const [openSection, setOpenSection] = useState<string | null>('institucion');

  // Widget Cards Customization Engine (+ AGREGAR TARJETA)
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);

  const toggleWidget = (widgetId: string) => {
    if (activeWidgets.includes(widgetId)) {
      setActiveWidgets(activeWidgets.filter((w) => w !== widgetId));
    } else {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[validSlideIndex] || DEFAULT_SLIDES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Main 3-Column Layout Matching the MiTec Screenshot (Responsive) */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) minmax(320px, 380px) minmax(280px, 320px)', gap: '24px', alignItems: 'start' }}>
        
        {/* COLUMN 1: Vertical Announcement Poster Banner Card */}
        <div
          className="mitec-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            background: activeSlide.imageUrl
              ? `linear-gradient(rgba(0, 51, 160, 0.78), rgba(0, 20, 70, 0.92)), url(${activeSlide.imageUrl}) center/cover no-repeat`
              : activeSlide.bg,
            color: '#ffffff',
            padding: '28px 24px',
            minHeight: '490px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px rgba(0,51,160,0.2)',
          }}
        >
          {/* Admin Edit Overlay Button */}
          <button
            onClick={() => openEditModalForSlide(activeSlide)}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
            title="Editar o crear avisos"
          >
            <Edit3 style={{ width: '13px', height: '13px' }} /> Editar / Crear Banner
          </button>

          {/* Top Tag & Dots */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              {/* Carousel Dots */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: idx === validSlideIndex ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '999px',
                      background: idx === validSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>

              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                {activeSlide.tag}
              </span>
            </div>

            {/* Poster Header Text */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em', opacity: 0.9, textTransform: 'uppercase', marginBottom: '4px' }}>
                Tecnológico de Monterrey
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase' }}>
                Compañía de Arte y Cultura
              </div>
            </div>
          </div>

          {/* Main Title & Details */}
          <div style={{ margin: '16px 0' }}>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, lineHeight: 1.18, marginBottom: '12px', color: '#ffffff' }}>
              {activeSlide.title}
            </h2>
            <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: '16px', lineHeight: 1.4 }}>
              {activeSlide.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: '#f97316',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
                }}
              >
                {activeSlide.date}
              </div>

              {/* Call to Action Button (Only visible if URL is provided!) */}
              {activeSlide.ctaUrl && activeSlide.ctaUrl.trim().length > 0 && (
                <a
                  href={activeSlide.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    color: '#0033a0',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  {activeSlide.ctaText || 'Abrir Enlace / Formulario'} <ExternalLink style={{ width: '15px', height: '15px' }} />
                </a>
              )}
            </div>
          </div>

          {/* Location Badge & Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.9, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {activeSlide.location}
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={prevSlide}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft style={{ width: '18px', height: '18px' }} />
              </button>

              <button
                onClick={nextSlide}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: crear@arteycultura Accordion Card (With Colorful Left Strips) */}
        <div className="mitec-card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
          {/* Card Title Header */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Briefcase style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>crear@arteycultura</h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Gestión de la Compañía Artística</span>
              </div>
            </div>
            <Layers style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
          </div>

          {/* Accordion Rows with Colorful Left Border Strips */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Row 1: Alumnos (Yellow Strip) */}
            <div className="mitec-accordion-item mitec-strip-amber" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setOpenSection(openSection === 'institucion' ? null : 'institucion')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <span>Alumnos</span>
                <ChevronDown style={{ width: '16px', height: '16px', transform: openSection === 'institucion' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openSection === 'institucion' && (
                <div style={{ padding: '0 18px 16px 18px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Integrantes Activos:</span>
                    <strong style={{ color: '#0033a0' }}>{activeStudents.length} alumnos</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Solicitudes Pendientes:</span>
                    <strong style={{ color: '#d97706' }}>{pendingCount} por autorizar</strong>
                  </div>
                  <button className="btn-secondary" onClick={() => setActiveTab('approvals')} style={{ marginTop: '6px', fontSize: '0.8rem', padding: '6px 12px' }}>
                    Ir a Aprobaciones <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Row 2: Agenda (Magenta Strip) */}
            <div className="mitec-accordion-item mitec-strip-magenta" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setOpenSection(openSection === 'ensayos' ? null : 'ensayos')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <span>Agenda</span>
                <ChevronDown style={{ width: '16px', height: '16px', transform: openSection === 'ensayos' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openSection === 'ensayos' && (
                <div style={{ padding: '0 18px 16px 18px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Programados esta semana: <strong style={{ color: '#ec4899' }}>{rehearsals.length} ensayos</strong></span>
                  <button className="btn-secondary" onClick={() => setActiveTab('rehearsals')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    Ver Agenda de Ensayos <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Row 3: Salones (Cyan Strip) */}
            <div className="mitec-accordion-item mitec-strip-cyan" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setOpenSection(openSection === 'salones' ? null : 'salones')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <span>Salones</span>
                <ChevronDown style={{ width: '16px', height: '16px', transform: openSection === 'salones' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openSection === 'salones' && (
                <div style={{ padding: '0 18px 16px 18px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Solicitudes de Salón: <strong style={{ color: '#06b6d4' }}>{bookings.length} registradas</strong></span>
                  <button className="btn-secondary" onClick={() => setActiveTab('rooms')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    Gestionar Salones Tec <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Row 4: Asistencia (Emerald Strip) */}
            <div className="mitec-accordion-item mitec-strip-emerald">
              <button
                onClick={() => setOpenSection(openSection === 'asistencia' ? null : 'asistencia')}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                <span>Asistencia</span>
                <ChevronDown style={{ width: '16px', height: '16px', transform: openSection === 'asistencia' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openSection === 'asistencia' && (
                <div style={{ padding: '0 18px 16px 18px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Generador de Código QR de Ensayo en Vivo</span>
                  <button className="btn-secondary" onClick={() => setActiveTab('attendance')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    Abrir Escáner QR <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Modular Widgets + AGREGAR TARJETA Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Dynamically added widgets */}
          {activeWidgets.includes('agenda') && (
            <div className="mitec-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Próximos Ensayos Tec</h4>
                </div>
                <button onClick={() => toggleWidget('agenda')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('rehearsals')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                Ver Calendario Completo
              </button>
            </div>
          )}

          {activeWidgets.includes('salones') && (
            <div className="mitec-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Salones & Permisos</h4>
                </div>
                <button onClick={() => toggleWidget('salones')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <button className="btn-secondary" onClick={() => setActiveTab('rooms')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>
                Revisar Disponibilidad
              </button>
            </div>
          )}

          {/* Dotted AGREGAR TARJETA Placeholder Card */}
          <div
            className="add-card-placeholder"
            onClick={() => setShowAddCardModal(true)}
            style={{ minHeight: '220px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', color: '#0033a0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Plus style={{ width: '24px', height: '24px' }} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AGREGAR TARJETA
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Personaliza tu Dashboard
            </span>
          </div>

        </div>

      </div>

      {/* ADMIN EDIT SLIDE MODAL */}
      {showEditSlideModal && (
        <div className="modal-backdrop" onClick={() => setShowEditSlideModal(false)}>
          <div
            className="mitec-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '540px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles style={{ width: '20px', height: '20px', color: '#0033a0' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {editingSlideId !== null ? 'Editar Banner de Aviso' : 'Crear Nuevo Banner de Aviso'}
                </h3>
              </div>
              <button onClick={() => setShowEditSlideModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* List of current slides for ordering or deletion */}
            <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Banners en el Carrusel ({slides.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {slides.map((s, idx) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: s.id === editingSlideId ? '#e0f2fe' : '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {idx + 1}. {s.title}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button onClick={() => openEditModalForSlide(s)} style={{ background: 'none', border: 'none', color: '#0033a0', cursor: 'pointer', padding: '2px' }} title="Editar">
                        <Edit3 style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={() => moveSlide(idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? '#cbd5e1' : '#64748b', cursor: 'pointer', padding: '2px' }}>
                        <ArrowUp style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={() => moveSlide(idx, 'down')} disabled={idx === slides.length - 1} style={{ background: 'none', border: 'none', color: idx === slides.length - 1 ? '#cbd5e1' : '#64748b', cursor: 'pointer', padding: '2px' }}>
                        <ArrowDown style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={() => handleDeleteSlide(s.id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }} title="Eliminar">
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Edit Form */}
            <form onSubmit={handleSaveSlideForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Categoría / Etiqueta</label>
                <input
                  type="text"
                  required
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  placeholder="Ej. EVENTO TEC, AUDICIÓN, COMEDIA MUSICAL"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Título del Anuncio</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej. Ceremonia de BIENVENIDA GENERACIÓN 13"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Descripción / Subtítulo</label>
                <textarea
                  rows={2}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Descripción breve del evento o aviso..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Fecha y Hora</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Ej. Lunes 17 de agosto • 16:00 hrs"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Lugar / Sede</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Ej. Centro de Congresos, Campus Laguna"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* CALL TO ACTION BUTTON FIELDS (Form / Enlace Opcional) */}
              <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Link2 style={{ width: '14px', height: '14px' }} /> Call To Action (Botón de Enlace / Formulario Opcional)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Texto del Botón</label>
                    <input
                      type="text"
                      value={formCtaText}
                      onChange={(e) => setFormCtaText(e.target.value)}
                      placeholder="Ej. Llenar Formulario"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>URL del Enlace</label>
                    <input
                      type="url"
                      value={formCtaUrl}
                      onChange={(e) => setFormCtaUrl(e.target.value)}
                      placeholder="Ej. https://forms.gle/..."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  ℹ️ Si dejas la URL vacía, el botón de enlace no se mostrará en el banner.
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Imagen de Fondo (URL o Preset)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Ej. /banner.png o https://..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <button type="button" className="btn-secondary" onClick={() => setFormImageUrl('/banner.png')} style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                    <ImageIcon style={{ width: '14px', height: '14px' }} /> Usar Banner Oficial
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Estilo de Fondo Gradiente</label>
                <select
                  value={formBg}
                  onChange={(e) => setFormBg(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="linear-gradient(160deg, #0284c7 0%, #0033a0 100%)">Azul Tec (Clásico)</option>
                  <option value="linear-gradient(160deg, #7c3aed 0%, #0033a0 100%)">Morado y Azul (Artes)</option>
                  <option value="linear-gradient(160deg, #059669 0%, #0033a0 100%)">Esmeralda y Azul (Gala)</option>
                  <option value="linear-gradient(160deg, #ec4899 0%, #0033a0 100%)">Magenta Neón (Teatro)</option>
                  <option value="linear-gradient(160deg, #f97316 0%, #0033a0 100%)">Naranja Calidez (Convocatoria)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Save style={{ width: '16px', height: '16px' }} /> Guardar Anuncio
                </button>
                <button type="button" className="btn-secondary" onClick={() => openEditModalForSlide()}>
                  + Nuevo Anuncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Widget Selection Modal */}
      {showAddCardModal && (
        <div className="modal-backdrop" onClick={() => setShowAddCardModal(false)}>
          <div
            className="mitec-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '440px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Personalizar Tarjetas</h3>
              <button onClick={() => setShowAddCardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Selecciona las tarjetas adicionales que deseas fijar en tu página principal:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>📅 Próximos Ensayos Tec</span>
                <input
                  type="checkbox"
                  checked={activeWidgets.includes('agenda')}
                  onChange={() => toggleWidget('agenda')}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🏛️ Salones & Permisos Tec</span>
                <input
                  type="checkbox"
                  checked={activeWidgets.includes('salones')}
                  onChange={() => toggleWidget('salones')}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowAddCardModal(false)}
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
