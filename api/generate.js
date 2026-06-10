export const config = { maxDuration: 60 };

const BUZZ_PATTERNS = `
## Threadsバズりパターン（必須知識）

### 構成の型
1. **逆説フック型**：「〇〇は間違い」「実は〇〇だった」→ 驚き→説明→結論
2. **共感+解決型**：「〇〇で悩んでいる人へ」→ 共感→解決策→行動促進
3. **数字・リスト型**：「〇〇な人の3つの特徴」→ 具体的数字で信頼感
4. **ストーリー型**：「〇〇だった私が→今は〇〇」→ 変化・成長を見せる
5. **問いかけ型**：質問で始める→コメント誘発→アルゴリズム評価UP

### 文章ルール
- 最初の1行が命：スクロールを止めるフックを必ず入れる
- 短文・改行多め：視覚的リズムを作る（1文1〜2行）
- 結論ファースト：最初に答えを見せる
- 逆説・数字・感情語を積極使用
- 最後は質問か行動促進で締める（コメント誘発）
- 文字数目安：150〜300字（長すぎない）
- ハッシュタグ：2〜3個まで（多すぎるとスパム判定）

### 絶対NG
- 長い前置き
- 硬い文章・敬語すぎる
- ハッシュタグ10個以上
- 「です・ます」の連続
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { images, tone, context } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: '画像をアップロードしてください' });
    }

    const imageContents = images.map(({ base64, mediaType }) => ({
      type: 'image',
      source: { type: 'base64', media_type: mediaType || 'image/png', data: base64 },
    }));

    const toneMap = {
      casual: 'フレンドリーでカジュアル、親しみやすい口語体',
      professional: 'プロフェッショナルだが親しみやすい、信頼感のある文体',
      inspiring: '感情を動かす、心に響くインスピレーション系',
      funny: 'ユーモアがあり、思わず笑えるような軽いトーン',
    };

    const prompt = `あなたはThreads（スレッズ）のバズり投稿専門家です。

${BUZZ_PATTERNS}

## スレッド形式について
Threadsでは「連続投稿（スレッド）」形式が最もバズりやすい。
- 1投稿目：強烈なフック（続きが気になる一文）
- 2〜3投稿目：中身・根拠・共感
- 最終投稿：結論＋質問やCTA（コメント誘発）
各投稿は独立して読めるが、つながって読むと完結する構成にする。

## 指示
添付されたInstagram投稿画像（${images.length}枚）の内容を分析し、Threadsでバズるスレッド形式の投稿を3パターン作成してください。

### 条件
- トーン：${toneMap[tone] || toneMap.casual}
- 追加コンテキスト：${context || 'なし'}
- 各パターンで異なる構成型を使う
- 1投稿あたり50〜150字（短く読みやすく）
- 各スレッドは3〜4投稿で構成
- 画像の内容・メッセージを活かす

### 出力形式（必ずこの形式で）
---
【パターン1：○○型】

▼ 投稿1
（フックの文章）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋質問）
#タグ1 #タグ2

---
【パターン2：○○型】

▼ 投稿1
（フックの文章）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋質問）
#タグ1 #タグ2

---
【パターン3：○○型】

▼ 投稿1
（フックの文章）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋質問）
#タグ1 #タグ2
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
        messages: [
          {
            role: 'user',
            content: [...imageContents, { type: 'text', text: prompt }],
          },
        ],
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
