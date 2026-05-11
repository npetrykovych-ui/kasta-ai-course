const AIRTABLE_TOKEN = 'patCnxaQebfKDAqEr.81afa0b3576f63c690654ea9966e4dc6a5dd53799c62f7506f831afe95c7bae4';
const AIRTABLE_BASE  = 'appcFpBqrlD4DXCu8';
const AIRTABLE_URL   = `https://api.airtable.com/v0/${AIRTABLE_BASE}`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const now  = new Date().toISOString();
    let table, fields;

    if (data.type === 'registration') {
      table  = 'Реєстрації';
      fields = {
        studentId: data.studentId,
        name:      data.name,
        email:     data.email,
        team:      data.team,
        date:      now
      };
    } else if (data.type === 'lesson') {
      table  = 'Прогрес';
      fields = {
        studentId:  data.studentId,
        name:       data.name,
        team:       data.team,
        moduleId:   String(data.modId),
        moduleName: data.modName,
        lessonId:   String(data.lesId),
        date:       now,
        minutes:    String(data.minutes || 0)
      };
    } else if (data.type === 'quiz') {
      table  = 'Квізи';
      fields = {
        studentId:     data.studentId,
        name:          data.name,
        team:          data.team,
        moduleId:      String(data.modId),
        questionIndex: String(data.qIdx),
        answer:        data.answer,
        correct:       data.correct ? 'Правильно' : 'Неправильно',
        date:          now
      };
    } else {
      return res.status(400).json({ error: 'Unknown type' });
    }

    const response = await fetch(`${AIRTABLE_URL}/${encodeURIComponent(table)}`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result });
    }

    return res.status(200).json({ ok: true, id: result.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
