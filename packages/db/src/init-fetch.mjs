const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable required');
  process.exit(1);
}

console.log('Connecting to Neon DB securely via DATABASE_URL environment variable...');
