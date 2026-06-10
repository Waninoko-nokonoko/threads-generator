export const config = { maxDuration: 60 };

const MOEGI_DATA = `
## MOEGIメルマガ過去データ分析

### 購入につながったメルマガの共通点
1. 2/19「MOEGIが値段で比べてほしくない理由」CTR1.69% CV0.56
   → こだわり・素材をしっかり伝えた
2. 5/7「本日まで！母の日にMOEGI」CTR1.78% CV0.59
   → 期限（本日まで）が明確で緊急性あり
3. 5/14「GW後の身体をリセット！ケストースのご案内」CTR2.4% CV0.6
   → 季節の体の変化と商品を直結・具体的なシーン

### CTR高いのに購入0の原因
- ダイエット系「-3kg」「ファスティング」：興味は引くが購入動機にならない
- 教育系（成分・健康知識）：読まれるが買う理由にならない
- 「今買う理由」がないと購入につながらない

### 件名勝ちパターン
- 数字・具体性：「平熱36.7度へ」「3日で」「2週間で」
- 緊急性：「本日まで」「本日解禁」「残りわずか」「〇日まで」
- 驚き・疑問：「実は〇〇不足！？」「値段で比べてほしくない理由」「凄い！」
- NGパターン：「40〜50代女性へ」「会員様限定コラム」→ 開封動機にならない

### MOEGIブランド情報
- 植物発酵エキス原液・水不使用・2年半熟成・33種オーガニック素材
- ターゲット：40〜50代女性
- コンセプト：素になれる自分、体の内側からのケア
- 商品：MOEGI原液、MOEGIブルーベリー、ケストース等
`;

const NEWSLETTER_RULES = `
## 売れるメルマガの構成（必ず守ること）

### 件名のルール
- 20〜30字以内
- 数字・緊急性・驚き・疑問のどれかを入れる
- 「今日読まないと損」と思わせる
- NGワード：「会員様限定」「40〜50代女性へ」「コラム」

### 本文の構成（この順番で必ず書く）
1. 【書き出し】読者の悩み・状況への共感（2〜3行）
2. 【問題提起】なぜその悩みが起きているのかの原因（3〜4行）
3. 【解決策】MOEGIがどう解決するか（具体的に、4〜5行）
4. 【根拠・こだわり】素材・製法・体験談（3〜4行）
5. 【今買う理由】期限・限定・季節感（必ず入れる）（2〜3行）
6. 【CTA】購入ボタンへの誘導（1〜2行）
7. 【締め】一言添えて距離を縮める（1〜2行）

### 文体のルール
- 話しかけるような口語体
- 短文・改行多め（1〜2文で改行）
- 読者に「そうそう！」と思わせる共感語を入れる
- 難しい成分名はひらがなで補足
- 全体の文字数：700〜1000字

### 絶対入れること
- 今買う理由（期限・限定・季節）→ ないと買わない
- 具体的な数字か体験談
- 読者の悩みへの共感
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { theme, urgency, season, extra } = req.body;

    if (!theme) return res.status(400).json({ error: 'テーマを入力してください' });

    const prompt = `あなたはECサイト向けメルマガの専門家です。MOEGIというブランドのメルマガを作成します。

${MOEGI_DATA}

${NEWSLETTER_RULES}

## 今回の依頼
- テーマ：${theme}
- 緊急性・期限：${urgency || '特になし（季節感や限定感で工夫すること）'}
- 季節・時期の背景：${season || '特になし'}
- 追加情報：${extra || 'なし'}

## 出力ルール
必ず以下の形式で出力すること。各セクションは「===セクション名===」で区切る。

===件名1===
（件名テキストのみ）
===件名2===
（件名テキストのみ）
===件名3===
（件名テキストのみ）
===本文===
（メルマガ本文。書き出し〜締めまで完全版。700〜1000字）
===改善ポイント===
（箇条書き3点。なぜ売れる構成なのかの解説）`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
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
