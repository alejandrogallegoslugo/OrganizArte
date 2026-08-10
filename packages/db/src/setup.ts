import { neon } from '@neondatabase/serverless';
import {
  usersTableSql,
  schedulesTableSql,
  roomsTableSql,
  roomBookingsTableSql,
  rehearsalsTableSql,
  attendanceTableSql,
  songsTableSql,
} from './schema';

/**
 * Runs DDL scripts directly on Neon Postgres to create all tables.
 */
export async function initializeNeonDatabase(databaseUrl: string) {
  console.log('🚀 Inicializando tablas en Neon Postgres...');
  const sql = neon(databaseUrl);

  try {
    await sql(usersTableSql);
    console.log('✅ Tabla users creada/verificada');

    await sql(schedulesTableSql);
    console.log('✅ Tabla student_schedules creada/verificada');

    await sql(roomsTableSql);
    console.log('✅ Tabla rehearsal_rooms creada/verificada');

    await sql(roomBookingsTableSql);
    console.log('✅ Tabla room_bookings creada/verificada');

    await sql(rehearsalsTableSql);
    console.log('✅ Tabla rehearsals creada/verificada');

    await sql(attendanceTableSql);
    console.log('✅ Tabla attendance creada/verificada');

    await sql(songsTableSql);
    console.log('✅ Tabla songs creada/verificada');

    console.log('🎉 ¡Base de datos Neon creada e inicializada con éxito!');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos Neon:', error);
  }
}
