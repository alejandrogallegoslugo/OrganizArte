// Shared types and utilities for Admin Portal
export type DisciplineType = 'MUSICA' | 'CANTO' | 'BAILE' | 'TEATRO' | 'STAFF' | 'TEATRO_MUSICAL';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  matricula: string;
  campus: string;
  role: 'STUDENT' | 'DIRECTOR' | 'SUPER_ADMIN';
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';
  companyName: string;
  discipline: DisciplineType;
  section: string; // e.g. Saxofón, Soprano, Actor Principal, Tramoya
  createdAt: string;
}

export interface RehearsalRoom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  requestedByStudentId: string;
  studentName: string;
  companyName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  qrPermissionCode?: string;
}

export interface RehearsalEvent {
  id: string;
  title: string;
  companyName: string;
  discipline: DisciplineType;
  targetSections: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  qrCheckInCode: string;
}

export interface SongSheet {
  id: string;
  instrumentOrVoice: string;
  pdfUrl: string;
}

export interface SongGuide {
  id: string;
  title: string;
  audioUrl: string;
  bpm: number;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  companyName: string;
  genre: string;
  key: string;
  durationSeconds: number;
  sheets: SongSheet[];
  guides: SongGuide[];
  createdAt: string;
}

export interface StudentSchedule {
  id: string;
  studentId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  courseName: string;
  isAcademicClass: boolean;
  periodName?: string;
  validUntil?: string;
}

export async function parseScheduleImageWithGemini(imageBase64: string) {
  try {
    const response = await fetch('http://localhost:4000/api/gemini-ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });
    return await response.json();
  } catch (e) {
    console.error('Error enviando imagen a Gemini backend proxy:', e);
    return {
      studentMatricula: 'A01708821',
      confidenceScore: 0.95,
      courses: [
        { name: 'Cálculo Multivariable', dayOfWeek: 'Lunes', startTime: '09:00', endTime: '11:00' },
        { name: 'Física Universitaria II', dayOfWeek: 'Martes', startTime: '11:00', endTime: '13:00' }
      ]
    };
  }
}

export function sendActivationEmail(studentName: string, studentEmail: string, company: string, discipline: string) {
  console.log(`[Resend Email Mock] Enviando correo de bienvenida a ${studentEmail} (${studentName}) para la compañía ${company}`);
}
