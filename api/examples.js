export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'POST') {
    const { content, brand } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const response = await fetch(`${supabaseUrl}/rest/v1/examples`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ content, brand: brand || null }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const response = await fetch(`${supabaseUrl}/rest/v1/examples?select=id,content,brand,created_at&order=created_at.desc&limit=50`, {
      headers,
    });
    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
    const data = await response.json();
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });

    const response = await fetch(`${supabaseUrl}/rest/v1/examples?id=eq.${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) return res.status(500).json({ error: 'Delete failed' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
