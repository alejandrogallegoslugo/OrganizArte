import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from './components/Sidebar';
import { Header } from './components/Header';
import { MiTecTopBar } from './components/MiTecTopBar';
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
import { Login } from './components/Login';

import { StudentProfile, RehearsalEvent, RoomBooking, Song, DisciplineType, RehearsalRoom, StudentSchedule, sendActivationEmail } from './shared';
import {
  fetchLiveCompanies,
  createCompanyInNeon,
  updateCompanyInNeon,
  deleteCompanyInNeon,
  fetchLiveCastRoles,
  createCastRoleInNeon,
  deleteCastRoleInNeon,
  fetchLiveStudents,
  createStudentInNeon,
  approveStudentInNeon,
  rejectStudentInNeon,
  fetchLiveSchedules,
  saveStudentScheduleCourseInNeon,
  deleteStudentScheduleCourseInNeon,
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
} from './api';

export const App: React.FC = () => {
  // Auth Session State - Restored from localStorage so refresh stays logged in
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('organizarte_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [currentCompany, setCurrentCompany] = useState<string>('Ensamble Musical Tec');

  // Master Live Database State
  const [companies, setCompanies] = useState<{ id: string; name: string; discipline: string; emoji: string }[]>([]);
  const [casts, setCasts] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [schedules, setSchedules] = useState<StudentSchedule[]>([]);
  const [rooms, setRooms] = useState<RehearsalRoom[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [rehearsals, setRehearsals] = useState<RehearsalEvent[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [campuses, setCampuses] = useState([
    { id: 'b583927a-eb2e-4a3b-8372-5bd09d6f44f3', name: 'Tec Campus Laguna (Torreón)', city: 'Torreón', state: 'Coahuila', isActive: true },
  ]);

  const [loadingDb, setLoadingDb] = useState(true);

  // Load real data from Neon Postgres
  const loadNeonData = async () => {
    setLoadingDb(true);
    try {
      const [liveCompanies, liveCastRoles, liveStudents, liveSchedules, liveRooms, liveBookings, liveRehearsals, liveSongs] = await Promise.all([
        fetchLiveCompanies(),
        fetchLiveCastRoles(currentCompany),
        fetchLiveStudents(),
        fetchLiveSchedules(),
        fetchLiveRooms(),
        fetchLiveBookings(),
        fetchLiveRehearsals(),
        fetchLiveSongs(),
      ]);

      setCompanies(liveCompanies);
      setCasts(liveCastRoles);
      setStudents(liveStudents);
      setSchedules(liveSchedules);
      setRooms(liveRooms);
      setBookings(liveBookings);
      setRehearsals(liveRehearsals);
      setSongs(liveSongs);
    } catch (e) {
      console.error('Error loading Neon data:', e);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadNeonData();
    }
  }, [adminUser]);

  const handleLoginSuccess = (user: { name: string; email: string; role: string }) => {
    setAdminUser(user);
    localStorage.setItem('organizarte_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('organizarte_admin_session');
  };

  // If not logged in, show Protected Login view
  if (!adminUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingApprovalsCount = students.filter((s) => s.status === 'PENDING_APPROVAL').length;

  // Handlers tied to Neon DB with immediate re-sync
  const handleAddCompany = async (name: string, discipline: string, emoji: string) => {
    const newCompany = { id: `comp-${Date.now()}`, name, discipline, emoji };
    setCompanies((prev) => [...prev, newCompany]);
    await createCompanyInNeon(name, discipline, emoji);
    await loadNeonData();
  };

  const handleUpdateCompany = async (id: string, name: string, discipline: string, emoji: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, name, discipline, emoji } : c)));
    await updateCompanyInNeon(id, name, discipline, emoji);
    await loadNeonData();
  };

  const handleDeleteCompany = async (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    await deleteCompanyInNeon(id);
    await loadNeonData();
  };

  const handleAddCastRole = async (showTitle: string, companyName: string, characterName: string, roleCategory: string, requiredDiscipline: string, studentName: string, assignmentType: string) => {
    await createCastRoleInNeon(showTitle, companyName, characterName, roleCategory, requiredDiscipline);
    await loadNeonData();
  };

  const handleDeleteCastRole = async (roleId: string) => {
    await deleteCastRoleInNeon(roleId);
    await loadNeonData();
  };

  const handleAddDirectStudent = async (newStudent: StudentProfile, parsedCourses: any[], validityPeriod: string, validUntil: string) => {
    setStudents((prev) => [newStudent, ...prev]);
    await createStudentInNeon(newStudent);
    if (parsedCourses && parsedCourses.length > 0) {
      for (const c of parsedCourses) {
        await saveStudentScheduleCourseInNeon(newStudent.id, c.dayOfWeek || 'Lunes', c.startTime || '09:00', c.endTime || '11:00', c.name || 'Materia', validityPeriod, validUntil);
      }
    }
    await loadNeonData();
  };

  const handleApproveStudent = async (studentId: string, company: string, discipline: DisciplineType, section: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'ACTIVE', companyName: company, discipline, section } : s))
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

  const handleSaveScheduleCourse = async (studentId: string, dayOfWeek: string, startTime: string, endTime: string, courseName: string) => {
    await saveStudentScheduleCourseInNeon(studentId, dayOfWeek, startTime, endTime, courseName);
    await loadNeonData();
  };

  const handleDeleteScheduleCourse = async (scheduleId: string) => {
    await deleteStudentScheduleCourseInNeon(scheduleId);
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

  const handleAddRehearsal = async (newRehearsal: RehearsalEvent) => {
    setRehearsals((prev) => [newRehearsal, ...prev]);
    await createRehearsalInNeon(newRehearsal);
    await loadNeonData();
  };

  const handleApproveBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'APPROVED' } : b))
    );
    await approveBookingInNeon(bookingId);
    await loadNeonData();
  };

  const handleRejectBooking = async (bookingId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'REJECTED' } : b)));
    await rejectBookingInNeon(bookingId);
    await loadNeonData();
  };

  const handleAddSong = async (newSong: Song) => {
    setSongs((prev) => [newSong, ...prev]);
    await createSongInNeon(newSong);
    await loadNeonData();
  };

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

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <MiTecTopBar
        adminName={adminUser.name}
        students={students}
        pendingApprovalsCount={pendingApprovalsCount}
        onSearchSelect={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
          adminUser={adminUser}
          onLogout={handleLogout}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
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
              onAddDirectStudent={handleAddDirectStudent}
            />
          )}

          {activeTab === 'availability' && (
            <AvailabilityHeatmap
              students={students}
              schedules={schedules}
              onSaveScheduleCourse={handleSaveScheduleCourse}
              onDeleteScheduleCourse={handleDeleteScheduleCourse}
            />
          )}

          {activeTab === 'cast' && (
            <CastManager
              currentCompany={currentCompany}
              students={students}
              casts={casts}
              onAddCastRole={handleAddCastRole}
              onDeleteCastRole={handleDeleteCastRole}
            />
          )}

          {activeTab === 'rehearsals' && (
            <RehearsalScheduler
              rehearsals={rehearsals}
              companyName={currentCompany}
              onAddRehearsal={handleAddRehearsal}
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
              companyName={currentCompany}
              onAddSong={handleAddSong}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceQR rehearsals={rehearsals} students={students} />
          )}

          {activeTab === 'justifications' && <JustificationsManager />}

          {activeTab === 'companies' && (
            <CompanyManager
              currentCampus="Tec Campus Laguna (Torreón)"
              companies={companies}
              onAddCompany={handleAddCompany}
              onUpdateCompany={handleUpdateCompany}
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
  </div>
  );
};
