const AIRTABLE_TOKEN = 'patCnxaQebfKDAqEr.81afa0b3576f63c690654ea9966e4dc6a5dd53799c62f7506f831afe95c7bae4';
const AIRTABLE_BASE  = 'appcFpBqrlD4DXCu8';
const AIRTABLE_URL   = `https://api.airtable.com/v0/${AIRTABLE_BASE}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { table, offset } = req.query;
  if (!table) return res.status(400).json({ error: 'No table' });

  try {
    const url = `${AIRTABLE_URL}/${encodeURIComponent(table)}?pageSize=100${offset?'&offset='+offset:''}`;
    const r   = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
    });
    const d = await r.json();
    return res.status(200).json(d);
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
