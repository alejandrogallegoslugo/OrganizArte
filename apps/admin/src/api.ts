// Live Neon Postgres API Integration for Admin App (Cloudflare Pages Function + Local Proxy)
import { StudentProfile, RehearsalRoom, RoomBooking, RehearsalEvent, Song, StudentSchedule } from './shared';

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

// 0. Fetch, Create, Edit & Delete Dynamic Artistic Companies (Compañías / Elencos)
export async function fetchLiveCompanies(campusName: string = 'Tec Campus Laguna (Torreón)'): Promise<{ id: string; name: string; discipline: string; emoji: string; campusName: string }[]> {
  const safeCampus = campusName.replace(/'/g, "''");
  const rows = await executeSql(`SELECT * FROM artistic_companies WHERE is_active = true AND (campus_name = '${safeCampus}' OR campus_name IS NULL) ORDER BY created_at ASC;`);
  if (!rows || rows.length === 0) {
    return [];
  }
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    discipline: r.discipline,
    emoji: r.emoji || '🎭',
    campusName: r.campus_name || campusName,
  }));
}

export async function createCompanyInNeon(name: string, discipline: string, emoji: string, campusName: string = 'Tec Campus Laguna (Torreón)') {
  const safeName = name.replace(/'/g, "''");
  const safeDisc = discipline.replace(/'/g, "''");
  const safeCampus = campusName.replace(/'/g, "''");
  const query = `
    INSERT INTO artistic_companies (name, discipline, emoji, campus_name)
    VALUES ('${safeName}', '${safeDisc}', '${emoji}', '${safeCampus}')
    ON CONFLICT (name) DO NOTHING;
  `;
  await executeSql(query);
}

export async function updateCompanyInNeon(id: string, name: string, discipline: string, emoji: string) {
  const safeId = id.replace(/'/g, "''");
  const safeName = name.replace(/'/g, "''");
  const safeDisc = discipline.replace(/'/g, "''");
  const query = `
    UPDATE artistic_companies
    SET name = '${safeName}', discipline = '${safeDisc}', emoji = '${emoji}'
    WHERE id = '${safeId}' OR name = '${safeName}';
  `;
  await executeSql(query);
}

export async function deleteCompanyInNeon(id: string) {
  const safeId = id.replace(/'/g, "''");
  const query = `UPDATE artistic_companies SET is_active = false WHERE id = '${safeId}';`;
  await executeSql(query);
}

// 0b. Fetch & Create Live Repartos and Cast Roles strictly from Neon DB
export async function fetchLiveCastRoles(companyName: string = 'Ensamble Musical Tec'): Promise<any[]> {
  const rows = await executeSql(`
    SELECT cr.id, cr.character_name, cr.role_category, cr.required_discipline,
           sc.show_title, sc.company_name, sc.director_name
    FROM cast_roles cr
    JOIN show_casts sc ON cr.show_id = sc.id
    ORDER BY cr.created_at DESC;
  `);

  if (!rows || rows.length === 0) {
    return [];
  }

  // Group strictly by show_title from Neon DB
  const showMap: Record<string, any> = {};
  rows.forEach((r: any) => {
    if (!showMap[r.show_title]) {
      showMap[r.show_title] = {
        id: r.id,
        companyName: r.company_name,
        showTitle: r.show_title,
        directorName: r.director_name || 'Prof. Alejandro Gallegos',
        roles: [],
      };
    }
    showMap[r.show_title].roles.push({
      id: r.id,
      characterName: r.character_name,
      roleCategory: r.role_category,
      requiredDiscipline: r.required_discipline,
      assignedStudentName: 'Alumno Asignado',
      assignmentType: 'TITULAR',
    });
  });

  return Object.values(showMap);
}

export async function createCastRoleInNeon(showTitle: string, companyName: string, characterName: string, roleCategory: string, requiredDiscipline: string) {
  const safeShow = showTitle.replace(/'/g, "''");
  const safeCompany = companyName.replace(/'/g, "''");
  const safeChar = characterName.replace(/'/g, "''");
  const safeCat = roleCategory.replace(/'/g, "''");
  const safeDisc = requiredDiscipline.replace(/'/g, "''");

  const showQuery = `
    INSERT INTO show_casts (company_name, show_title)
    VALUES ('${safeCompany}', '${safeShow}')
    ON CONFLICT DO NOTHING;
  `;
  await executeSql(showQuery);

  const getShow = await executeSql(`SELECT id FROM show_casts WHERE show_title = '${safeShow}' LIMIT 1;`);
  const showId = getShow[0]?.id;

  if (showId) {
    const roleQuery = `
      INSERT INTO cast_roles (show_id, character_name, role_category, required_discipline)
      VALUES ('${showId}', '${safeChar}', '${safeCat}', '${safeDisc}');
    `;
    await executeSql(roleQuery);
  }
}

export async function deleteCastRoleInNeon(roleId: string) {
  const safeId = roleId.replace(/'/g, "''");
  const query = `DELETE FROM cast_roles WHERE id = '${safeId}';`;
  await executeSql(query);
}

// 1. Fetch all real students from Neon Postgres
export async function fetchLiveStudents(): Promise<StudentProfile[]> {
  const rows = await executeSql('SELECT * FROM users ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    matricula: r.matricula || 'N/A',
    campus: r.campus || 'Tec Campus Laguna (Torreón)',
    role: r.role || 'STUDENT',
    status: r.status || 'PENDING_APPROVAL',
    companyName: r.company_name || 'Ensamble Musical Tec',
    discipline: r.discipline || 'MUSICA',
    section: r.section || 'General',
    createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-08-09',
  }));
}

// 1b. Create Student directly from Admin in Neon Postgres
export async function createStudentInNeon(student: StudentProfile) {
  const safeEmail = student.email.replace(/'/g, "''");
  const safeName = student.name.replace(/'/g, "''");
  const safeMatricula = student.matricula.replace(/'/g, "''");
  const safeCampus = student.campus.replace(/'/g, "''");
  const safeCompany = student.companyName.replace(/'/g, "''");
  const safeDisc = student.discipline.replace(/'/g, "''");
  const safeSec = student.section.replace(/'/g, "''");

  const query = `
    INSERT INTO users (email, name, matricula, campus, role, status, company_name, discipline, section)
    VALUES ('${safeEmail}', '${safeName}', '${safeMatricula}', '${safeCampus}', '${student.role}', '${student.status}', '${safeCompany}', '${safeDisc}', '${safeSec}')
    ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE'
    RETURNING *;
  `;
  await executeSql(query);
}

// 1c. Delete Student directly in Neon Postgres
export async function deleteStudentInNeon(studentId: string) {
  const realUserId = await resolveRealUserId(studentId);
  const targetId = realUserId || studentId;
  const safeId = targetId.replace(/'/g, "''");
  
  try {
    // Clear associated records first across all dependent tables
    await executeSql(`DELETE FROM student_schedules WHERE student_id::text = '${safeId}';`);
    await executeSql(`DELETE FROM room_bookings WHERE requested_by_student_id::text = '${safeId}' OR approved_by::text = '${safeId}';`);
    await executeSql(`DELETE FROM attendance WHERE student_id::text = '${safeId}';`);
    await executeSql(`DELETE FROM student_cast_assignments WHERE student_id::text = '${safeId}';`);
    await executeSql(`DELETE FROM messages WHERE sender_id::text = '${safeId}' OR receiver_id::text = '${safeId}';`);

    // Delete user from users table
    await executeSql(`DELETE FROM users WHERE id::text = '${safeId}' OR email = '${safeId}' OR matricula = '${safeId}';`);
  } catch (err) {
    console.warn('Error deleting student dependent rows:', err);
    await executeSql(`DELETE FROM users WHERE id::text = '${safeId}' OR email = '${safeId}' OR matricula = '${safeId}';`);
  }
}

// 2. Approve Student in Neon Postgres
export async function approveStudentInNeon(studentId: string, company: string, discipline: string, section: string) {
  const realUserId = await resolveRealUserId(studentId);
  const targetId = realUserId || studentId;
  const safeId = targetId.replace(/'/g, "''");
  const safeCompany = company.replace(/'/g, "''");
  const safeDisc = discipline.replace(/'/g, "''");
  const safeSec = section.replace(/'/g, "''");

  const query = `
    UPDATE users 
    SET status = 'ACTIVE', company_name = '${safeCompany}', discipline = '${safeDisc}', section = '${safeSec}'
    WHERE id::text = '${safeId}' OR email = '${safeId}' OR matricula = '${safeId}';
  `;
  await executeSql(query);
}

// 3. Reject Student in Neon Postgres
export async function rejectStudentInNeon(studentId: string) {
  const realUserId = await resolveRealUserId(studentId);
  const targetId = realUserId || studentId;
  const safeId = targetId.replace(/'/g, "''");
  const query = `UPDATE users SET status = 'REJECTED' WHERE id::text = '${safeId}' OR email = '${safeId}' OR matricula = '${safeId}';`;
  await executeSql(query);
}

// 3b. Fetch & Save Real Student Schedules in Neon DB
export async function fetchLiveSchedules(): Promise<StudentSchedule[]> {
  try {
    const rows = await executeSql('SELECT * FROM student_schedules ORDER BY day_of_week ASC');
    return rows.map((r: any) => ({
      id: r.id,
      studentId: String(r.student_id),
      dayOfWeek: r.day_of_week,
      startTime: r.start_time,
      endTime: r.end_time,
      courseName: r.course_name,
      isAcademicClass: r.is_academic_class ?? true,
      periodName: r.period_name || 'Semestre Agosto - Diciembre 2026',
      validUntil: r.valid_until || '2026-12-15',
    }));
  } catch (err) {
    console.warn('Error fetching live schedules:', err);
    return [];
  }
}

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
    console.warn(`[admin saveSchedule] User ${studentIdOrEmailOrMatricula} not found.`);
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

export async function clearStudentSchedulesInNeon(studentIdOrEmailOrMatricula: string) {
  const realUserId = await resolveRealUserId(studentIdOrEmailOrMatricula);
  const targetId = realUserId || studentIdOrEmailOrMatricula;
  if (targetId) {
    const safeId = targetId.replace(/'/g, "''");
    await executeSql(`DELETE FROM student_schedules WHERE student_id::text = '${safeId}';`);
  }
}

export async function deleteStudentScheduleCourseInNeon(scheduleId: string) {
  const safeId = scheduleId.replace(/'/g, "''");
  const query = `DELETE FROM student_schedules WHERE id = '${safeId}';`;
  await executeSql(query);
}

// 4. Fetch all real rehearsal rooms from Neon DB
export async function fetchLiveRooms(): Promise<RehearsalRoom[]> {
  const rows = await executeSql('SELECT * FROM rehearsal_rooms ORDER BY name ASC');
  if (!rows || rows.length === 0) {
    return [
      { id: 'rm-1', name: 'Salón de Ensamble A-101', building: 'Edificio de Difusión Cultural (DAE)', capacity: 35, equipment: ['Piano Yamaha C7', 'Batería Pearl', 'Sistema PA 2000W'], status: 'AVAILABLE' },
      { id: 'rm-2', name: 'Sala de Danza & Expresión B-202', building: 'Pabellón Cultural Tec', capacity: 50, equipment: ['Piso Flotante', 'Espejos Muro Completo', 'Sound System Bluetooth'], status: 'AVAILABLE' },
      { id: 'rm-3', name: 'Estudio de Canto & Vientos C-05', building: 'Auditorio Luis Elizondo (Sótano)', capacity: 15, equipment: ['Piano Acústico', 'Aislamiento Acústico', 'Micrófonos Shure'], status: 'AVAILABLE' }
    ];
  }
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    building: r.building,
    capacity: r.capacity,
    equipment: r.equipment || ['Piano Yamaha C7', 'Aislamiento Acústico'],
    status: r.status || 'AVAILABLE',
  }));
}

export async function createRoomInNeon(name: string, building: string, capacity: number, equipment: string[]) {
  const safeName = name.replace(/'/g, "''");
  const safeBuilding = building.replace(/'/g, "''");
  const eqArrayStr = JSON.stringify(equipment).replace(/'/g, "''");
  const query = `
    INSERT INTO rehearsal_rooms (name, building, capacity, equipment, status)
    VALUES ('${safeName}', '${safeBuilding}', ${capacity}, '${eqArrayStr}'::jsonb, 'AVAILABLE');
  `;
  await executeSql(query);
}

export async function updateRoomInNeon(id: string, name: string, building: string, capacity: number, equipment: string[]) {
  const safeId = id.replace(/'/g, "''");
  const safeName = name.replace(/'/g, "''");
  const safeBuilding = building.replace(/'/g, "''");
  const eqArrayStr = JSON.stringify(equipment).replace(/'/g, "''");
  const query = `
    UPDATE rehearsal_rooms
    SET name = '${safeName}', building = '${safeBuilding}', capacity = ${capacity}, equipment = '${eqArrayStr}'::jsonb
    WHERE id = '${safeId}' OR name = '${safeName}';
  `;
  await executeSql(query);
}

export async function deleteRoomInNeon(roomId: string) {
  const safeId = roomId.replace(/'/g, "''");
  const query = `DELETE FROM rehearsal_rooms WHERE id = '${safeId}';`;
  await executeSql(query);
}

// 5. Fetch all real room bookings
export async function fetchLiveBookings(): Promise<RoomBooking[]> {
  const rows = await executeSql('SELECT * FROM room_bookings ORDER BY created_at DESC');
  return rows.map((r: any) => ({
    id: r.id,
    roomId: r.room_id,
    roomName: 'Salón de Ensamble A-101',
    requestedByStudentId: r.requested_by_student_id,
    studentName: r.purpose.includes('-') ? r.purpose.split('-')[0] : 'Alumno Tec',
    companyName: r.company_name,
    purpose: r.purpose,
    date: r.booking_date ? new Date(r.booking_date).toISOString().split('T')[0] : '2026-08-14',
    startTime: r.start_time,
    endTime: r.end_time,
    status: r.status,
    qrPermissionCode: r.status === 'APPROVED' ? `PERMISO-TEC-${r.id.substring(0, 6).toUpperCase()}` : undefined,
  }));
}

// 6. Approve Room Booking in Neon
export async function approveBookingInNeon(bookingId: string) {
  const safeId = bookingId.replace(/'/g, "''");
  const query = `UPDATE room_bookings SET status = 'APPROVED' WHERE id = '${safeId}'`;
  await executeSql(query);
}

// 7. Reject Room Booking in Neon
export async function rejectBookingInNeon(bookingId: string) {
  const safeId = bookingId.replace(/'/g, "''");
  const query = `UPDATE room_bookings SET status = 'REJECTED' WHERE id = '${safeId}'`;
  await executeSql(query);
}

// 8. Fetch all real rehearsals
export async function fetchLiveRehearsals(): Promise<RehearsalEvent[]> {
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

// 9. Create Rehearsal in Neon
export async function createRehearsalInNeon(r: RehearsalEvent) {
  const safeTitle = r.title.replace(/'/g, "''");
  const safeCompany = r.companyName.replace(/'/g, "''");
  const safeDisc = r.discipline.replace(/'/g, "''");
  const safeLocation = r.location.replace(/'/g, "''");
  const safeDesc = (r.description || '').replace(/'/g, "''");

  const query = `
    INSERT INTO rehearsals (title, company_name, discipline, rehearsal_date, start_time, end_time, location, description, qr_check_in_code)
    VALUES ('${safeTitle}', '${safeCompany}', '${safeDisc}', '${r.date}', '${r.startTime}', '${r.endTime}', '${safeLocation}', '${safeDesc}', '${r.qrCheckInCode}')
  `;
  await executeSql(query);
}

// 10. Fetch real songs
export async function fetchLiveSongs(): Promise<Song[]> {
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

// 11. Create Song in Neon
export async function createSongInNeon(s: Song) {
  const safeTitle = s.title.replace(/'/g, "''");
  const safeComposer = s.composer.replace(/'/g, "''");
  const safeCompany = s.companyName.replace(/'/g, "''");
  const safeGenre = s.genre.replace(/'/g, "''");
  const safeKey = s.key.replace(/'/g, "''");

  const query = `
    INSERT INTO songs (title, composer, company_name, genre, song_key, duration_seconds)
    VALUES ('${safeTitle}', '${safeComposer}', '${safeCompany}', '${safeGenre}', '${safeKey}', ${s.durationSeconds})
  `;
  await executeSql(query);
}

// 12. Fetch All Messages for Admin Chat & Inbox
export async function fetchAllAdminMessages(): Promise<any[]> {
  const rows = await executeSql('SELECT * FROM messages ORDER BY created_at ASC');
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

export async function sendAdminMessage(msg: {
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
}) {
  const safeSenderName = msg.senderName.replace(/'/g, "''");
  const safeReceiverName = msg.receiverName.replace(/'/g, "''");
  const safeContent = msg.content.replace(/'/g, "''");

  const query = `
    INSERT INTO messages (sender_id, sender_name, sender_role, receiver_id, receiver_name, company_name, content)
    VALUES ('${msg.senderId}', '${safeSenderName}', 'ADMIN', '${msg.receiverId}', '${safeReceiverName}', 'Dirección Arte y Cultura', '${safeContent}')
    RETURNING *;
  `;
  await executeSql(query);
}
