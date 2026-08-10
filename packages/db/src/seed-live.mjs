const connectionString = 'postgresql://neondb_owner:npg_WVklraewq69t@ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const endpoint = 'https://ep-restless-forest-axusb0wu.us-east-2.aws.neon.tech/sql';

async function executeSql(query) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

async function seed() {
  console.log('⚡ Poblando registros reales iniciales en Neon Postgres...');

  // Insert initial active and pending students
  await executeSql(`
    INSERT INTO users (email, name, matricula, campus, role, status, company_name, discipline, section)
    VALUES 
      ('mateo.h@tec.mx', 'Mateo Hernández', 'A01708821', 'Tec Campus Laguna (Torreón)', 'STUDENT', 'ACTIVE', 'Ensamble Musical Tec', 'MUSICA', 'Saxofón Alto 1'),
      ('sofia.garza@gmail.com', 'Sofia Garza', 'A01709943', 'Tec Campus Laguna (Torreón)', 'STUDENT', 'ACTIVE', 'Ensamble Musical Tec', 'CANTO', 'Soprano'),
      ('carlos.e@tec.mx', 'Carlos Elizondo', 'A01755443', 'Tec Campus Laguna (Torreón)', 'STUDENT', 'ACTIVE', 'Ensamble Musical Tec', 'MUSICA', 'Batería & Percusión'),
      ('diego.v@tec.mx', 'Diego Villalobos', 'A01712345', 'Tec Campus Laguna (Torreón)', 'STUDENT', 'PENDING_APPROVAL', 'Comedia Musical 2026', 'BAILE', 'Danza Contemporánea'),
      ('mariana.cantu@outlook.com', 'Mariana Cantú', 'A01799881', 'Tec Campus Laguna (Torreón)', 'STUDENT', 'PENDING_APPROVAL', 'Ensamble Musical Tec', 'MUSICA', 'Trompeta 1')
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('✅ Usuarios e integrantes creados en Neon DB.');

  // Insert initial rehearsals
  await executeSql(`
    INSERT INTO rehearsals (title, company_name, discipline, target_sections, rehearsal_date, start_time, end_time, location, description, qr_check_in_code)
    VALUES 
      ('Ensayo General - Gala de Invierno Tec', 'Ensamble Musical Tec', 'MUSICA', ARRAY['Saxofón', 'Trompeta', 'Percusión'], '2026-08-13', '17:00', '20:00', 'Salón de Ensamble A-101', 'Ensayo de montaje completo. Traer partitura de Huapango de Moncayo.', 'QR-ENSAYO-GALA-2026'),
      ('Seccional de Canto & Armonía Vocal', 'Ensamble Musical Tec', 'CANTO', ARRAY['Soprano', 'Tenor', 'Alto'], '2026-08-15', '16:00', '18:00', 'Estudio de Canto C-05', 'Ajuste de afinación y matices en voces.', 'QR-CANTO-VOCAL-8821')
    ON CONFLICT DO NOTHING;
  `);
  console.log('✅ Ensayos creados en Neon DB.');

  // Insert initial songs
  await executeSql(`
    INSERT INTO songs (title, composer, company_name, genre, song_key, duration_seconds)
    VALUES 
      ('Huapango de Moncayo (Arr. Big Band Tec)', 'José Pablo Moncayo', 'Ensamble Musical Tec', 'Sinfónico Fusión', 'C Mayor', 380),
      ('Uptown Funk (Medley)', 'Mark Ronson / Bruno Mars', 'Ensamble Musical Tec', 'Funk / Pop', 'D Menor', 260)
    ON CONFLICT DO NOTHING;
  `);
  console.log('✅ Canciones del repertorio creadas en Neon DB.');

  console.log('🎉 ¡SEEDED CON ÉXITO EN NEON POSTGRES!');
}

seed();
