import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PendingApprovals } from './components/PendingApprovals';
import { AvailabilityHeatmap } from './components/AvailabilityHeatmap';
import { RehearsalScheduler } from './components/RehearsalScheduler';
import { RoomManager } from './components/RoomManager';
import { SongLibrary } from './components/SongLibrary';
import { AttendanceQR } from './components/AttendanceQR';
import { JustificationsManager } from './components/JustificationsManager';
import { CompanyManager } from './components/CompanyManager';
import { CampusManager } from './components/CampusManager';
import { CastManager } from './components/CastManager';
import { ChatInternoManager } from './components/ChatInternoManager';
import { Login } from './components/Login';
import {
  StudentProfile,
  RehearsalEvent,
  RoomBooking,
  Song,
  StudentSchedule,
} from './shared';
import {
  fetchLiveStudents,
  approveStudentInNeon,
  rejectStudentInNeon,
  fetchLiveSchedules,
  saveStudentScheduleCourseInNeon,
  deleteStudentScheduleCourseInNeon,
  clearStudentSchedulesInNeon,
  fetchLiveRooms,
  createRoomInNeon,
  updateRoomInNeon,
  deleteRoomInNeon,
  fetchLiveBookings,
  approveBookingInNeon,
  rejectBookingInNeon,
  fetchLiveRehearsals,
  createRehearsalInNeon,
  fetchLiveSongs,
  createSongInNeon,
  deleteStudentInNeon,
  createStudentInNeon,
  fetchLiveCompanies,
  createCompanyInNeon,
  updateCompanyInNeon,
  deleteCompanyInNeon,
  fetchLiveCastRoles,
  createCastRoleInNeon,
  deleteCastRoleInNeon,
} from './api';

export const App: React.FC = () => {
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('organizarte_admin_session');
      return saved ? JSON.parse(saved) : { name: 'Prof. Alejandro Gallegos', email: 'admin@tec.mx', role: 'ADMIN' };
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [currentCompany, setCurrentCompany] = useState('Ensamble Musical Tec');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Live Database States
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [schedules, setSchedules] = useState<StudentSchedule[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [rehearsals, setRehearsals] = useState<RehearsalEvent[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string; discipline: string; emoji: string }[]>([]);
  const [castShows, setCastShows] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState<boolean>(false);

  // Load Real Data from Neon DB
  const loadNeonData = async () => {
    setLoadingDb(true);
    try {
      const [stData, schData, rmData, bkData, rhData, sgData, cpData, crData] = await Promise.all([
        fetchLiveStudents(),
        fetchLiveSchedules(),
        fetchLiveRooms(),
        fetchLiveBookings(),
        fetchLiveRehearsals(),
        fetchLiveSongs(),
        fetchLiveCompanies(),
        fetchLiveCastRoles(),
      ]);

      setStudents(stData);
      setSchedules(schData);
      setRooms(rmData);
      setBookings(bkData);
      setRehearsals(rhData);
      setSongs(sgData);

      if (cpData && cpData.length > 0) {
        setCompanies(cpData);
      }
      if (crData && crData.length > 0) {
        setCastShows(crData);
      }
    } catch (err) {
      console.error('Error fetching Neon database:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadNeonData();
    }
  }, [adminUser]);

  const handleLogin = (user: { name: string; email: string; role: string }) => {
    setAdminUser(user);
    localStorage.setItem('organizarte_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('organizarte_admin_session');
  };

  if (!adminUser) {
    return <Login onLogin={handleLogin} />;
  }

  const sendActivationEmail = (studentName: string, studentEmail: string, company: string, discipline: string) => {
    const subject = encodeURIComponent(`🎉 Tu cuenta en OrganizArte Tec ha sido Activada — ${company}`);
    const body = encodeURIComponent(
      `Hola ${studentName},\n\n` +
      `¡Buenas noticias! Tu registro en la plataforma OrganizArte de la Dirección de Arte y Cultura ha sido APROBADO Y ACTIVADO por el Profesor Alejandro Gallegos.\n\n` +
      `📌 Compañía / Elenco: ${company}\n` +
      `🎭 Disciplina: ${discipline}\n` +
      `🌐 Portal Alumnos PWA: https://organizarte-app.pages.dev\n\n` +
      `Ya puedes iniciar sesión con tu correo (${studentEmail}) o matrícula para consultar tus convocatorias a ensayos, partituras y pases de salones DAE.\n\n` +
      `Atentamente,\n` +
      `Dirección de Arte y Cultura\n` +
      `Tec de Monterrey`
    );
    window.open(`mailto:${studentEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const pendingApprovalsCount = students.filter((s) => s.status === 'PENDING_APPROVAL').length;

  const handleApproveStudent = async (studentId: string, company: string, discipline: string, section: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: 'ACTIVE', companyName: company, discipline, section } : s
      )
    );
    await approveStudentInNeon(studentId, company, discipline, section);
    await loadNeonData();

    const s = students.find((x) => x.id === studentId);
    if (s) sendActivationEmail(s.name, s.email, company, discipline);
  };

  const handleRejectStudent = async (studentId: string) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'REJECTED' } : s)));
    await rejectStudentInNeon(studentId);
    await loadNeonData();
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    await deleteStudentInNeon(studentId);
    await loadNeonData();
  };

  const handleAddDirectStudent = async (newStudent: StudentProfile) => {
    setStudents((prev) => [newStudent, ...prev]);
    await createStudentInNeon(newStudent);
    await loadNeonData();
  };

  const handleSaveScheduleCourse = async (studentId: string, dayOfWeek: string, startTime: string, endTime: string, courseName: string, periodName?: string, validUntil?: string) => {
    await saveStudentScheduleCourseInNeon(studentId, dayOfWeek, startTime, endTime, courseName, periodName, validUntil);
    await loadNeonData();
  };

  const handleDeleteScheduleCourse = async (scheduleId: string) => {
    await deleteStudentScheduleCourseInNeon(scheduleId);
    await loadNeonData();
  };

  const handleClearStudentSchedules = async (studentId: string) => {
    await clearStudentSchedulesInNeon(studentId);
    await loadNeonData();
  };

  const handleAddRoom = async (name: string, building: string, capacity: number, equipment: string[]) => {
    await createRoomInNeon(name, building, capacity, equipment);
    await loadNeonData();
  };

  const handleUpdateRoom = async (id: string, name: string, building: string, capacity: number, equipment: string[]) => {
    await updateRoomInNeon(id, name, building, capacity, equipment);
    await loadNeonData();
  };

  const handleDeleteRoom = async (roomId: string) => {
    await deleteRoomInNeon(roomId);
    await loadNeonData();
  };

  const handleApproveBooking = async (bookingId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'APPROVED' } : b)));
    await approveBookingInNeon(bookingId);
    await loadNeonData();
  };

  const handleRejectBooking = async (bookingId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'REJECTED' } : b)));
    await rejectBookingInNeon(bookingId);
    await loadNeonData();
  };

  const handleCreateRehearsal = async (r: RehearsalEvent) => {
    setRehearsals((prev) => [r, ...prev]);
    await createRehearsalInNeon(r);
    await loadNeonData();
  };

  const handleCreateSong = async (s: Song) => {
    setSongs((prev) => [s, ...prev]);
    await createSongInNeon(s);
    await loadNeonData();
  };

  const handleAddCompany = async (name: string, discipline: string, emoji: string) => {
    await createCompanyInNeon(name, discipline, emoji);
    await loadNeonData();
  };

  const handleEditCompany = async (id: string, name: string, discipline: string, emoji: string) => {
    await updateCompanyInNeon(id, name, discipline, emoji);
    await loadNeonData();
  };

  const handleDeleteCompany = async (id: string) => {
    await deleteCompanyInNeon(id);
    await loadNeonData();
  };

  const handleAddCastRole = async (showTitle: string, companyName: string, characterName: string, roleCategory: string, requiredDiscipline: string) => {
    await createCastRoleInNeon(showTitle, companyName, characterName, roleCategory, requiredDiscipline);
    await loadNeonData();
  };

  const handleDeleteCastRole = async (roleId: string) => {
    await deleteCastRoleInNeon(roleId);
    await loadNeonData();
  };

  const [campuses, setCampuses] = useState([
    { id: '1', name: 'Tec Campus Laguna (Torreón)', city: 'Torreón', state: 'Coahuila', isActive: true },
    { id: '2', name: 'Tec Campus Monterrey', city: 'Monterrey', state: 'Nuevo León', isActive: false },
  ]);

  const handleAddCampus = (name: string, city: string, state: string) => {
    const newCampus = {
      id: `camp-${Date.now()}`,
      name,
      city,
      state,
      isActive: true,
    };
    setCampuses((prev) => [newCampus, ...prev]);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        adminUser={adminUser}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          currentCompany={currentCompany}
          setCurrentCompany={setCurrentCompany}
          companies={companies}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />

        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {loadingDb && (
            <div style={{ padding: '12px 20px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#38bdf8', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ Sincronizando datos del sistema...
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              rehearsals={rehearsals}
              bookings={bookings}
              pendingCount={pendingApprovalsCount}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'approvals' && (
            <PendingApprovals
              students={students}
              onApproveStudent={handleApproveStudent}
              onRejectStudent={handleRejectStudent}
              onDeleteStudent={handleDeleteStudent}
              onAddDirectStudent={handleAddDirectStudent}
            />
          )}

          {activeTab === 'availability' && (
            <AvailabilityHeatmap
              students={students}
              schedules={schedules}
              onSaveScheduleCourse={handleSaveScheduleCourse}
              onDeleteScheduleCourse={handleDeleteScheduleCourse}
              onClearStudentSchedules={handleClearStudentSchedules}
            />
          )}

          {activeTab === 'chat' && (
            <ChatInternoManager students={students} adminUser={adminUser} />
          )}

          {activeTab === 'cast' && (
            <CastManager
              shows={castShows}
              onAddRole={handleAddCastRole}
              onDeleteRole={handleDeleteCastRole}
            />
          )}

          {activeTab === 'rehearsals' && (
            <RehearsalScheduler
              rehearsals={rehearsals}
              onCreateRehearsal={handleCreateRehearsal}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomManager
              rooms={rooms}
              bookings={bookings}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onAddRoom={handleAddRoom}
              onUpdateRoom={handleUpdateRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {activeTab === 'songs' && (
            <SongLibrary
              songs={songs}
              onCreateSong={handleCreateSong}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceQR rehearsals={rehearsals} />
          )}

          {activeTab === 'justifications' && (
            <JustificationsManager />
          )}

          {activeTab === 'companies' && (
            <CompanyManager
              companies={companies}
              onAddCompany={handleAddCompany}
              onEditCompany={handleEditCompany}
              onDeleteCompany={handleDeleteCompany}
            />
          )}

          {activeTab === 'campuses' && (
            <CampusManager
              campuses={campuses}
              onAddCampus={handleAddCampus}
            />
          )}
        </main>
      </div>
    </div>
  );
};
