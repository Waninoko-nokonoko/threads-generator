export const config = { maxDuration: 60 };

const BRAND_PROMPTS = {
  'DR.WU': (context, tone, examples, instagramUrl, research) => `あなたはDR.WUブランドのThreads投稿専門家です。

## DR.WUブランドについて
- 皮膚科医監修のスキンケアブランド
- ターゲット：肌悩みを持つ20〜40代女性
- トーン：知識提供型・信頼感・共感ベース
- 最終ゴール：Instagramの投稿に誘導する

## DR.WU Threads投稿フォーマット（3投稿スレッド形式）

▼ 投稿1（フック）
- 読者のあるある肌悩みを短く2行で
- 疑問形 or あるある文体
- スクロールを止める一文が命

▼ 投稿2（リフレーム）
- 「それは〜じゃなくて『...』というのが正確な話です。」の構文で知識提供
- 皮膚科学的な視点や意外な事実
- 短め・具体的

▼ 投稿3（Instagram誘導）
- 「詳しくはインスタの投稿で解説してます👇」のような一文
- インスタURLを載せる
${instagramUrl ? `- URL：${instagramUrl}` : '- （URLは別途入力）'}
- ハッシュタグ5個：最後の2個は #DR_WU #皮膚科医コスメ 固定

${research ? `## 現在のThreadsトレンド（参考）\n${research}\n` : ''}
${examples.length > 0 ? `## 過去の参考例（このスタイルに合わせてください）\n${examples.map((e, i) => `### 参考例${i+1}\n${e.content}`).join('\n\n')}\n` : ''}

## 指示
添付されたInstagram投稿画像の内容を分析し、上記フォーマットに従ったDR.WU Threads投稿を3パターン作成してください。

### 条件
- 追加コンテキスト：${context || 'なし'}
- 各パターンで異なるフックアプローチを使う
- 投稿2のリフレーム構文は必須

### 出力形式（必ずこの形式で）
---
【パターン1：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（リフレーム）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン2：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（リフレーム）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン3：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（リフレーム）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）
---`,

  'MOEGI': (context, tone, examples, instagramUrl, research) => `あなたはMOEGIブランドのThreads投稿専門家です。

## MOEGIブランドについて
- 植物発酵エキス原液・水不使用・2年半熟成・33種オーガニック素材の酵素ドリンク
- ブランドビジョン：「素になれる自分」×「人が主役」
- 商品押し売りNG。人の内側・生き方・変化にフォーカス
- トーン：温かみ・寄り添い・自然体
- 最終ゴール：Instagramの投稿に誘導する

## MOEGI Threads投稿フォーマット（3投稿スレッド形式）

▼ 投稿1（フック）
- 「素になれる」「自分を取り戻す」系の共感フック
- 商品ではなく、読者の感情・生き方・日常に寄り添う一文
- 短く・心に刺さるように

▼ 投稿2（本文）
- 人の体験・変化・内側の話
- 商品の特徴は「だから〜できた」という文脈で語る
- 具体的エピソードや描写で共感を生む

▼ 投稿3（Instagram誘導）
- 「もっと詳しくはインスタで↓」のような自然な誘導
- Instagramの投稿URLを載せる
${instagramUrl ? `- URL：${instagramUrl}` : '- （URLは別途入力）'}
- ハッシュタグ3〜5個（MOEGI関連）

${research ? `## 現在のThreadsトレンド（参考）\n${research}\n` : ''}
${examples.length > 0 ? `## 過去の参考例（このスタイルに合わせてください）\n${examples.map((e, i) => `### 参考例${i+1}\n${e.content}`).join('\n\n')}\n` : ''}

## 指示
添付されたInstagram投稿画像の内容を分析し、上記フォーマットに従ったMOEGI Threads投稿を3パターン作成してください。

### 条件
- 追加コンテキスト：${context || 'なし'}
- 各パターンで異なる切り口（生き方・体験・感情）を使う
- 商品説明にならないよう注意

### 出力形式（必ずこの形式で）
---
【パターン1：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（本文）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン2：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（本文）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン3：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（本文）

▼ 投稿3
（Instagram誘導 + URL + ハッシュタグ）
---`,

  'KuON': (context, tone, examples, instagramUrl, research) => `あなたはKuONブランドのThreads投稿専門家です。

## KuONブランドについて
- 日本の美意識・ライフスタイルブランド
- 詩的・情緒的な世界観。季節・自然・日常の美しさを語る
- トーン：文学的・余白のある文体・情景描写
- 最終ゴール：Instagramの投稿に誘導する

## KuON Threads投稿フォーマット（4投稿スレッド形式）

▼ 投稿1（フック）
- 詩的な一文・情景描写・問いかけ
- 読む人を独自の世界観に引き込む

▼ 投稿2（展開1）
- フックの世界観を深掘り
- 具体的な情景や感覚の描写
- 短文・余白を大切に

▼ 投稿3（展開2）
- ブランド・商品・コンセプトとの接続
- 「だから〜」「そういう〜」で自然につなぐ
- 押しつけない・余韻を残す

▼ 投稿4（Instagram誘導）
- 「続きはインスタで。」「詳しくはこちら↓」などシンプルな誘導
- InstagramのURLを載せる
${instagramUrl ? `- URL：${instagramUrl}` : '- （URLは別途入力）'}
- ハッシュタグ3〜5個（KuON関連）

${research ? `## 現在のThreadsトレンド（参考）\n${research}\n` : ''}
${examples.length > 0 ? `## 過去の参考例（このスタイルに合わせてください）\n${examples.map((e, i) => `### 参考例${i+1}\n${e.content}`).join('\n\n')}\n` : ''}

## 指示
添付されたInstagram投稿画像の内容を分析し、上記フォーマットに従ったKuON Threads投稿を3パターン作成してください。

### 条件
- 追加コンテキスト：${context || 'なし'}
- 各パターンで異なる情景・切り口を使う
- 世界観を統一し、押しつけない文体で

### 出力形式（必ずこの形式で）
---
【パターン1：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（展開1）

▼ 投稿3
（展開2）

▼ 投稿4
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン2：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（展開1）

▼ 投稿3
（展開2）

▼ 投稿4
（Instagram誘導 + URL + ハッシュタグ）

---
【パターン3：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（展開1）

▼ 投稿3
（展開2）

▼ 投稿4
（Instagram誘導 + URL + ハッシュタグ）
---`,
};

const GENERIC_PROMPT = (context, tone, images, examples, instagramUrl, research) => {
  const toneMap = {
    casual: 'フレンドリーでカジュアル、親しみやすい口語体',
    professional: 'プロフェッショナルだが親しみやすい、信頼感のある文体',
    inspiring: '感情を動かす、心に響くインスピレーション系',
    funny: 'ユーモアがあり、思わず笑えるような軽いトーン',
  };

  return `あなたはThreads（スレッズ）のバズり投稿専門家です。

## Threadsバズりパターン
- 最初の1行が命：スクロールを止めるフックを必ず入れる
- 短文・改行多め：視覚的リズムを作る
- 結論ファースト：最初に答えを見せる
- 最後は質問か行動促進で締める

## スレッド形式
Threadsでは「連続投稿（スレッド）」形式が最もバズりやすい。
- 1投稿目：強烈なフック
- 2〜3投稿目：中身・根拠・共感
- 最終投稿：結論＋Instagram誘導

${research ? `## 現在のThreadsトレンド（参考）\n${research}\n` : ''}
${examples.length > 0 ? `## 過去の参考例\n${examples.map((e, i) => `### 参考例${i+1}${e.brand ? `（${e.brand}）` : ''}\n${e.content}`).join('\n\n')}\n` : ''}

## 指示
添付されたInstagram投稿画像（${images}枚）の内容を分析し、Threadsでバズるスレッド形式の投稿を3パターン作成してください。

### 条件
- トーン：${toneMap[tone] || toneMap.casual}
- 追加コンテキスト：${context || 'なし'}
- 各パターンで異なる構成型を使う
- 最終投稿にInstagram誘導を入れる${instagramUrl ? `（URL：${instagramUrl}）` : ''}

### 出力形式（必ずこの形式で）
---
【パターン1：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋Instagram誘導${instagramUrl ? `\n${instagramUrl}` : ''}）
#タグ1 #タグ2

---
【パターン2：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋Instagram誘導${instagramUrl ? `\n${instagramUrl}` : ''}）
#タグ1 #タグ2

---
【パターン3：○○型】

▼ 投稿1
（フック）

▼ 投稿2
（中身）

▼ 投稿3
（中身）

▼ 投稿4（最終）
（結論＋Instagram誘導${instagramUrl ? `\n${instagramUrl}` : ''}）
#タグ1 #タグ2
---`;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { images, tone, context, examples, research, instagramUrl } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: '画像をアップロードしてください' });
    }

    const imageContents = images.map(({ base64, mediaType }) => ({
      type: 'image',
      source: { type: 'base64', media_type: mediaType || 'image/png', data: base64 },
    }));

    // ブランド検出
    const BRANDS = ['DR.WU', 'MOEGI', 'KuON'];
    const detectedBrand = BRANDS.find(b => (context || '').toUpperCase().includes(b.toUpperCase()));

    // ブランドフィルタリング
    const filteredExamples = examples && examples.length > 0
      ? (detectedBrand
          ? examples.filter(e => !e.brand || e.brand === detectedBrand)
          : examples)
      : [];

    let prompt;
    if (detectedBrand && BRAND_PROMPTS[detectedBrand]) {
      prompt = BRAND_PROMPTS[detectedBrand](context, tone, filteredExamples, instagramUrl || '', research || '');
    } else {
      prompt = GENERIC_PROMPT(context, tone, images.length, filteredExamples, instagramUrl || '', research || '');
    }

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
