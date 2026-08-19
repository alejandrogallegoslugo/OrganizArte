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
  ShieldCheck,
  CheckCircle2,
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
import { fetchStudentRehearsals, fetchStudentSongs, registerStudentInNeon, fetchStudentProfileByEmail, fetchStudentSchedulesInNeon } from './api';

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
  const [scanningRehearsalId, setScanningRehearsalId] = useState<string | null>(null);
  const [justifyingRehearsal, setJustifyingRehearsal] = useState<RehearsalEvent | null>(null);

  // Load real data from Neon Postgres when logged in
  useEffect(() => {
    if (student) {
      const loadLiveData = async () => {
        try {
          const [liveRehearsals, liveSongs, liveSchedules] = await Promise.all([
            fetchStudentRehearsals(),
            fetchStudentSongs(),
            fetchStudentSchedulesInNeon(student.matricula || student.email || student.id),
          ]);
          setRehearsals(liveRehearsals);
          setSongs(liveSongs);
          setScheduleSlots(liveSchedules);
        } catch (e) {
          console.error('Error fetching live data for student:', e);
        }
      };
      loadLiveData();
    }
  }, [student]);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  const handleRegisterStudent = async (newStudent: StudentProfile) => {
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
      setLoginErrorMessage(`⚠️ Hola ${existing.name}, tu registro (matrícula ${existing.matricula}) está pendiente de validación por el Director.`);
      return false;
    }

    if (existing.status === 'REJECTED') {
      setLoginErrorMessage(`⚠️ Hola ${existing.name}, tu solicitud de registro ha sido rechazada por la Dirección.`);
      return false;
    }

    setStudent(existing);
    localStorage.setItem('organizarte_student_session', JSON.stringify(existing));
    return true;
  };

  const handleLogout = () => {
    setStudent(null);
    localStorage.removeItem('organizarte_student_session');
  };

  const handleRequestBooking = async (b: any) => {
    if (!student) return;
    await createRoomBookingInNeon({
      roomId: b.roomId,
      studentId: student.id,
      studentName: student.name,
      companyName: student.companyName,
      purpose: b.purpose,
      bookingDate: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
    });
    setBookings((prev) => [...prev, { ...b, id: `bk-${Date.now()}`, status: 'PENDING' }]);
  };

  const handleUpdateSlots = (newSlots: TimeSlot[]) => {
    setScheduleSlots(newSlots);
  };

  // If not logged in, show sleek onboarding login card
  if (!student) {
    return (
      <StudentLogin
        onLogin={handleLoginStudent}
        onRegister={handleRegisterStudent}
        errorMessage={loginErrorMessage}
      />
    );
  }

  return (
    <div className="pwa-container">
      {/* Top Header App Bar */}
      <StudentHeader student={student} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* TAB 1: INICIO */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Digital Credentials Card */}
            <MiIDDigitalCard student={student} />

            {/* Account Status Banner */}
            <AccountStatusBanner status={student.status} />

            {/* Quick Action Hub Cards */}
            <div className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="pwa-badge pwa-badge-emerald">🟢 INSCRITO AL SEMESTRE</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {scheduleSlots.length} Materias Cargadas
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {student.companyName}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => setActiveTab('schedule-ai')}
                  className="btn-pwa-primary"
                  style={{ fontSize: '0.82rem', padding: '12px' }}
                >
                  <Sparkles style={{ width: 16, height: 16 }} />
                  <span>Escáner IA</span>
                </button>

                <button
                  onClick={() => setActiveTab('agenda')}
                  className="btn-pwa-secondary"
                  style={{ fontSize: '0.82rem', padding: '12px' }}
                >
                  <Calendar style={{ width: 16, height: 16 }} />
                  <span>Mi Agenda</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENDA */}
        {activeTab === 'agenda' && (
          <StudentAgenda
            rehearsals={rehearsals}
            studentSchedules={scheduleSlots}
            onScanQR={(rehearsalId) => setScanningRehearsalId(rehearsalId)}
            onJustifyAbsence={(rehearsal) => setJustifyingRehearsal(rehearsal)}
          />
        )}

        {/* TAB 3: IA HORARIO */}
        {activeTab === 'schedule-ai' && (
          <ScheduleUploadAI
            studentId={student.matricula || student.email || student.id}
            currentSlots={scheduleSlots}
            onUpdateSlots={handleUpdateSlots}
          />
        )}

        {/* TAB 4: PRÁCTICA */}
        {activeTab === 'practice' && <AudioPracticePlayer songs={songs} />}

        {/* TAB 5: SALONES */}
        {activeTab === 'rooms' && (
          <RoomPassPDF student={student} bookings={bookings} onRequestBooking={handleRequestBooking} />
        )}

        {/* TAB 6: PERFIL */}
        {activeTab === 'profile' && (
          <div className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Perfil Tec Integrante</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Alumno</span>
                <span style={{ fontWeight: 800 }}>{student.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Matrícula</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>{student.matricula}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Correo</span>
                <span style={{ fontWeight: 600 }}>{student.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Disciplina</span>
                <span style={{ fontWeight: 800 }}>{student.discipline}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Campus</span>
                <span style={{ fontWeight: 700 }}>{student.campus}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button className="btn-pwa-secondary" onClick={handleLogout} style={{ color: 'var(--rose-accent)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                <LogOut style={{ width: '16px', height: '16px' }} />
                <span>Cerrar Sesión</span>
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
          bottom: '92px',
          right: '20px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--indigo-accent) 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px var(--primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 900,
        }}
        title="Chat Interno & Inbox"
      >
        <MessageSquare style={{ width: '24px', height: '24px' }} />
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

      {/* PWA Floating Bottom Navigation Bar */}
      <nav className="pwa-bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home style={{ width: '20px', height: '20px' }} />
          <span>Inicio</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          <Calendar style={{ width: '20px', height: '20px' }} />
          <span>Agenda</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'schedule-ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule-ai')}
        >
          <Sparkles style={{ width: '20px', height: '20px' }} />
          <span>IA Horario</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <Music style={{ width: '20px', height: '20px' }} />
          <span>Práctica</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User style={{ width: '20px', height: '20px' }} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};
