import React, { useState } from 'react';
import { Calendar, QrCode, MapPin, Clock, FileText, CheckCircle2, AlertCircle, Sparkles, Building2, Music, Award, ShieldCheck, ChevronRight, Bell, Volume2, Play, BookOpen, Layers } from 'lucide-react';
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
  const [filterView, setFilterView] = useState<'all' | 'rehearsals' | 'academic'>('all');

  // Sample upcoming rehearsals
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

  // Academic Class Schedule (Bloques en Gris importados de MiTec)
  const academicClasses = [
    {
      id: 'acad-1',
      title: 'Cálculo Multivariable',
      code: 'MA1025.101',
      time: '09:00 - 11:00 hs',
      days: 'Lunes y Jueves',
      location: 'Aulas II (Salón 204)',
      professor: 'Dr. Roberto Garza',
    },
    {
      id: 'acad-2',
      title: 'Física Universitaria II',
      code: 'F1012.203',
      time: '11:00 - 13:00 hs',
      days: 'Martes y Viernes',
      location: 'Laboratorio de Ingeniería 102',
      professor: 'Dra. Carmen Salinas',
    },
    {
      id: 'acad-3',
      title: 'Emprendimiento e Innovación',
      code: 'EM2001.301',
      time: '13:30 - 15:00 hs',
      days: 'Lunes y Miércoles',
      location: 'Centro de Innovación B-105',
      professor: 'Mtro. Javier Morales',
    },
  ];

  const studentName = student?.name || 'Alejandro Prueba';
  const matricula = student?.matricula || 'A0123456';
  const company = student?.companyName || 'Ensamble Musical Tec';
  const section = student?.section || 'Piano';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* WIDGET 1: Header Banner */}
      <div className="mitec-card" style={{ background: 'linear-gradient(135deg, #0033a0 0%, #001a5e 100%)', color: '#ffffff', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar style={{ width: '20px', height: '20px', color: '#ec4899' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Calendario de Ensayos & Clases MiTec
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '999px', fontWeight: 800 }}>
            {studentName}
          </span>
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
          Agenda Integrada de Ensayos
        </h2>
        <p style={{ fontSize: '0.82rem', opacity: 0.9 }}>
          Visualiza los ensayas de la Compañía (en color) y tu horario académico de MiTec (bloques en gris).
        </p>

        {/* Filter View Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <button
            onClick={() => setFilterView('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: filterView === 'all' ? '#ffffff' : 'rgba(255,255,255,0.2)',
              color: filterView === 'all' ? '#0033a0' : '#ffffff',
              cursor: 'pointer',
            }}
          >
            Todos ({displayRehearsals.length + academicClasses.length})
          </button>
          <button
            onClick={() => setFilterView('rehearsals')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: filterView === 'rehearsals' ? '#ec4899' : 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            🎭 Ensayos ({displayRehearsals.length})
          </button>
          <button
            onClick={() => setFilterView('academic')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: filterView === 'academic' ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
              color: filterView === 'academic' ? '#0f172a' : '#ffffff',
              cursor: 'pointer',
            }}
          >
            ⚪ Clases MiTec ({academicClasses.length})
          </button>
        </div>
      </div>

      {/* REHEARSALS SECTION (Vibrant Colors) */}
      {(filterView === 'all' || filterView === 'rehearsals') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>🎭 Ensayos de la Compañía</h3>
            <span className="badge badge-purple">{displayRehearsals.length} Convocatorias</span>
          </div>

          {displayRehearsals.map((r) => (
            <div key={r.id} className="mitec-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '5px solid #ec4899' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ background: '#fce7f3', color: '#be185d', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                  {r.companyName}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#0033a0', fontWeight: 800 }}>Convocatoria Confirmada</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>{r.title}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0033a0', fontWeight: 800 }}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  <span>{r.date}</span> | {r.startTime} - {r.endTime} hs
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#f59e0b' }} /> {r.location}
                </div>
              </div>

              {r.description && (
                <p style={{ fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
        </div>
      )}

      {/* ACADEMIC CLASSES SECTION (Subtle Grey Cards - Bloques en Gris) */}
      {(filterView === 'all' || filterView === 'academic') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen style={{ width: '18px', height: '18px', color: '#94a3b8' }} /> Horario Académico MiTec (Bloques en Gris)
            </h3>
            <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', fontWeight: 800, padding: '3px 8px', borderRadius: '999px' }}>
              Sincronizado IA
            </span>
          </div>

          {academicClasses.map((ac) => (
            <div
              key={ac.id}
              className="mitec-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderLeft: '5px solid #94a3b8',
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  ⚪ CLASE ACADÉMICA MITEC
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>
                  {ac.code}
                </span>
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#334155' }}>
                {ac.title}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#475569' }}>
                  <Clock style={{ width: '14px', height: '14px', color: '#64748b' }} /> {ac.time} ({ac.days})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#64748b' }} /> {ac.location}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Profesor: {ac.professor}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Sin Conflicto con Ensayos ✓</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Navigation to IA Scanner */}
      {onNavigateTab && (
        <div
          onClick={() => onNavigateTab('schedule-ai')}
          className="mitec-card"
          style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: '#06b6d4' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1' }}>¿Quieres actualizar tus materias?</div>
              <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>Sube una nueva captura de MiTec con Gemini IA</div>
            </div>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#0284c7' }} />
        </div>
      )}
    </div>
  );
};
