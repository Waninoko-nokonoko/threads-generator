export const config = { maxDuration: 60 };

const MOEGI_DATA = `
## MOEGIメルマガ過去データ分析

### 購入が出たメルマガの共通点
1. 2026/02/19「MOEGIが値段で比べてほしくない理由」CTR1.69% CV0.56
   → MOEGIのこだわり・素材をしっかり伝えた。購入1件。
2. 2026/05/07「本日まで！母の日にMOEGI」CTR1.78% CV0.59
   → 期限（本日まで）が明確。緊急性あり。
3. 2026/05/14「GW後の身体をリセット！ケストースのご案内」CTR2.4% CV0.6
   → 季節の体の変化と商品を直結。具体的なシーン。

### CTR高いが購入0のパターン（改善が必要）
-「-3kg」「ファスティング」系：興味を引くが購入動機にならない
- 教育系（成分・健康知識）：読まれるが買う理由にならない
- 花粉・インフル等の季節系：タイミングが遅いと効果なし
- ターゲット訴求「40〜50代女性へ」：弱い、CVに繋がらない

### 件名の勝ちパターン
- 数字・具体性：「平熱36.7度へ」「-3kg」「3日で」
- 緊急性：「本日まで」「本日解禁」「数量限定」
- 驚き・疑問：「〇〇が凄い！」「実は〇〇不足！？」「値段で比べてほしくない理由」
- NGパターン：「40〜50代女性へ」「会員様限定コラム」→ 開封動機にならない

### 購入につながる本文の法則
- 今買う理由（期限・限定・季節）を必ず入れる
- 体験談・具体的な変化を入れる（平熱が35度→36度）
- こだわり・素材の話は購入動機になる
- ファスティング文脈は興味は引くが購入に直結しにくい

### MOEGIブランド基本情報
- 植物発酵エキス原液・水不使用・2年半熟成・33種オーガニック素材
- ターゲット：40〜50代女性
- 特徴：素になれる自分、体の内側からのケア
- 商品：MOEGI原液、MOEGIブルーベリー、ケストース等
`;

const NEWSLETTER_RULES = `
## 売れるメルマガのルール

### 構成
1. 件名：開封させる（数字・緊急性・驚き）
2. 書き出し：共感・悩みに刺さる一文
3. 本文：体験談・具体的変化・こだわりを伝える
4. CTA：今買う理由（期限・限定・季節）を明確に
5. 締め：背中を押す一文

### 文体
- 親しみやすい・話しかけるような口語体
- 短文・改行多め
- 「です・ます」より「ですよね」「ましたよ」などの柔らかい表現
- 難しい成分名は避けるかひらがなで補足

### 絶対入れること
- 今買う理由（期限・限定・季節感）
- 具体的な数字か体験談
- 読者の悩みへの共感

### 文字数
- 件名：20〜30字
- 本文：600〜1000字
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

    const prompt = `あなたはMOEGIというブランドのメルマガ専門家です。

${MOEGI_DATA}

${NEWSLETTER_RULES}

## 依頼
以下の条件でMOEGIのメルマガを作成してください。

### 今回の条件
- テーマ：${theme}
- 緊急性・期限：${urgency || 'なし（通常配信）'}
- 季節・時期的な背景：${season || 'なし'}
- 追加情報：${extra || 'なし'}

### 出力形式（必ずこの形式で）
---
【件名案1】
（件名）

【件名案2】
（件名）

【件名案3】
（件名）

---
【本文】
（メルマガ本文をここに。書き出し〜CTA〜締めまで完全版）

---
【改善ポイント】
（今回このメルマガが売れる理由・工夫した点を3つ箇条書き）
---`;

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
