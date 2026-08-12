import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const NEON_CONNECTION_STRING = process.env.DATABASE_URL;
const NEON_HTTP_ENDPOINT = 'https://ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/sql';

app.post('/api/db', async (req, res) => {
  try {
    const { query, params } = req.body;
    if (!NEON_CONNECTION_STRING) {
      return res.status(500).json({ error: 'DATABASE_URL environment variable is missing', rows: [] });
    }

    const neonResponse = await fetch(NEON_HTTP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': NEON_CONNECTION_STRING,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!neonResponse.ok) {
      const errorText = await neonResponse.text();
      return res.status(neonResponse.status).json({ error: errorText, rows: [] });
    }

    const data = await neonResponse.json();
    return res.json({ rows: data.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message, rows: [] });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`⚡ Local DB Proxy running on http://localhost:${PORT}`);
});
