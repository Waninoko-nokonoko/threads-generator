export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { brand, context } = req.body;

    const brandHint = brand ? `${brand}ブランドの` : '';
    const contextHint = context ? `（テーマ：${context}）` : '';

    const searchPrompt = `${brandHint}Threadsで現在バズっている投稿のパターンとトレンドを調査してください${contextHint}。

以下を調べてまとめてください：
1. 日本のThreadsでバズっている投稿の特徴（2024-2025年）
2. スキンケア・健康・ライフスタイル系でバズる投稿のパターン
3. フック文・冒頭の書き方のトレンド
4. バズるスレッド投稿の構成テンプレート

調査結果を箇条書きで簡潔にまとめてください。`;

    const messages = [{ role: 'user', content: searchPrompt }];

    let response;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages,
        }),
      });

      if (!apiRes.ok) {
        const error = await apiRes.json();
        return res.status(500).json({ error: error.error?.message || 'Research API error' });
      }

      response = await apiRes.json();
      attempts++;

      if (response.stop_reason === 'pause_turn') {
        // Server-side tool loop needs continuation
        messages.push({ role: 'assistant', content: response.content });
        messages.push({ role: 'user', content: '続けてください。' });
        continue;
      }

      break;
    }

    // Extract text from response content blocks
    const text = (response.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    return res.status(200).json({ research: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
