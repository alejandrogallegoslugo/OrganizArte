const connectionString = 'postgresql://neondb_owner:npg_WVklraewq69t@ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const endpoint = 'https://ep-restless-forest-axusb0wu.c-4.us-east-2.aws.neon.tech/sql';

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

async function main() {
  console.log('⚡ Creando Catálogos del Sistema en Neon Postgres...');

  const catalogQueries = [
    // 1. Disciplines Catalog
    `CREATE TABLE IF NOT EXISTS catalog_disciplines (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🎭',
      description TEXT
    );`,
    `INSERT INTO catalog_disciplines (code, name, emoji, description) VALUES
      ('TEATRO_MUSICAL', 'Teatro Musical (Multidisciplinar)', '🎭', 'Integración de Canto, Actuación y Danza'),
      ('MUSICA', 'Música / Orquesta / Bandas', '🎵', 'Instrumentistas y Foso Orquestal'),
      ('CANTO', 'Canto / Vocal / Coros', '🎤', 'Cantantes Solistas y Elenco Vocal'),
      ('BAILE', 'Baile / Danza / Ballets', '💃', 'Cuerpo de Baile y Coreografías'),
      ('TEATRO', 'Teatro / Actuación Drama', '🎬', 'Actores de Texto y Drama'),
      ('STAFF', 'Staff / Producción Técnica', '🛠️', 'Escenografía, Iluminación y Audio')
    ON CONFLICT (code) DO NOTHING;`,

    // 2. Role Categories Catalog
    `CREATE TABLE IF NOT EXISTS catalog_role_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '⭐'
    );`,
    `INSERT INTO catalog_role_categories (code, name, emoji) VALUES
      ('PRINCIPAL', 'Rol Principal / Protagonista', '⭐'),
      ('CO_ESTELAR', 'Co-Estelar / Secundario', '✨'),
      ('ENSAMBLE', 'Ensamble / Cuerpo de Baile', '💃'),
      ('FOSO_MUSICAL', 'Foso Orquestal / Músico', '🎻'),
      ('STAFF', 'Staff Técnico / Tramoya', '🛠️')
    ON CONFLICT (code) DO NOTHING;`,

    // 3. Assignment Types Catalog
    `CREATE TABLE IF NOT EXISTS catalog_assignment_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    );`,
    `INSERT INTO catalog_assignment_types (code, name, description) VALUES
      ('TITULAR', '👑 Titular Principal', 'Integrante principal asignado al papel'),
      ('UNDERSTUDY', '🔄 Understudy (Suplente Principal)', 'Suplente para roles protagónicos'),
      ('SWING', '🔀 Swing (Suplente Ensamble)', 'Suplente multifuncional para cuerpo de baile')
    ON CONFLICT (code) DO NOTHING;`,

    // 4. Justification Reasons Catalog
    `CREATE TABLE IF NOT EXISTS catalog_justification_reasons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      requires_document BOOLEAN DEFAULT true
    );`,
    `INSERT INTO catalog_justification_reasons (code, name, requires_document) VALUES
      ('ACADEMIC_EXAM', 'Examen Parcial / Carga Académica Tec', true),
      ('HEALTH_ILLNESS', 'Enfermedad / Justificante Médico', true),
      ('FAMILY_EMERGENCY', 'Emergencia Familiar Directa', false),
      ('OFFICIAL_TEC_EVENT', 'Evento Oficial Representativo Tec', true)
    ON CONFLICT (code) DO NOTHING;`,

    // Enable RLS on all Catalog Tables
    `ALTER TABLE catalog_disciplines ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE catalog_role_categories ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE catalog_assignment_types ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE catalog_justification_reasons ENABLE ROW LEVEL SECURITY;`,

    `DROP POLICY IF EXISTS disc_all ON catalog_disciplines;`,
    `CREATE POLICY disc_all ON catalog_disciplines FOR ALL USING (true);`,

    `DROP POLICY IF EXISTS role_cat_all ON catalog_role_categories;`,
    `CREATE POLICY role_cat_all ON catalog_role_categories FOR ALL USING (true);`,

    `DROP POLICY IF EXISTS assign_type_all ON catalog_assignment_types;`,
    `CREATE POLICY assign_type_all ON catalog_assignment_types FOR ALL USING (true);`,

    `DROP POLICY IF EXISTS just_reason_all ON catalog_justification_reasons;`,
    `CREATE POLICY just_reason_all ON catalog_justification_reasons FOR ALL USING (true);`
  ];

  for (let i = 0; i < catalogQueries.length; i++) {
    await executeSql(catalogQueries[i]);
    console.log(`✅ Catálogo Query ${i + 1} ejecutada.`);
  }

  const res = await executeSql('SELECT * FROM catalog_disciplines;');
  console.log('📚 Catálogo de Disciplinas en Neon DB:', res.rows);
}

main();
