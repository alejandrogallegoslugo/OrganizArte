import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Music,
  Building2,
  User,
  LogOut,
  MessageSquare,
  Layers,
  ChevronDown,
  Home,
} from 'lucide-react';
import {
  StudentProfile,
  RehearsalEvent,
  RoomBooking,
  Song,
  TimeSlot,
} from './shared';
import { StudentHeader } from './components/StudentHeader';
import { MiIDDigitalCard } from './components/MiIDDigitalCard';
import { StudentAgenda } from './components/StudentAgenda';
import { ScheduleUploadAI } from './components/ScheduleUploadAI';
import { AudioPracticePlayer } from './components/AudioPracticePlayer';
import { RoomPassPDF } from './components/RoomPassPDF';
import { StudentLogin } from './components/StudentLogin';
import { AccountStatusBanner } from './components/AccountStatus';
import { QRScannerModal } from './components/QRScannerModal';
import { JustificationForm } from './components/JustificationForm';
import { StudentChatModal } from './components/StudentChatModal';
import { createRoomBookingInNeon } from './r2Storage';
import { fetchStudentRehearsals, fetchStudentSongs, registerStudentInNeon, fetchStudentProfileByEmail } from './api';

export type StudentPwaTab = 'home' | 'agenda' | 'schedule-ai' | 'practice' | 'rooms' | 'profile';

export const App: React.FC = () => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('organizarte_student_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<StudentPwaTab>('home');
  const [openService, setOpenService] = useState<string | null>('ensayos');
  const [rehearsals, setRehearsals] = useState<RehearsalEvent[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);

  // Floating Chat Interno Modal State
  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  // Load real data from Neon Postgres when logged in
  useEffect(() => {
    if (student) {
      const loadLiveData = async () => {
        try {
          const [liveRehearsals, liveSongs] = await Promise.all([
            fetchStudentRehearsals(),
            fetchStudentSongs(),
          ]);
          setRehearsals(liveRehearsals);
          setSongs(liveSongs);
        } catch (e) {
          console.error('Error fetching live data for student:', e);
        }
      };
      loadLiveData();
    }
  }, [student]);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  const handleRegisterStudent = async (newStudent: StudentProfile) => {
    // Save to Neon DB with PENDING_APPROVAL status
    await registerStudentInNeon(newStudent);
    setLoginErrorMessage(null);
  };

  const handleLoginStudent = async (emailOrMatricula: string): Promise<boolean> => {
    setLoginErrorMessage(null);
    const existing = await fetchStudentProfileByEmail(emailOrMatricula);
    if (!existing) {
      setLoginErrorMessage('No se encontró ningún registro con este correo o matrícula. Por favor completa el formulario de registro.');
      return false;
    }

    if (existing.status === 'PENDING_APPROVAL') {
      setLoginErrorMessage(`⚠️ Hola ${existing.name}, tu registro (matrícula ${existing.matricula}) está pendiente de validación y autorización por el Administrador.`);
      return false;
    }

    if (existing.status === 'REJECTED') {
      setLoginErrorMessage('❌ Tu registro ha sido rechazado. Ponte en contacto con la Dirección de Arte y Cultura.');
      return false;
    }

    // Status is ACTIVE
    setStudent(existing);
    localStorage.setItem('organizarte_student_session', JSON.stringify(existing));
    return true;
  };

  const handleLogout = () => {
    setStudent(null);
    setLoginErrorMessage(null);
    localStorage.removeItem('organizarte_student_session');
  };

  const [scanningRehearsalId, setScanningRehearsalId] = useState<string | null>(null);
  const [justifyingRehearsal, setJustifyingRehearsal] = useState<RehearsalEvent | null>(null);

  if (!student) {
    return (
      <StudentLogin
        onRegisterStudent={handleRegisterStudent}
        onLoginStudent={handleLoginStudent}
        loginErrorMessage={loginErrorMessage}
      />
    );
  }

  const handleUpdateSlots = (newSlots: TimeSlot[]) => {
    setScheduleSlots(newSlots);
  };

  const handleRequestBooking = async (newBooking: RoomBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    await createRoomBookingInNeon(newBooking);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg-dark)', position: 'relative', paddingBottom: '70px' }}>
      {/* PWA Mobile Header */}
      <StudentHeader student={student} pushEnabled={pushEnabled} setPushEnabled={setPushEnabled} />

      {/* Main Screen Content */}
      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pending Activation Banner if applicable */}
        <AccountStatusBanner student={student} />

        {/* TAB 1: INICIO (Home Screen with Credential & Services) */}
        {activeTab === 'home' && (
          <>
            {/* Top Hero: mi ID Digital Credential Card */}
            <MiIDDigitalCard student={student} />

            {/* servicios@arteycultura Touchable Accordion List */}
            <div className="mitec-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  servicios@arteycultura
                </span>
                <Layers style={{ width: '16px', height: '16px', color: '#64748b' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Service 1: Horario & IA Scanner (Cyan Strip) */}
                <div className="mitec-accordion-item mitec-strip-cyan" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => setOpenService(openService === 'horario' ? null : 'horario')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: '#0f172a',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
                      <span>Horario & IA Scanner</span>
                    </div>
                    <ChevronDown style={{ width: '16px', height: '16px', transform: openService === 'horario' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {openService === 'horario' && (
                    <div style={{ padding: '0 16px 14px 16px', fontSize: '0.82rem', color: '#64748b' }}>
                      <p style={{ marginBottom: '8px' }}>Sube la captura de tu horario de MiTec para detectar horas libres automáticamente.</p>
                      <button className="btn-pwa-primary" onClick={() => setActiveTab('schedule-ai')} style={{ fontSize: '0.82rem', padding: '10px' }}>
                        Cargar Captura de Horario
                      </button>
                    </div>
                  )}
                </div>

                {/* Service 2: Ensayos & Agenda (Magenta Strip) */}
                <div className="mitec-accordion-item mitec-strip-magenta" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => setOpenService(openService === 'ensayos' ? null : 'ensayos')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: '#0f172a',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar style={{ width: '16px', height: '16px', color: '#ec4899' }} />
                      <span>Ensayos & Agenda</span>
                    </div>
                    <ChevronDown style={{ width: '16px', height: '16px', transform: openService === 'ensayos' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {openService === 'ensayos' && (
                    <div style={{ padding: '0 16px 14px 16px', fontSize: '0.82rem', color: '#64748b' }}>
                      <p style={{ marginBottom: '8px' }}>Revisa el calendario completo de ensayos, llamados generales y confirma asistencia por QR.</p>
                      <button className="btn-pwa-primary" onClick={() => setActiveTab('agenda')} style={{ fontSize: '0.82rem', padding: '10px' }}>
                        Ver Calendario de Ensayos
                      </button>
                    </div>
                  )}
                </div>

                {/* Service 3: Repertorio & Audio Player (Purple Strip) */}
                <div className="mitec-accordion-item mitec-strip-purple">
                  <button
                    onClick={() => setOpenService(openService === 'repertorio' ? null : 'repertorio')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: '#0f172a',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Music style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                      <span>Repertorio & Audio</span>
                    </div>
                    <ChevronDown style={{ width: '16px', height: '16px', transform: openService === 'repertorio' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {openService === 'repertorio' && (
                    <div style={{ padding: '0 16px 14px 16px', fontSize: '0.82rem', color: '#64748b' }}>
                      <p style={{ marginBottom: '8px' }}>Escucha tus maquetas y guías de audio aisladas por voz o instrumento.</p>
                      <button className="btn-pwa-secondary" onClick={() => setActiveTab('practice')} style={{ fontSize: '0.82rem', padding: '10px' }}>
                        Abrir Reproductor de Práctica
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Welcome Greeting Banner Card */}
            <div className="mitec-card" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%)', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0033a0', textTransform: 'uppercase', marginBottom: '4px' }}>
                💙 TEC DE MONTERREY • ARTE Y CULTURA
              </div>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>¡Hola, {student.name}!</h2>
              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                {student.discipline || 'Arte y Cultura'} ({student.matricula})
              </p>
            </div>
          </>
        )}

        {/* TAB 2: AGENDA INDEPENDIENTE (Dedicated Rehearsals & Calendar View) */}
        {activeTab === 'agenda' && (
          <StudentAgenda
            student={student}
            rehearsals={rehearsals}
            academicSlots={scheduleSlots}
            onOpenQRScanner={(id) => setScanningRehearsalId(id)}
            onOpenJustificationModal={(r) => setJustifyingRehearsal(r)}
            onNavigateTab={(t) => setActiveTab(t as StudentPwaTab)}
          />
        )}

        {/* TAB 3: IA HORARIO */}
        {activeTab === 'schedule-ai' && (
          <ScheduleUploadAI studentId={student.id} currentSlots={scheduleSlots} onUpdateSlots={handleUpdateSlots} />
        )}

        {/* TAB 4: PRÁCTICA */}
        {activeTab === 'practice' && <AudioPracticePlayer songs={songs} />}

        {/* TAB 5: SALONES */}
        {activeTab === 'rooms' && (
          <RoomPassPDF student={student} bookings={bookings} onRequestBooking={handleRequestBooking} />
        )}

        {/* TAB 6: PERFIL */}
        {activeTab === 'profile' && (
          <div className="mitec-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Perfil Tec Integrante</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
              <div><strong>Nombre:</strong> {student.name}</div>
              <div><strong>Matrícula:</strong> <span style={{ color: '#0033a0', fontWeight: 700, fontFamily: 'monospace' }}>{student.matricula}</span></div>
              <div><strong>Correo:</strong> {student.email}</div>
              <div><strong>Disciplina:</strong> {student.discipline}</div>
              <div><strong>Campus:</strong> {student.campus}</div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-pwa-secondary" onClick={handleLogout} style={{ color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
                <LogOut style={{ width: '16px', height: '16px' }} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Interno Bubble Button */}
      <button
        onClick={() => setShowChatModal(true)}
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '16px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0033a0 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 6px 20px rgba(0, 51, 160, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 900,
        }}
        title="Chat Interno & Inbox"
      >
        <MessageSquare style={{ width: '26px', height: '26px' }} />
      </button>

      {/* Real-time Internal Chat Modal Drawer */}
      {showChatModal && (
        <StudentChatModal student={student} onClose={() => setShowChatModal(false)} />
      )}

      {/* QR Scanner Camera Modal */}
      {scanningRehearsalId && (
        <QRScannerModal rehearsalId={scanningRehearsalId} onClose={() => setScanningRehearsalId(null)} />
      )}

      {/* Absence Justification Form Modal */}
      {justifyingRehearsal && (
        <JustificationForm rehearsal={justifyingRehearsal} onClose={() => setJustifyingRehearsal(null)} />
      )}

      {/* PWA Bottom Navigation Bar with "Inicio" as Tab 1 */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home style={{ width: '22px', height: '22px' }} />
          <span>Inicio</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          <Calendar style={{ width: '22px', height: '22px' }} />
          <span>Agenda</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'schedule-ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule-ai')}
        >
          <Sparkles style={{ width: '22px', height: '22px' }} />
          <span>IA Horario</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <Music style={{ width: '22px', height: '22px' }} />
          <span>Práctica</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User style={{ width: '22px', height: '22px' }} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

