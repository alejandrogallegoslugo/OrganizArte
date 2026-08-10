import React, { useState } from 'react';
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
} from 'lucide-react';
import { StudentProfile, RehearsalEvent, RoomBooking } from '../shared';

interface DashboardProps {
  students: StudentProfile[];
  rehearsals: RehearsalEvent[];
  bookings: RoomBooking[];
  pendingCount: number;
  setActiveTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  rehearsals,
  bookings,
  pendingCount,
  setActiveTab,
}) => {
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');

  // Hero Announcement Banner Carousel State (Vertical Poster Layout like MiTec)
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      tag: 'EVENTO TEC',
      title: 'Ceremonia de BIENVENIDA GENERACIÓN 13',
      subtitle: 'Celebremos la llegada de una nueva generación de líderes que inspiran.',
      date: 'Lunes 17 de agosto • 16:00 hrs (CDT)',
      location: 'Centro de Congresos, Campus Monterrey',
      bg: 'linear-gradient(160deg, #0284c7 0%, #0033a0 100%)',
    },
    {
      id: 2,
      tag: 'COMPAÑÍA ARTÍSTICA',
      title: 'Audiciones Abiertas Tec 2026',
      subtitle: 'Ensamble Musical, Comedia Musical, Baile y Teatro de Tecnológico de Monterrey.',
      date: 'Viernes 21 de agosto • 15:00 hrs',
      location: 'Foro de Artes Escénicas',
      bg: 'linear-gradient(160deg, #7c3aed 0%, #0033a0 100%)',
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

  // Accordion open state for work@arteycultura card
  const [openSection, setOpenSection] = useState<string | null>('institucion');

  // Widget Cards Customization Engine (+ AGREGAR TARJETA) - Empty by default to avoid duplicate cards!
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Main 3-Column Layout Matching the MiTec Screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) minmax(320px, 380px) minmax(280px, 320px)', gap: '24px', alignItems: 'start' }}>
        
        {/* COLUMN 1: Vertical Announcement Poster Banner Card */}
        <div
          className="mitec-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            background: slides[currentSlide].bg,
            color: '#ffffff',
            padding: '28px 24px',
            minHeight: '460px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px rgba(0,51,160,0.2)',
          }}
        >
          {/* Top Tag & Dots */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              {/* Carousel Dots */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: idx === currentSlide ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '999px',
                      background: idx === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
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
                {slides[currentSlide].tag}
              </span>
            </div>

            {/* Poster Header Text */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em', opacity: 0.9, textTransform: 'uppercase', marginBottom: '4px' }}>
                Tecnológico de Monterrey
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase' }}>
                Líderes del mañana
              </div>
            </div>
          </div>

          {/* Main Title & Details */}
          <div style={{ margin: '20px 0' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '12px', color: '#ffffff' }}>
              {slides[currentSlide].title}
            </h2>
            <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: '16px', lineHeight: 1.4 }}>
              {slides[currentSlide].subtitle}
            </p>
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
              {slides[currentSlide].date}
            </div>
          </div>

          {/* Location Badge & Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.9 }}>
              📍 {slides[currentSlide].location}
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

        {/* COLUMN 2: work@arteycultura Accordion Card (With Colorful Left Strips) */}
        <div className="mitec-card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
          {/* Card Title Header */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Briefcase style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>work@arteycultura</h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Gestión de la Compañía Artística</span>
              </div>
            </div>
            <Layers style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
          </div>

          {/* Accordion Rows with Colorful Left Border Strips */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Row 1: mi Alumnado & Integrantes (Yellow Strip) */}
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
                <span>mi Alumnado & Integrantes</span>
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

            {/* Row 2: mis Ensayos & Llamados Generales (Magenta Strip) */}
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
                <span>mis Ensayos & Llamados Generales</span>
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

            {/* Row 3: mis Salones Tec & Permisos (Cyan Strip) */}
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
                <span>mis Salones Tec & Permisos</span>
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

            {/* Row 4: mi Pase de Lista QR & Asistencia (Emerald Strip) */}
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
                <span>mi Pase de Lista QR & Asistencia</span>
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
