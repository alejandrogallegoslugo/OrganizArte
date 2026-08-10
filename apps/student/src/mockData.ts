import { StudentProfile, StudentSchedule, RehearsalEvent, Song, RoomBooking } from './shared';

export const CURRENT_STUDENT: StudentProfile = {
  id: 'std-1',
  name: 'Mateo Hernández',
  email: 'mateo.h@tec.mx',
  matricula: 'A01708821',
  campus: 'Tec Campus Monterrey',
  role: 'STUDENT',
  status: 'ACTIVE', // change to PENDING_APPROVAL to test pending view
  companyName: 'Ensamble Musical Tec',
  discipline: 'MUSICA',
  section: 'Saxofón Alto 1',
  phone: '811-234-5678',
  createdAt: '2026-08-01',
};

export const STUDENT_SCHEDULE: StudentSchedule = {
  studentId: 'std-1',
  updatedAt: '2026-08-05',
  slots: [
    { id: 's1', day: 'LUNES', startTime: '09:00', endTime: '11:00', courseName: 'Cálculo Diferencial (F1001)', isAcademicClass: true },
    { id: 's2', day: 'LUNES', startTime: '13:00', endTime: '15:00', courseName: 'Física I (F1002)', isAcademicClass: true },
    { id: 's3', day: 'MARTES', startTime: '11:00', endTime: '13:00', courseName: 'POO (TC1028)', isAcademicClass: true },
    { id: 's4', day: 'MIERCOLES', startTime: '09:00', endTime: '11:00', courseName: 'Cálculo Diferencial (F1001)', isAcademicClass: true },
    { id: 's5', day: 'JUEVES', startTime: '11:00', endTime: '13:00', courseName: 'POO (TC1028)', isAcademicClass: true },
    { id: 's6', day: 'VIERNES', startTime: '15:00', endTime: '17:00', courseName: 'Laboratorio Innovación (WA1001)', isAcademicClass: true },
  ],
};

export const UPCOMING_REHEARSALS: RehearsalEvent[] = [
  {
    id: 'reh-1',
    title: 'Ensayo General - Gala de Invierno Tec',
    companyName: 'Ensamble Musical Tec',
    discipline: 'MUSICA',
    targetSections: [],
    date: '2026-08-13',
    startTime: '17:00',
    endTime: '20:00',
    location: 'Salón de Ensamble A-101',
    description: 'Ensayo de montaje completo. Traer partitura de Huapango de Moncayo.',
    qrCheckInCode: 'QR-ENSAYO-GALA-2026',
  },
  {
    id: 'reh-2',
    title: 'Seccional de Saxofones & Vientos',
    companyName: 'Ensamble Musical Tec',
    discipline: 'MUSICA',
    targetSections: ['Saxofón Alto', 'Saxofón Tenor', 'Trompeta'],
    date: '2026-08-16',
    startTime: '16:00',
    endTime: '18:00',
    location: 'Estudio C-05',
    description: 'Ajuste de afinación e improvisación.',
    qrCheckInCode: 'QR-SAX-SECCIONAL',
  },
];

export const MY_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Huapango de Moncayo (Arr. Big Band Tec)',
    composer: 'José Pablo Moncayo',
    arranger: 'Prof. Roberto Cantú',
    companyName: 'Ensamble Musical Tec',
    genre: 'Sinfónico / Fusión',
    key: 'C Mayor',
    durationSeconds: 380,
    sheets: [
      { id: 'sh-2', instrumentOrVoice: 'Saxofón Alto 1', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf', keySignature: 'Eb' },
    ],
    guides: [
      { id: 'g-1', title: 'Pista Completa (Tutti)', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', bpm: 128 },
      { id: 'g-2', title: 'Acompañamiento Rhythm Section', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', bpm: 128 },
    ],
    createdAt: '2026-08-01',
  },
  {
    id: 'song-2',
    title: 'Uptown Funk (Medley)',
    composer: 'Mark Ronson / Bruno Mars',
    arranger: 'Lalo Rodríguez',
    companyName: 'Ensamble Musical Tec',
    genre: 'Funk / Pop',
    key: 'D Menor',
    durationSeconds: 260,
    sheets: [
      { id: 'sh-6', instrumentOrVoice: 'Saxofón Alto (Metales)', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    ],
    guides: [
      { id: 'g-3', title: 'Guía de Referencia con Click', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', bpm: 115 },
    ],
    createdAt: '2026-08-04',
  },
];

export const MY_BOOKINGS: RoomBooking[] = [
  {
    id: 'bk-1',
    roomId: 'room-101',
    roomName: 'Salón de Ensamble A-101',
    requestedByStudentId: 'std-1',
    studentName: 'Mateo Hernández',
    companyName: 'Ensamble Musical Tec',
    purpose: 'Práctica individual de solos de Saxofón',
    date: '2026-08-12',
    startTime: '17:00',
    endTime: '19:00',
    status: 'APPROVED',
    qrPermissionCode: 'PERMISO-TEC-889021',
    approvedBy: 'Director R. Cantú',
  },
];
