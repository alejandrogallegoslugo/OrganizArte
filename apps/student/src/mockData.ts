import { StudentProfile, StudentSchedule, RehearsalEvent, Song, RoomBooking } from './shared';

export const CURRENT_STUDENT: StudentProfile = {
  id: 'std-1',
  name: 'Alumno Tec',
  email: 'alumno@tec.mx',
  matricula: 'A00000000',
  campus: 'Tec Campus Laguna (Torreón)',
  role: 'STUDENT',
  status: 'ACTIVE',
  companyName: 'Arte y Cultura Tec',
  discipline: 'MUSICA',
  section: 'Alumno',
  phone: '',
  createdAt: '2026-08-10',
};

export const STUDENT_SCHEDULE: StudentSchedule = {
  studentId: 'std-1',
  updatedAt: '2026-08-10',
  slots: [],
};

export const UPCOMING_REHEARSALS: RehearsalEvent[] = [];
export const MY_SONGS: Song[] = [];
export const MY_BOOKINGS: RoomBooking[] = [];

export const MOCK_REHEARSALS: RehearsalEvent[] = [];
export const MOCK_SONGS: Song[] = [];
export const INITIAL_SLOTS = STUDENT_SCHEDULE.slots;

