export const config = { maxDuration: 60 };

const DRWU_SERIES_COLORS = `
DR.WUシリーズカラー：
- ヒアルコンプレクス（保湿）：青系 #1a5276
- マンデリック（角質/毛穴）：赤系 #c0392b
- スクワランエクス（バリア修復）：ゴールド/オフホワイト
- UV/サンスクリーン：白 #ffffff
- エイジヴァーサル（エイジング）：黒 #1a1a1a
- グルタライトC（美白）：白×ゴールド
- レチノール：ゴールド
- シカ/センシファイト：グリーン
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { brand, slides, colorHint } = req.body;

    if (!slides || slides.length === 0) return res.status(400).json({ error: 'スライドテキストを入力してください' });

    const brandName = brand === 'moegi' ? 'MOEGI' : 'DR.WU';
    const colorInfo = brand === 'drwu' ? DRWU_SERIES_COLORS : `MOEGIカラー：グリーン系 #4a7c59、ゴールドアクセント #d4a843`;

    const slidesText = slides.map((text, i) => `【スライド${i + 1}】\n${text}`).join('\n\n');

    const prompt = `あなたはInstagramカルーセルのデザインディレクターです。
以下のスライドテキストをもとに、Canvaで制作するためのレイアウト指示書を作成してください。

ブランド：${brandName}
${colorInfo}
${colorHint ? `補足：${colorHint}` : ''}

## スライドテキスト
${slidesText}

## 出力ルール
各スライドのCanva制作指示を以下の形式で出力する。
ASCII図で要素の位置・構造・サイズ感を具体的に描くこと。矢印・内部ボックス・区切り線も活用する。

出力形式（全スライド分）：

===スライド1===
┌──────────────────────────┐
│ （レイアウトを詳細に図示） │
│ 背景・要素配置・装飾を   │
│ 具体的に描く             │
└──────────────────────────┘
制作メモ：（フォント・素材キーワード・Canva操作のコツ）

===スライド2===
...（同様に全スライド分）`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.error?.message || 'API error' });
    }

    const data = await response.json();
    return res.status(200).json({ result: data.content[0].text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
