// Live Neon Postgres API Integration for Student PWA (Cloudflare Pages Function + Local Proxy)
import { StudentProfile, RoomBooking, RehearsalEvent, Song, TimeSlot } from './shared';

async function executeSql(query: string, params: any[] = []) {
  // 1. Primary: Relative Cloudflare Pages Function /api/db (Zero CORS, Same-Origin, Cloudflare Edge)
  try {
    const response = await fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.rows || [];
    }
  } catch (error) {
    console.warn('Cloudflare /api/db Endpoint Warning, trying local proxy:', error);
  }

  // 2. Secondary Fallback: Local Express Proxy Server on http://localhost:4000/api/db
  try {
    const fallbackResponse = await fetch('http://localhost:4000/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params }),
    });
    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      return data.rows || [];
    }
  } catch (fallbackError) {
    console.error('All DB Connection attempts failed:', fallbackError);
  }

  return [];
}

// 0. Fetch real student profile by Email or Matricula from Neon DB
export async function fetchStudentProfileByEmail(emailOrMatricula: string): Promise<StudentProfile | null> {
  const query = `
    SELECT * FROM users
    WHERE LOWER(email) = LOWER('${emailOrMatricula}')
       OR LOWER(matricula) = LOWER('${emailOrMatricula}')
    LIMIT 1;
  `;
  const rows = await executeSql(query);
  if (rows && rows.length > 0) {
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      matricula: r.matricula || 'N/A',
      campus: r.campus || 'Tec Campus Laguna (Torreón)',
      role: r.role || 'STUDENT',
      status: r.status || 'ACTIVE',
      companyName: r.company_name || 'Ensamble Musical Tec',
      discipline: r.discipline || 'MUSICA',
      section: r.section || 'General',
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-08-09',
    };
  }
  return null;
}

// 0b. Save Student Schedule Course in Neon DB
export async function saveStudentScheduleCourseInNeon(studentId: string, dayOfWeek: string, startTime: string, endTime: string, courseName: string, periodName: string = 'Semestre Agosto - Diciembre 2026', validUntil: string = '2026-12-15') {
  const userRows = await executeSql(`SELECT id FROM users WHERE id::text = '${studentId}' OR matricula = '${studentId}' OR email = '${studentId}' OR matricula = 'A0123456' OR email = 'prueba@tec.mx' LIMIT 1;`);
  const realUserId = userRows[0]?.id || studentId;

  const query = `
    INSERT INTO student_schedules (student_id, day_of_week, start_time, end_time, course_name, is_academic_class, period_name, valid_until)
    VALUES ('${realUserId}', '${dayOfWeek}', '${startTime}', '${endTime}', '${courseName}', true, '${periodName}', '${validUntil}');
  `;
  await executeSql(query);
}

// 0c. Fetch live student schedules from Neon DB for student
export async function fetchStudentSchedulesInNeon(studentIdOrMatricula: string): Promise<TimeSlot[]> {
  const userRows = await executeSql(`SELECT id FROM users WHERE id::text = '${studentIdOrMatricula}' OR matricula = '${studentIdOrMatricula}' OR email = '${studentIdOrMatricula}' LIMIT 1;`);
  const realUserId = userRows[0]?.id;

  const filterClause = realUserId ? `WHERE student_id = '${realUserId}'` : '';
  const rows = await executeSql(`SELECT * FROM student_schedules ${filterClause} ORDER BY day_of_week ASC, start_time ASC;`);

  if (!rows || rows.length === 0) {
    // If no specific user filter, fallback to all student_schedules if any
    const allRows = await executeSql(`SELECT * FROM student_schedules ORDER BY day_of_week ASC, start_time ASC;`);
    return allRows.map((r: any, idx: number) => ({
      id: r.id || `slot-${idx}`,
      dayOfWeek: r.day_of_week,
      startTime: r.start_time,
      endTime: r.end_time,
      courseName: r.course_name || 'Clase Académica MiTec',
      isAcademicClass: r.is_academic_class ?? true,
    }));
  }

  return rows.map((r: any, idx: number) => ({
    id: r.id || `slot-${idx}`,
    dayOfWeek: r.day_of_week,
    startTime: r.start_time,
    endTime: r.end_time,
    courseName: r.course_name || 'Clase Académica MiTec',
    isAcademicClass: r.is_academic_class ?? true,
  }));
}

export async function clearStudentSchedulesInNeon(studentId: string) {
  const userRows = await executeSql(`SELECT id FROM users WHERE id::text = '${studentId}' OR matricula = '${studentId}' OR email = '${studentId}' OR matricula = 'A0123456' OR email = 'prueba@tec.mx' LIMIT 1;`);
  const realUserId = userRows[0]?.id || studentId;
  await executeSql(`DELETE FROM student_schedules WHERE student_id = '${realUserId}';`);
}

// 1. Register student directly into Neon Postgres DB
export async function registerStudentInNeon(student: StudentProfile): Promise<StudentProfile> {
  const query = `
    INSERT INTO users (email, name, matricula, campus, role, status, company_name, discipline, section)
    VALUES ('${student.email}', '${student.name}', '${student.matricula}', '${student.campus}', '${student.role}', '${student.status}', '${student.companyName}', '${student.discipline}', '${student.section}')
    ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE'
    RETURNING *;
  `;

  const rows = await executeSql(query);
  if (rows && rows.length > 0) {
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      matricula: r.matricula,
      campus: r.campus,
      role: r.role,
      status: r.status,
      companyName: r.company_name,
      discipline: r.discipline,
      section: r.section,
      createdAt: new Date(r.created_at).toISOString().split('T')[0],
    };
  }
  return student;
}

// 2. Student Request Room Booking in Neon
export async function createRoomBookingInNeon(booking: RoomBooking) {
  const query = `
    INSERT INTO room_bookings (company_name, purpose, booking_date, start_time, end_time, status)
    VALUES ('${booking.companyName}', '${booking.purpose}', '${booking.date}', '${booking.startTime}', '${booking.endTime}', '${booking.status}')
    RETURNING *;
  `;
  await executeSql(query);
}

// 3. Fetch live rehearsals for student
export async function fetchStudentRehearsals(): Promise<RehearsalEvent[]> {
  const rows = await executeSql('SELECT * FROM rehearsals ORDER BY rehearsal_date ASC');
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    companyName: r.company_name,
    discipline: r.discipline,
    targetSections: r.target_sections || [],
    date: r.rehearsal_date ? new Date(r.rehearsal_date).toISOString().split('T')[0] : '2026-08-15',
    startTime: r.start_time,
    endTime: r.end_time,
    location: r.location,
    description: r.description,
    qrCheckInCode: r.qr_check_in_code,
  }));
}

export async function fetchStudentSongs(): Promise<Song[]> {
  const rows = await executeSql('SELECT * FROM songs ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    composer: r.composer,
    companyName: r.company_name,
    genre: r.genre || 'Sinfónico',
    key: r.song_key || 'C Mayor',
    durationSeconds: r.duration_seconds || 300,
    sheets: [
      { id: `sh-${r.id}-1`, instrumentOrVoice: 'Partitura General', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    ],
    guides: [
      { id: `g-${r.id}-1`, title: 'Audio Guía Maqueta (Tutti)', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', bpm: 120 },
    ],
    createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-08-09',
  }));
}

// 5. Chat & Internal Messaging API Functions
export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  companyName?: string;
  content: string;
  createdAt: string;
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  email: string;
  companyName?: string;
}

export async function fetchMessagesInNeon(userMatriculaOrId: string): Promise<InternalMessage[]> {
  const query = `
    SELECT * FROM messages 
    WHERE receiver_id = 'ALL' 
       OR receiver_id = '${userMatriculaOrId}'
       OR sender_id = '${userMatriculaOrId}'
    ORDER BY created_at ASC;
  `;
  const rows = await executeSql(query);
  return rows.map((r: any) => ({
    id: r.id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderRole: r.sender_role,
    receiverId: r.receiver_id || 'ALL',
    receiverName: r.receiver_name || 'Todos',
    companyName: r.company_name,
    content: r.content,
    createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ahora',
  }));
}

export async function sendMessageInNeon(msg: {
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId?: string;
  receiverName?: string;
  companyName?: string;
  content: string;
}) {
  const query = `
    INSERT INTO messages (sender_id, sender_name, sender_role, receiver_id, receiver_name, company_name, content)
    VALUES ('${msg.senderId}', '${msg.senderName}', '${msg.senderRole}', '${msg.receiverId || 'ALL'}', '${msg.receiverName || 'Todos'}', '${msg.companyName || 'General'}', '${msg.content.replace(/'/g, "''")}')
    RETURNING *;
  `;
  await executeSql(query);
}

export async function fetchUsersForChatInNeon(): Promise<ChatContact[]> {
  const rows = await executeSql(`SELECT id, name, role, email, company_name FROM users ORDER BY name ASC;`);
  const contacts: ChatContact[] = [
    { id: 'admin-1', name: 'Prof. Alejandro Gallegos (Director/Admin)', role: 'ADMIN', email: 'admin@tec.mx', companyName: 'Dirección Arte y Cultura' },
    { id: 'all-channel', name: '📢 Canal General Arte y Cultura', role: 'ADMIN', email: 'general@tec.mx', companyName: 'Todos los Alumnos' },
  ];
  if (rows && rows.length > 0) {
    rows.forEach((r: any) => {
      contacts.push({
        id: r.id,
        name: r.name,
        role: r.role || 'STUDENT',
        email: r.email,
        companyName: r.company_name,
      });
    });
  }
  return contacts;
}
