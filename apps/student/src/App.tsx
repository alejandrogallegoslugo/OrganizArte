import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Music,
  Building2,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Bot,
  Layers,
  MessageSquare,
  X,
  Send,
} from 'lucide-react';
import { StudentHeader } from './components/StudentHeader';
import { MiIDDigitalCard } from './components/MiIDDigitalCard';
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

  // Accordion state for misServicios@tec
  const [openService, setOpenService] = useState<string | null>('id-digital');

  // TecGPT Assistant Floating Widget state
  const [showBotModal, setShowBotModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: '¡Hola! Soy TECgpt / Asistente OrganizArte Tec. ¿En qué te puedo ayudar con tus ensayos, partituras o salones?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let response = 'Recibido. Puedes consultar la sección de Agenda para ver el salón y hora exacta de tus ensayos.';
      if (userMsg.toLowerCase().includes('horario') || userMsg.toLowerCase().includes('mitec')) {
        response = 'Para subir tu horario de MiTec, ve a la pestaña "IA Horario" y toma captura a tu portal.';
      } else if (userMsg.toLowerCase().includes('partitura') || userMsg.toLowerCase().includes('audio')) {
        response = 'Tus guías de voz y partituras en PDF están disponibles en la sección "Práctica".';
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    }, 800);
  };

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

  const [scanningRehearsalId, setScanningRehearsalId] = useState<string | null>(null);
  const [justifyingRehearsal, setJustifyingRehearsal] = useState<RehearsalEvent | null>(null);

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
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg-dark)', position: 'relative' }}>
      {/* PWA Mobile Header */}
      <StudentHeader student={student} pushEnabled={pushEnabled} setPushEnabled={setPushEnabled} />

      {/* Main Screen Content */}
      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pending Activation Banner if applicable */}
        <AccountStatusBanner student={student} />

        {/* Top Hero: mi ID Digital Credential Card */}
        <MiIDDigitalCard student={student} />

        {/* misServicios@tec Touchable Accordion List */}
        {activeTab === 'agenda' && (
          <div className="mitec-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                misServicios@arteycultura
              </span>
              <Layers style={{ width: '16px', height: '16px', color: '#64748b' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Service 1: mi Horario & IA Scanner (Cyan Strip) */}
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

              {/* Service 2: Ensayos & Llamados (Magenta Strip) */}
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
                    <p style={{ marginBottom: '8px' }}>Revisa horarios, salones asignados y confirma asistencia por QR.</p>
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
        )}

        {/* Tab Views */}
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
          <div className="mitec-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Perfil Tec Integrante</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
              <div><strong>Nombre:</strong> {student.name}</div>
              <div><strong>Matrícula:</strong> <span style={{ color: '#0033a0', fontWeight: 700, fontFamily: 'monospace' }}>{student.matricula}</span></div>
              <div><strong>Correo:</strong> {student.email}</div>
              <div><strong>Compañía:</strong> {student.companyName}</div>
              <div><strong>Disciplina:</strong> {student.discipline}</div>
              <div><strong>Sección:</strong> {student.section}</div>
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

      {/* Floating TECgpt Assistant Bubble */}
      <button
        onClick={() => setShowBotModal(true)}
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '16px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0033a0 0%, #7c3aed 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 6px 20px rgba(0, 51, 160, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 900,
        }}
        title="Asistente TECgpt"
      >
        <Bot style={{ width: '26px', height: '26px' }} />
      </button>

      {/* TECgpt Chat Modal Drawer */}
      {showBotModal && (
        <div className="modal-backdrop" onClick={() => setShowBotModal(false)}>
          <div
            className="mitec-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '400px', height: '480px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 18px', background: '#0033a0', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>TECgpt / Asistente Artístico</span>
              </div>
              <button onClick={() => setShowBotModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? '#0033a0' : '#f1f5f9',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    maxWidth: '82%',
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pregunta sobre ensayos, salones..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '999px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
              <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0033a0', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        </div>
      )}

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
