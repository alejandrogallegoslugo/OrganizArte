import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Music, Building2, User, LogOut } from 'lucide-react';
import { StudentHeader } from './components/StudentHeader';
import { AccountStatusBanner } from './components/AccountStatus';
import { StudentAgenda } from './components/StudentAgenda';
import { ScheduleUploadAI } from './components/ScheduleUploadAI';
import { AudioPracticePlayer } from './components/AudioPracticePlayer';
import { RoomPassPDF } from './components/RoomPassPDF';
import { QRScannerModal } from './components/QRScannerModal';
import { JustificationForm } from './components/JustificationForm';
import { StudentLogin } from './components/StudentLogin';

import { STUDENT_SCHEDULE } from './mockData';
import { RehearsalEvent, TimeSlot, RoomBooking, StudentProfile, Song } from './shared';
import {
  registerStudentInNeon,
  fetchStudentProfileByEmail,
  createRoomBookingInNeon,
  fetchStudentRehearsals,
  fetchStudentSongs,
} from './api';

export type StudentPwaTab = 'agenda' | 'schedule-ai' | 'practice' | 'rooms' | 'profile';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudentPwaTab>('agenda');
  
  // Auth Session State - Restored from localStorage so refresh stays logged in
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('organizarte_student_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pushEnabled, setPushEnabled] = useState(true);

  const [scheduleSlots, setScheduleSlots] = useState<TimeSlot[]>(STUDENT_SCHEDULE.slots);
  const [rehearsals, setRehearsals] = useState<RehearsalEvent[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);

  // Load live rehearsals and songs from Neon Postgres
  useEffect(() => {
    async function loadLiveStudentData() {
      try {
        const [liveRehearsals, liveSongs] = await Promise.all([
          fetchStudentRehearsals(),
          fetchStudentSongs(),
        ]);
        setRehearsals(liveRehearsals);
        setSongs(liveSongs);
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    }
    if (student) {
      loadLiveStudentData();
    }
  }, [student]);

  // Auth Handlers with Live Neon DB Persistence & localStorage
  const handleRegisterStudent = async (newStudent: StudentProfile) => {
    const persisted = await registerStudentInNeon(newStudent);
    setStudent(persisted);
    localStorage.setItem('organizarte_student_session', JSON.stringify(persisted));
  };

  const handleLoginStudent = async (emailOrMatricula: string) => {
    const realStudent = await fetchStudentProfileByEmail(emailOrMatricula);
    const loggedUser: StudentProfile = realStudent || {
      id: `std-${Date.now()}`,
      name: emailOrMatricula.includes('@') ? emailOrMatricula.split('@')[0] : 'Alumno Tec',
      email: emailOrMatricula.includes('@') ? emailOrMatricula : 'prueba@tec.mx',
      matricula: emailOrMatricula.startsWith('A') ? emailOrMatricula.toUpperCase() : 'A0123456',
      campus: 'Tec Campus Laguna (Torreón)',
      role: 'STUDENT',
      status: 'ACTIVE',
      companyName: 'Ensamble Musical Tec',
      discipline: 'MUSICA',
      section: 'Piano',
      createdAt: '2026-08-09',
    };
    setStudent(loggedUser);
    localStorage.setItem('organizarte_student_session', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setStudent(null);
    localStorage.removeItem('organizarte_student_session');
  };

  // Modals
  const [scanningRehearsalId, setScanningRehearsalId] = useState<string | null>(null);
  const [justifyingRehearsal, setJustifyingRehearsal] = useState<RehearsalEvent | null>(null);

  // If not logged in, render Student Login/Register view
  if (!student) {
    return (
      <StudentLogin
        onRegisterStudent={handleRegisterStudent}
        onLoginStudent={handleLoginStudent}
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
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* PWA Mobile Header */}
      <StudentHeader student={student} pushEnabled={pushEnabled} setPushEnabled={setPushEnabled} />

      {/* Main Screen Content */}
      <main style={{ padding: '20px 16px' }}>
        {/* Pending Activation Banner if applicable */}
        <AccountStatusBanner student={student} />

        {activeTab === 'agenda' && (
          <StudentAgenda
            student={student}
            rehearsals={rehearsals}
            onOpenQRScanner={(id) => setScanningRehearsalId(id)}
            onOpenJustificationModal={(r) => setJustifyingRehearsal(r)}
            onNavigateTab={(t) => setActiveTab(t as StudentPwaTab)}
          />
        )}

        {activeTab === 'schedule-ai' && (
          <ScheduleUploadAI currentSlots={scheduleSlots} onUpdateSlots={handleUpdateSlots} />
        )}

        {activeTab === 'practice' && <AudioPracticePlayer songs={songs} />}

        {activeTab === 'rooms' && (
          <RoomPassPDF student={student} bookings={bookings} onRequestBooking={handleRequestBooking} />
        )}

        {activeTab === 'profile' && (
          <div className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>Mi Perfil de Integrante</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div><strong>Nombre:</strong> {student.name}</div>
              <div><strong>Matrícula:</strong> <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{student.matricula}</span></div>
              <div><strong>Correo Registrado:</strong> {student.email}</div>
              <div><strong>Compañía / Elenco:</strong> {student.companyName}</div>
              <div><strong>Disciplina:</strong> {student.discipline}</div>
              <div><strong>Sección:</strong> {student.section}</div>
              <div><strong>Campus Tec:</strong> {student.campus}</div>
            </div>

            {/* Status Switcher Mock to test approval flow */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-pwa-secondary"
                onClick={() =>
                  setStudent((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: prev.status === 'ACTIVE' ? 'PENDING_APPROVAL' : 'ACTIVE',
                        }
                      : null
                  )
                }
              >
                Estado actual: {student.status === 'ACTIVE' ? '🟢 ACTIVADO (Probar Pendiente)' : '🟡 PENDIENTE (Probar Activar)'}
              </button>

              <button className="btn-pwa-secondary" onClick={handleLogout} style={{ color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
                <LogOut style={{ width: '16px', height: '16px' }} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </main>

      {/* QR Scanner Camera Modal */}
      {scanningRehearsalId && (
        <QRScannerModal rehearsalId={scanningRehearsalId} onClose={() => setScanningRehearsalId(null)} />
      )}

      {/* Absence Justification Form Modal */}
      {justifyingRehearsal && (
        <JustificationForm rehearsal={justifyingRehearsal} onClose={() => setJustifyingRehearsal(null)} />
      )}

      {/* PWA Bottom Navigation Bar */}
      <nav className="bottom-nav">
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
          className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <Building2 style={{ width: '22px', height: '22px' }} />
          <span>Salones</span>
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
