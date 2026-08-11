import React, { useState } from 'react';
import { Calendar, QrCode, MapPin, Clock, FileText, CheckCircle2, AlertCircle, Sparkles, Building2, Music, Award, ShieldCheck, ChevronRight, Bell, Volume2, Play, BookOpen, Layers } from 'lucide-react';
import { RehearsalEvent, StudentProfile, TimeSlot } from '../shared';

interface StudentAgendaProps {
  student?: StudentProfile;
  rehearsals: RehearsalEvent[];
  academicSlots?: TimeSlot[];
  onOpenQRScanner: (rehearsalId: string) => void;
  onOpenJustificationModal: (rehearsal: RehearsalEvent) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudentAgenda: React.FC<StudentAgendaProps> = ({
  student,
  rehearsals = [],
  academicSlots = [],
  onOpenQRScanner,
  onOpenJustificationModal,
  onNavigateTab,
}) => {
  const [filterView, setFilterView] = useState<'all' | 'rehearsals' | 'academic'>('all');

  const rehearsalsCount = rehearsals.length;
  const academicCount = academicSlots.length;
  const totalCount = rehearsalsCount + academicCount;

  const studentName = student?.name || 'Alumno Tec';

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
            Todos ({totalCount})
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
            🎭 Ensayos ({rehearsalsCount})
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
            ⚪ Clases MiTec ({academicCount})
          </button>
        </div>
      </div>

      {/* REHEARSALS SECTION */}
      {(filterView === 'all' || filterView === 'rehearsals') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>🎭 Ensayos de la Compañía</h3>
            <span className="badge badge-purple">{rehearsals.length} Convocatorias</span>
          </div>

          {rehearsals.length === 0 ? (
            <div className="mitec-card" style={{ textAlign: 'center', padding: '32px 20px', color: '#94a3b8' }}>
              <Calendar style={{ width: '40px', height: '40px', margin: '0 auto 8px auto', opacity: 0.4, color: '#ec4899' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Sin ensayos ni convocatorias programadas</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Tu director o profesor publicará aquí las próximas convocatorias a ensayos.</p>
            </div>
          ) : (
            rehearsals.map((r) => (
              <div key={r.id} className="mitec-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '5px solid #ec4899' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ background: '#fce7f3', color: '#be185d', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                    {r.companyName || 'Arte y Cultura'}
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
            ))
          )}
        </div>
      )}

      {/* ACADEMIC CLASSES SECTION */}
      {(filterView === 'all' || filterView === 'academic') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', color: '#475569', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen style={{ width: '18px', height: '18px', color: '#0033a0' }} /> Horario Académico MiTec ({academicSlots.length})
            </h3>
            <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              Sincronizado IA
            </span>
          </div>

          {academicSlots.length === 0 ? (
            <div
              className="mitec-card"
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                background: '#f8fafc',
                border: '1px border-dashed #cbd5e1',
                borderRadius: '12px'
              }}
            >
              <BookOpen style={{ width: '36px', height: '36px', margin: '0 auto 8px auto', color: '#94a3b8' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Sin materias cargadas</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                Carga tu horario académico de MiTec escaneando tu captura en la pestaña <strong>"IA Horario"</strong>.
              </p>
              {onNavigateTab && (
                <button
                  className="btn-pwa-primary"
                  onClick={() => onNavigateTab('schedule-ai')}
                  style={{ fontSize: '0.8rem', width: 'auto', padding: '8px 16px', margin: '0 auto' }}
                >
                  <Sparkles style={{ width: '16px', height: '16px' }} /> Subir mi Horario con IA
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {academicSlots.map((slot, i) => (
                <div
                  key={slot.id || `slot-${i}`}
                  className="mitec-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderLeft: '4px solid #0033a0',
                    background: '#ffffff',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {slot.dayOfWeek}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                        <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '3px' }} />
                        {slot.startTime} - {slot.endTime} hs
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
                      {slot.courseName}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    MiTec Académico
                  </span>
                </div>
              ))}
            </div>
          )}
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
