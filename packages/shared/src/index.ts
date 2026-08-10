// Shared Domain Types for OrganizArte

export type UserRole = 'ADMIN' | 'DIRECTOR' | 'STUDENT';

export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';

export type DisciplineType = 'MUSICA' | 'CANTO' | 'BAILE' | 'TEATRO' | 'STAFF';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  matricula: string; // Ej: A01234567
  campus: string;
  role: UserRole;
  status: AccountStatus;
  companyName: string; // Ej: Ensamble Musical Tec, Comedia Musical 2026
  discipline: DisciplineType;
  section: string; // Ej: Saxofón Alto, Soprano, Baile Urbano, Percusión
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';

export interface TimeSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:mm format "09:00"
  endTime: string;   // HH:mm format "11:00"
  courseName?: string;
  isAcademicClass: boolean; // true = clase ocupada, false = libre
}

export interface StudentSchedule {
  studentId: string;
  updatedAt: string;
  rawImageUrl?: string;
  slots: TimeSlot[];
}

export interface RehearsalRoom {
  id: string;
  name: string; // Ej: Salón de Música A-102, Sala de Ensayo de Danza
  building: string;
  capacity: number;
  equipment: string[]; // Ej: Piano de cola, Amplificadores, Espejos
  status: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED';
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  requestedByStudentId: string;
  studentName: string;
  companyName: string;
  purpose: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  qrPermissionCode?: string;
  approvedBy?: string;
}

export interface RehearsalEvent {
  id: string;
  title: string;
  companyName: string;
  discipline: DisciplineType;
  targetSections: string[]; // [] = todas las secciones, ['Saxofón', 'Trompeta']
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  setlistSongIds?: string[];
  qrCheckInCode: string;
}

export interface AttendanceRecord {
  id: string;
  rehearsalId: string;
  studentId: string;
  studentName: string;
  section: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'JUSTIFIED';
  timestamp?: string;
  justificationReason?: string;
  justificationFileUrl?: string;
}

export interface SongSheet {
  id: string;
  instrumentOrVoice: string; // Ej: Saxo Alto 1, Soprano, Partitura General
  pdfUrl: string;
  keySignature?: string;
}

export interface AudioGuide {
  id: string;
  title: string; // Ej: Pista Completa, Stem Guía Bajo, Cuerda Soprano
  audioUrl: string;
  bpm?: number;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  arranger?: string;
  companyName: string;
  genre: string;
  key: string;
  durationSeconds: number;
  sheets: SongSheet[];
  guides: AudioGuide[];
  createdAt: string;
}
