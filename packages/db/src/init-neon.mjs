import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_WVklraewq69t@ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

async function runMigration() {
  console.log('⚡ Conectando directamente a tu base de datos Neon Postgres...');

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        matricula VARCHAR(20),
        campus VARCHAR(100) DEFAULT 'Tec Campus Monterrey',
        role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
        company_name VARCHAR(255),
        discipline VARCHAR(50),
        section VARCHAR(100),
        phone VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "users" creada');

    await sql`
      CREATE TABLE IF NOT EXISTS student_schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES users(id) ON DELETE CASCADE,
        day_of_week VARCHAR(20) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        course_name VARCHAR(255),
        is_academic_class BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "student_schedules" creada');

    await sql`
      CREATE TABLE IF NOT EXISTS rehearsal_rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        building VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        equipment TEXT[],
        status VARCHAR(50) DEFAULT 'AVAILABLE'
      );
    `;
    console.log('✅ Tabla "rehearsal_rooms" creada');

    await sql`
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
        approved_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabla "room_bookings" creada');

    await sql`
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
    console.log('✅ Tabla "rehearsals" creada');

    await sql`
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
    console.log('✅ Tabla "attendance" creada');

    await sql`
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
    console.log('✅ Tabla "songs" creada');

    await sql`
      INSERT INTO rehearsal_rooms (name, building, capacity, equipment, status)
      VALUES 
        ('Salón de Ensamble A-101', 'Edificio de Difusión Cultural (DAE)', 35, ARRAY['Piano Yamaha C7', 'Batería Pearl', 'Sistema PA 2000W'], 'AVAILABLE'),
        ('Sala de Danza & Expresión B-202', 'Pabellón Cultural Tec', 50, ARRAY['Piso Flotante', 'Espejos Muro Completo', 'Sound System Bluetooth'], 'AVAILABLE'),
        ('Estudio de Canto & Vientos C-05', 'Auditorio Luis Elizondo (Sótano)', 15, ARRAY['Piano Acústico', 'Aislamiento Acústico', 'Micrófonos Shure'], 'AVAILABLE');
    `;
    console.log('🎹 Salones de ensayo iniciales insertados en Neon');

    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('📋 Tablas actuales en la base de datos de Neon:', result.map(r => r.table_name));

    console.log('🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE EN NEON POSTGRES!');
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
  }
}

runMigration();
