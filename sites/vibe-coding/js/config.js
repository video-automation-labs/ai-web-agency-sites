// ============================================================
// バイブコーディング — VIBE CODING STUDIO サイト設定
// 月夜テンプレート（sites/tsukiyo）からの転用。文言はここだけで管理する。
// ============================================================

export const SITE = {
  brandJa: 'バイブコーディング',
  tagline: '言葉が、そのまま作品になる。',
  brandEn: 'VIBE CODING STUDIO — AI-NATIVE WEB & AUTOMATION',
  scrollCue: '夜の庭へ',

  presenceLine: 'この夜景は、画像も動画も使っていません。AIとの対話だけで、コードから生まれました。あなたの仕事にも、同じ魔法を。',
  presenceSign: '―― 小林優希 / VIBE CODING STUDIO',

  // 料金階段（金額ではなく「成果物」で階段を作る）
  features: [
    {
      title: 'AI導入相談',
      en: 'CONSULTATION — ¥10,000',
      copy: 'まずは1時間、あなたの業務を一緒に棚卸し。AIで何がどこまで変わるのか、進む方向を決めて持ち帰れます。',
    },
    {
      title: 'スターター構築',
      en: 'STARTER — ¥100,000',
      copy: 'AI社員を1人、あなたのPCで稼働させるまで伴走。文章作成・調査・資料づくりを任せられる状態でお渡しします。',
    },
    {
      title: '業務構築',
      en: 'WORKFLOW — ¥300,000',
      copy: 'ひとつの業務を丸ごとAI化。手順の整理から自動化・運用ルールづくりまで、「毎日回る仕組み」として構築します。',
    },
    {
      title: 'AI組織構築',
      en: 'AI TEAM — ¥500,000',
      copy: 'AI社員のチームを設計・構築。営業・経理・制作が連携して動く、小さなAI会社をあなたの手元に。',
    },
  ],

  ctaTitle: 'AIと、はじめましょう。',
  ctaCopy: 'AI導入・バイブコーディング・世界観サイト制作のご相談はお気軽に。まずは1通のメールから。',
  ctaLinks: [
    { label: 'ご相談はこちら', href: 'mailto:yuki1990bado@gmail.com' },
    { label: 'その他の制作例', href: '../../index.html' },
  ],

  finLine: '言葉で、創る時代へ。',
  finCredit: '© VIBE CODING STUDIO — built with three.js / WebGPU',
};

// 音の性格（生成アンビエントの設定）
export const AUDIO = {
  root: 164.81, // E3
  scale: [0, 1, 5, 7, 8], // 陰旋法
  pluckEvery: [1.8, 4.2],
  padLevel: 0.14,
  pluckLevel: 0.13,
  brightness: 950,
};

// 夜景の配色
export const PALETTE = {
  bg: '#060811',
  fogNear: 14,
  fogFar: 78,
  moon: '#f4efdc',
  moonHalo: '#e8e0c2',
  moonHaloFar: '#c9c2a6',
  waterDeep: '#040610',
  waterShallow: '#0b1430',
  glint: '#e9e2c6',
  petalBase: '#f3d7de',
  petalTint: '#d87a8f',
  firefly: '#ffd27f',
};
