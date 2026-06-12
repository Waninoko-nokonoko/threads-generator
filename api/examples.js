export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (req.method === 'POST') {
    const { content, brand } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const response = await fetch(`${supabaseUrl}/rest/v1/examples`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ content, brand: brand || null }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const response = await fetch(`${supabaseUrl}/rest/v1/examples?select=content,brand&order=created_at.desc&limit=20`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
