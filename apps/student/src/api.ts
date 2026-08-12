// Live Neon Postgres API Integration for Student PWA (Cloudflare Pages Function + Local Proxy)
import { StudentProfile, RoomBooking, RehearsalEvent, Song, TimeSlot } from './shared';

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
  role: string;
  companyName?: string;
}

async function executeSql(query: string, params: any[] = []) {
  // 1. Primary: Relative Cloudflare Pages Function /api/db (Zero CORS, Same-Origin, Cloudflare Edge)
  try {
    const response = await fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OrganizArte-Key': 'organizarte-edge-sec-2026',
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
      headers: {
        'Content-Type': 'application/json',
        'X-OrganizArte-Key': 'organizarte-edge-sec-2026',
      },
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

// Helper: Resolve real user UUID from ID, email, or matricula
async function resolveRealUserId(studentIdOrEmailOrMatricula: string): Promise<string | null> {
  if (!studentIdOrEmailOrMatricula) return null;
  const safeSearch = studentIdOrEmailOrMatricula.replace(/'/g, "''");
  const query = `
    SELECT id FROM users
    WHERE id::text = '${safeSearch}'
       OR LOWER(email) = LOWER('${safeSearch}')
       OR LOWER(matricula) = LOWER('${safeSearch}')
    LIMIT 1;
  `;
  const userRows = await executeSql(query);
  return userRows[0]?.id || null;
}

// 1. Register new Student in Neon DB
export async function registerStudentInNeon(student: {
  name: string;
  email: string;
  matricula: string;
  campus: string;
  discipline: string;
  companyName: string;
}): Promise<StudentProfile | null> {
  const safeEmail = student.email.replace(/'/g, "''");
  const safeName = student.name.replace(/'/g, "''");
  const safeMatricula = student.matricula.replace(/'/g, "''");
  const safeCampus = student.campus.replace(/'/g, "''");
  const safeDisc = student.discipline.replace(/'/g, "''");
  const safeComp = student.companyName.replace(/'/g, "''");

  const query = `
    INSERT INTO users (email, name, matricula, campus, role, status, company_name, discipline, section)
    VALUES ('${safeEmail}', '${safeName}', '${safeMatricula}', '${safeCampus}', 'STUDENT', 'PENDING_APPROVAL', '${safeComp}', '${safeDisc}', 'General')
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, matricula = EXCLUDED.matricula
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
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-08-09',
    };
  }
  return null;
}

// 2. Fetch Student Profile by Email or Matricula
export async function fetchStudentProfileInNeon(emailOrMatricula: string): Promise<StudentProfile | null> {
  const realUserId = await resolveRealUserId(emailOrMatricula);
  if (!realUserId) return null;

  const query = `SELECT * FROM users WHERE id = '${realUserId}' LIMIT 1;`;
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
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-08-09',
    };
  }
  return null;
}

export const fetchStudentProfileByEmail = fetchStudentProfileInNeon;

// 3. Save Student Schedule Course in Neon DB
export async function saveStudentScheduleCourseInNeon(
  studentIdOrEmailOrMatricula: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  courseName: string,
  periodName: string = 'Semestre Agosto - Diciembre 2026',
  validUntil: string = '2026-12-15'
) {
  const realUserId = await resolveRealUserId(studentIdOrEmailOrMatricula);
  if (!realUserId) {
    console.warn(`User ${studentIdOrEmailOrMatricula} not found for schedule insertion.`);
    return;
  }

  const safeUserId = realUserId.replace(/'/g, "''");
  const safeDay = dayOfWeek.replace(/'/g, "''");
  const safeStart = startTime.replace(/'/g, "''");
  const safeEnd = endTime.replace(/'/g, "''");
  const safeCourse = courseName.replace(/'/g, "''");
  const safePeriod = periodName.replace(/'/g, "''");
  const safeValid = validUntil.replace(/'/g, "''");

  const query = `
    INSERT INTO student_schedules (student_id, day_of_week, start_time, end_time, course_name, is_academic_class, period_name, valid_until)
    VALUES ('${safeUserId}', '${safeDay}', '${safeStart}', '${safeEnd}', '${safeCourse}', true, '${safePeriod}', '${safeValid}');
  `;
  await executeSql(query);
}

// 3b. Fetch Student Schedules strictly for the logged-in student
export async function fetchStudentSchedulesInNeon(studentIdOrEmailOrMatricula: string): Promise<TimeSlot[]> {
  const realUserId = await resolveRealUserId(studentIdOrEmailOrMatricula);
  if (!realUserId) return [];

  const safeUserId = realUserId.replace(/'/g, "''");
  const query = `SELECT * FROM student_schedules WHERE student_id = '${safeUserId}' ORDER BY day_of_week ASC;`;
  const rows = await executeSql(query);
  return rows.map((r: any) => ({
    id: r.id,
    day: r.day_of_week,
    startTime: r.start_time,
    endTime: r.end_time,
    courseName: r.course_name,
    isAcademicClass: r.is_academic_class ?? true,
    periodName: r.period_name || 'Semestre Agosto - Diciembre 2026',
    validUntil: r.valid_until || '2026-12-15',
  }));
}

// 3c. Clear Student Schedules before replacing with new Gemini OCR upload
export async function clearStudentSchedulesInNeon(studentIdOrEmailOrMatricula: string) {
  const realUserId = await resolveRealUserId(studentIdOrEmailOrMatricula);
  const targetId = realUserId || studentIdOrEmailOrMatricula;
  if (targetId) {
    const safeId = targetId.replace(/'/g, "''");
    await executeSql(`DELETE FROM student_schedules WHERE student_id::text = '${safeId}';`);
  }
}

// 4. Request Room Booking in Neon DB
export async function createRoomBookingInNeon(booking: {
  roomId: string;
  studentId: string;
  studentName: string;
  companyName: string;
  purpose: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}): Promise<boolean> {
  const safeRoom = booking.roomId.replace(/'/g, "''");
  const safeStud = booking.studentId.replace(/'/g, "''");
  const safeComp = booking.companyName.replace(/'/g, "''");
  const safePurp = `${booking.studentName} - ${booking.purpose}`.replace(/'/g, "''");

  const query = `
    INSERT INTO room_bookings (room_id, requested_by_student_id, company_name, purpose, booking_date, start_time, end_time, status)
    VALUES ('${safeRoom}', '${safeStud}', '${safeComp}', '${safePurp}', '${booking.bookingDate}', '${booking.startTime}', '${booking.endTime}', 'PENDING');
  `;
  await executeSql(query);
  return true;
}

// 5. Fetch Rehearsals for Student's Company
export async function fetchRehearsalsForCompanyInNeon(companyName: string): Promise<RehearsalEvent[]> {
  const safeCompany = companyName.replace(/'/g, "''");
  const query = `SELECT * FROM rehearsals WHERE company_name = '${safeCompany}' OR company_name = 'TODAS' ORDER BY rehearsal_date ASC;`;
  const rows = await executeSql(query);
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

export const fetchStudentRehearsals = fetchRehearsalsForCompanyInNeon;

// 6. Fetch Songs & Partituras for Student's Company
export async function fetchSongsForCompanyInNeon(companyName: string): Promise<Song[]> {
  const safeCompany = companyName.replace(/'/g, "''");
  const query = `SELECT * FROM songs WHERE company_name = '${safeCompany}' OR company_name = 'TODAS' ORDER BY title ASC;`;
  const rows = await executeSql(query);
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

export const fetchStudentSongs = fetchSongsForCompanyInNeon;

// 7. Fetch Chat Messages for Student's Company
export async function fetchChatMessagesInNeon(companyName: string): Promise<InternalMessage[]> {
  const safeCompany = companyName.replace(/'/g, "''");
  const query = `SELECT * FROM messages WHERE company_name = '${safeCompany}' OR receiver_id = 'ALL' ORDER BY created_at ASC;`;
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
    createdAt: r.created_at ? new Date(r.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Ahora',
  }));
}

export async function fetchMessagesInNeon(companyName: string): Promise<InternalMessage[]> {
  return fetchChatMessagesInNeon(companyName);
}

export async function sendMessageInNeon(msg: { senderId: string; senderName: string; receiverId: string; receiverName: string; companyName: string; content: string }) {
  const safeSenderName = msg.senderName.replace(/'/g, "''");
  const safeReceiverId = msg.receiverId.replace(/'/g, "''");
  const safeReceiverName = msg.receiverName.replace(/'/g, "''");
  const safeCompany = msg.companyName.replace(/'/g, "''");
  const safeContent = msg.content.replace(/'/g, "''");

  const query = `
    INSERT INTO messages (sender_id, sender_name, sender_role, receiver_id, receiver_name, company_name, content)
    VALUES ('${msg.senderId}', '${safeSenderName}', 'STUDENT', '${safeReceiverId}', '${safeReceiverName}', '${safeCompany}', '${safeContent}')
    RETURNING *;
  `;
  await executeSql(query);
}

export async function fetchUsersForChatInNeon(): Promise<ChatContact[]> {
  const rows = await executeSql("SELECT id, name, role, company_name FROM users WHERE status = 'ACTIVE' ORDER BY name ASC;");
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    role: r.role || 'STUDENT',
    companyName: r.company_name,
  }));
}

// 8. Send Chat Message from Student
export async function sendChatMessageInNeon(msg: {
  senderId: string;
  senderName: string;
  companyName: string;
  content: string;
}) {
  const safeSenderName = msg.senderName.replace(/'/g, "''");
  const safeCompany = msg.companyName.replace(/'/g, "''");
  const safeContent = msg.content.replace(/'/g, "''");

  const query = `
    INSERT INTO messages (sender_id, sender_name, sender_role, receiver_id, receiver_name, company_name, content)
    VALUES ('${msg.senderId}', '${safeSenderName}', 'STUDENT', 'ALL', 'Todos', '${safeCompany}', '${safeContent}')
    RETURNING *;
  `;
  await executeSql(query);
}
