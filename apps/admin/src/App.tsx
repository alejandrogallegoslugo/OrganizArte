import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from './components/Sidebar';
import { MiTecTopBar } from './components/MiTecTopBar';
import { Dashboard } from './components/Dashboard';
import { StudentManager } from './components/StudentManager';
import { AvailabilityHeatmap } from './components/AvailabilityHeatmap';
import { RehearsalScheduler } from './components/RehearsalScheduler';
import { RoomManager } from './components/RoomManager';
import { SongLibrary } from './components/SongLibrary';
import { AttendanceQR } from './components/AttendanceQR';
import { JustificationsManager } from './components/JustificationsManager';
import { CompanyManager } from './components/CompanyManager';
import { CampusManager } from './components/CampusManager';
import { ProjectManager } from './components/ProjectManager';
import { Login } from './components/Login';

import { StudentProfile, RehearsalEvent, RoomBooking, Song, RehearsalRoom, StudentSchedule, ArtisticProject } from './shared';
import { INITIAL_PROJECTS } from './mockData';
import {
  fetchLiveCompanies,
  fetchLiveCastRoles,
  fetchLiveStudents,
  fetchLiveSchedules,
  fetchLiveRooms,
  fetchLiveBookings,
  fetchLiveRehearsals,
  fetchLiveSongs,
} from './api';

export const App: React.FC = () => {
  // Auth Session State
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

  // Master Projects State
  const [projects, setProjects] = useState<ArtisticProject[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-wishes-2026');

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

  // Load data
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
      console.error('Error loading data:', e);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadNeonData();
    }
  }, [adminUser, currentCompany]);

  const handleLogin = (user: { name: string; email: string; role: string }) => {
    setAdminUser(user);
    localStorage.setItem('organizarte_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('organizarte_admin_session');
  };

  if (!adminUser) {
    return <Login onLogin={handleLogin} onLoginSuccess={handleLogin} />;
  }

  const pendingApprovalsCount = students.filter((s) => s.status === 'PENDING_APPROVAL').length;

  const handleApproveStudent = async (id: string) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'ACTIVE' } : s)));
  };

  const handleRejectStudent = async (id: string) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s)));
  };

  const handleAddDirectStudent = async (newStudent: StudentProfile) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleSaveScheduleCourse = async (studentId: string, course: any) => {
    setSchedules((prev) => {
      const existing = prev.find((s) => s.studentId === studentId);
      if (existing) {
        return prev.map((s) =>
          s.studentId === studentId ? { ...s, slots: [...(s as any).slots, course] } : s
        );
      }
      return [...prev, { id: `sch-${Date.now()}`, studentId, slots: [course] } as any];
    });
  };

  const handleDeleteScheduleCourse = async (studentId: string, slotId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, slots: (s as any).slots.filter((x: any) => x.id !== slotId) } : s
      )
    );
  };

  const handleAddCastRole = async (roleName: string, actorName: string, notes?: string) => {
    setCasts((prev) => [...prev, { id: `cast-${Date.now()}`, roleName, actorName, notes }]);
  };

  const handleDeleteCastRole = async (id: string) => {
    setCasts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddRehearsal = async (reh: RehearsalEvent) => {
    setRehearsals((prev) => [reh, ...prev]);
  };

  const handleApproveBooking = async (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'APPROVED', qrPermissionCode: `PERMISO-${Math.floor(Math.random()*900000+100000)}` } : b)));
  };

  const handleRejectBooking = async (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'REJECTED' } : b)));
  };

  const handleAddRoom = async (room: RehearsalRoom) => {
    setRooms((prev) => [...prev, room]);
  };

  const handleUpdateRoom = async (room: RehearsalRoom) => {
    setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)));
  };

  const handleDeleteRoom = async (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddSong = async (song: Song) => {
    setSongs((prev) => [song, ...prev]);
  };

  const handleAddCompany = async (company: { name: string; discipline: string; emoji: string }) => {
    setCompanies((prev) => [...prev, { id: `comp-${Date.now()}`, ...company }]);
  };

  const handleUpdateCompany = async (company: { id: string; name: string; discipline: string; emoji: string }) => {
    setCompanies((prev) => prev.map((c) => (c.id === company.id ? company : c)));
  };

  const handleDeleteCompany = async (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCampus = async (name: string, city: string, state: string) => {
    setCampuses((prev) => [...prev, { id: `camp-${Date.now()}`, name, city, state, isActive: true }]);
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <MiTecTopBar
        adminName={adminUser.name}
        students={students}
        pendingApprovalsCount={pendingApprovalsCount}
        onSearchSelect={(tab) => setActiveTab(tab as AdminTab)}
        onLogout={handleLogout}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
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
              <StudentManager
                students={students}
                schedules={schedules}
                projects={projects}
                onApproveStudent={handleApproveStudent}
                onRejectStudent={handleRejectStudent}
                onAddDirectStudent={handleAddDirectStudent}
                onUpdateStudent={(updatedStd, updatedProjectIds) => {
                  setStudents((prev) => prev.map((s) => (s.id === updatedStd.id ? updatedStd : s)));
                  if (updatedProjectIds) {
                    setProjects((prev) =>
                      prev.map((p) => {
                        const shouldBeEnrolled = updatedProjectIds.includes(p.id);
                        const isEnrolled = p.enrolledStudentIds.includes(updatedStd.id);
                        if (shouldBeEnrolled && !isEnrolled) {
                          return { ...p, enrolledStudentIds: [...p.enrolledStudentIds, updatedStd.id] };
                        } else if (!shouldBeEnrolled && isEnrolled) {
                          return { ...p, enrolledStudentIds: p.enrolledStudentIds.filter((id) => id !== updatedStd.id) };
                        }
                        return p;
                      })
                    );
                  }
                }}
                onEnrollStudentInProject={(studentId, projectId) => {
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === projectId
                        ? {
                            ...p,
                            enrolledStudentIds: p.enrolledStudentIds.includes(studentId)
                              ? p.enrolledStudentIds
                              : [...p.enrolledStudentIds, studentId],
                          }
                        : p
                    )
                  );
                }}
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

            {/* Módulo Proyectos & Personajes (Project-Centric Architecture) */}
            {activeTab === 'cast' && (
              <ProjectManager
                projects={projects}
                students={students}
                onCreateProject={(newP) => setProjects((prev) => [newP, ...prev])}
                onUpdateProject={(upP) => setProjects((prev) => prev.map((p) => p.id === upP.id ? upP : p))}
                onArchiveProject={(pId) => setProjects((prev) => prev.map((p) => p.id === pId ? { ...p, status: p.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' } : p))}
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
