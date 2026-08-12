export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { imageBase64 } = body;
    const apiKey = context.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'GEMINI_API_KEY not configured on server',
        courses: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const prompt = `
      Eres un asistente experto para el sistema OrganizArte del Tec de Monterrey.
      Analiza esta captura de pantalla de horario de MiTec / Canvas y extrae todas las materias registradas.
      Responde EXCLUSIVAMENTE en formato JSON con la siguiente estructura:
      {
        "studentMatricula": "A00000000",
        "confidenceScore": 0.98,
        "courses": [
          {
            "name": "Nombre de la Materia",
            "dayOfWeek": "Lunes",
            "startTime": "09:00",
            "endTime": "11:00"
          }
        ]
      }
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/png', data: cleanBase64 } }
            ]
          }
        ],
        generationConfig: { response_mime_type: 'application/json' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: errText, courses: [] }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const geminiData = await response.json();
    const jsonText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsedJSON = JSON.parse(jsonText);

    return new Response(JSON.stringify(parsedJSON), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, courses: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
