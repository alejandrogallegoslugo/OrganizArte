export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { query, params } = body;

    const NEON_CONNECTION_STRING = context.env.DATABASE_URL || 'postgresql://neondb_owner:npg_WVklraewq69t@ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
    const NEON_HTTP_ENDPOINT = 'https://ep-restless-forest-axusb0wu-pooler.c-4.us-east-2.aws.neon.tech/sql';

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
      return new Response(JSON.stringify({ error: errorText, rows: [] }), {
        status: neonResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data: any = await neonResponse.json();
    return new Response(JSON.stringify({ rows: data.rows || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, rows: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
