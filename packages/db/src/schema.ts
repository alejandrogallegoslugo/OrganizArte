// Neon Postgres Schema for Drizzle ORM

export const campusesTableSql = `
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Torreón',
  state VARCHAR(100) NOT NULL DEFAULT 'Coahuila',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const usersTableSql = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  matricula VARCHAR(20),
  campus VARCHAR(100) DEFAULT 'Tec Campus Laguna (Torreón)',
  campus_id UUID REFERENCES campuses(id),
  role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
  company_name VARCHAR(255),
  discipline VARCHAR(50),
  section VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const schedulesTableSql = `
CREATE TABLE IF NOT EXISTS student_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  course_name VARCHAR(255),
  is_academic_class BOOLEAN DEFAULT true,
  period_name VARCHAR(100) DEFAULT 'Agosto - Diciembre 2026',
  valid_until DATE DEFAULT '2026-12-15',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const roomsTableSql = `
CREATE TABLE IF NOT EXISTS rehearsal_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  building VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  equipment TEXT[],
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  campus_id UUID REFERENCES campuses(id)
);
`;

export const roomBookingsTableSql = `
CREATE TABLE IF NOT EXISTS room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rehearsal_rooms(id),
  requested_by_student_id UUID REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  purpose TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  approvedBy UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const rehearsalsTableSql = `
CREATE TABLE IF NOT EXISTS rehearsals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  discipline VARCHAR(50) NOT NULL,
  target_sections TEXT[],
  rehearsal_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  qr_check_in_code VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const attendanceTableSql = `
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rehearsal_id UUID REFERENCES rehearsals(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  justification_reason TEXT,
  justification_file_url TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE
);
`;

export const songsTableSql = `
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  composer VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  song_key VARCHAR(20),
  duration_seconds INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
