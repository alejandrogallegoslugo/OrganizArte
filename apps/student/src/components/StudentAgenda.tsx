import React from 'react';
import { Calendar, QrCode, MapPin, Clock, FileText, CheckCircle2, AlertCircle, Sparkles, Building2, Music, Award, ShieldCheck, ChevronRight, Bell, Volume2, Play } from 'lucide-react';
import { RehearsalEvent, StudentProfile } from '../shared';

interface StudentAgendaProps {
  student?: StudentProfile;
  rehearsals: RehearsalEvent[];
  onOpenQRScanner: (rehearsalId: string) => void;
  onOpenJustificationModal: (rehearsal: RehearsalEvent) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudentAgenda: React.FC<StudentAgendaProps> = ({
  student,
  rehearsals,
  onOpenQRScanner,
  onOpenJustificationModal,
  onNavigateTab,
}) => {
  // Sample upcoming rehearsals if database has 0 rehearsals yet
  const displayRehearsals: RehearsalEvent[] = rehearsals.length > 0 ? rehearsals : [
    {
      id: 'reh-demo-1',
      title: '🎭 Ensayo General Tutti & Ensamble Vocal',
      companyName: student?.companyName || 'Ensamble Musical Tec',
      discipline: 'TEATRO_MUSICAL',
      targetSections: ['Tutti', 'Vocal', 'Música'],
      date: '2026-08-15',
      startTime: '16:00',
      endTime: '19:00',
      location: 'Salón de Ensamble A-101 (DAE)',
      description: 'Lectura completa de partituras del Acto 1 y montaje de voces principales.',
      qrCheckInCode: 'TEC-REH-ACTO1'
    },
    {
      id: 'reh-demo-2',
      title: '🎺 Seccional de Metales & Madera',
      companyName: student?.companyName || 'Ensamble Musical Tec',
      discipline: 'MUSICA',
      targetSections: ['Vientos', 'Percusión'],
      date: '2026-08-18',
      startTime: '17:00',
      endTime: '18:30',
      location: 'Estudio de Canto C-05',
      description: 'Ajuste de dinámicas y afinación seccional.',
      qrCheckInCode: 'TEC-REH-SECC'
    }
  ];

  const studentName = student?.name || 'Alejandro Prueba';
  const matricula = student?.matricula || 'A0123456';
  const company = student?.companyName || 'Ensamble Musical Tec';
  const section = student?.section || 'Piano';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* WIDGET 1: Tec Borrego Artístico Profile Header */}
      <div className="pwa-card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)', border: '1px solid rgba(2, 132, 199, 0.4)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>💙</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tec de Monterrey • Arte y Cultura
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', background: 'rgba(5, 150, 105, 0.2)', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
            INTEGRANTE ACTIVO
          </span>
        </div>

        <h2 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 800, marginBottom: '4px' }}>
          ¡Hola, {studentName}!
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          {company} • <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{section}</span> (<span style={{ fontFamily: 'monospace' }}>{matricula}</span>)
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--primary)' }} /> Campus Laguna
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock style={{ width: '14px', height: '14px', color: 'var(--accent-amber)' }} /> Vigencia: Ago - Dic 2026
          </div>
        </div>
      </div>

      {/* WIDGET 2: Status Horario MiTec & Disponibilidad IA */}
      <div className="pwa-card" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Sparkles style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>
              ESCÁNER MITEC CON IA
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 800 }}>
              Horario Registrado (7 Clases Extraídas)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tus bloques de disponibilidad están sincronizados.
            </div>
          </div>
        </div>

        {onNavigateTab && (
          <button onClick={() => onNavigateTab('schedule-ai')} className="btn-pwa-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
            Ver Horario <ChevronRight style={{ width: '14px', height: '14px' }} />
          </button>
        )}
      </div>

      {/* WIDGET 3: Next Rehearsal Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>Próximos Ensayos Oficiales</h3>
        <span className="badge badge-purple">{displayRehearsals.length} Convocatorias</span>
      </div>

      {displayRehearsals.map((r) => (
        <div key={r.id} className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>{r.companyName}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>Convocatoria Confirmada</span>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>{r.title}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
              <Clock style={{ width: '16px', height: '16px' }} />
              <span>{r.date}</span> | {r.startTime} - {r.endTime} hs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '16px', height: '16px', color: '#f59e0b' }} /> {r.location}
            </div>
          </div>

          {r.description && (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'var(--bg-dark)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {r.description}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
            <button className="btn-pwa-primary" onClick={() => onOpenQRScanner(r.id)}>
              <QrCode style={{ width: '18px', height: '18px' }} /> Escanear QR
            </button>
            <button className="btn-pwa-secondary" onClick={() => onOpenJustificationModal(r)}>
              <FileText style={{ width: '16px', height: '16px' }} /> Justificar
            </button>
          </div>
        </div>
      ))}

      {/* WIDGET 4: Quick Salones & Practice Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => onNavigateTab && onNavigateTab('rooms')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Building2 style={{ color: 'var(--accent-purple)', width: '22px', height: '22px' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', fontWeight: 800 }}>DAE PERMISO</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 800 }}>Salones Tec</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Solicita ensayo & obtén pase QR de caseta.</div>
        </div>

        <div className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => onNavigateTab && onNavigateTab('practice')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Music style={{ color: 'var(--primary)', width: '22px', height: '22px' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>AUDIO GUÍAS</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 800 }}>Mi Repertorio</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Practica con partituras y maquetas MP3.</div>
        </div>
      </div>

      {/* WIDGET 5: Official Tec Announcements Feed */}
      <div className="pwa-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Bell style={{ color: 'var(--accent-amber)', width: '18px', height: '18px' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>Noticias Arte y Cultura Tec</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>CONVOCATORIA ABIERTA</span>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, marginTop: '2px' }}>🎭 Audiciones Comedia Musical 2026</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Regístrate con tu director para participar en el reparto del semestre.</p>
          </div>

          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', fontWeight: 800 }}>MASTERCLASS EXCLUSIVA</span>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, marginTop: '2px' }}>🎺 Taller Seccional Tec Campus Laguna</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Este viernes a las 16:00 hs en el Pabellón Cultural.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
