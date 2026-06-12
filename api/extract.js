export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { base64, mediaType } = req.body;
  if (!base64) return res.status(400).json({ error: 'image required' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: base64 } },
          { type: 'text', text: 'このThreads投稿のスクリーンショットから、投稿本文のテキストだけを抽出してください。ユーザー名・日時・いいね数などのUIは除外し、投稿文章のみを改行も含めてそのまま出力してください。' }
        ]
      }]
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    return res.status(500).json({ error: err.error?.message });
  }

  const data = await response.json();
  return res.status(200).json({ content: data.content[0].text });
}
