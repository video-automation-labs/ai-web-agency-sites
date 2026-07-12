// ============================================================
// 月夜 -TSUKIYO- サイト設定
// 別ブランドに転用するときは、原則このファイルだけ書き換えればよい。
// ============================================================

export const SITE = {
  brandJa: '月夜',
  tagline: '静けさを、灯すサイトを。',
  brandEn: 'TSUKIYO — MOONLIT WATER GARDEN',
  scrollCue: '水庭へ',

  presenceLine: '水面に月が揺れるように、あなたのブランドを夜に灯します。',
  presenceSign: '―― VIBE CODING STUDIO',

  // 3枚の見どころカード（実績・サービスに差し替える）
  features: [
    {
      title: '世界観サイト制作',
      en: 'IMMERSIVE WEB',
      copy: 'WebGPUとthree.jsで、ブランドの世界観をそのまま画面に。テンプレートではなく、物語から設計します。',
    },
    {
      title: '音と光の演出',
      en: 'AUDIO REACTIVE',
      copy: '音楽を解析して、月の光や花びらが呼吸するように反応。訪れた人の記憶に残る数十秒をつくります。',
    },
    {
      title: '軽さと速さ',
      en: 'PERFORMANCE FIRST',
      copy: '画像も動画も使わず、すべてコードで描画。この夜景も読み込みは一瞬です。スマホでも滑らかに動きます。',
    },
  ],

  ctaTitle: 'こんなサイト、作れます。',
  ctaCopy: '世界観のあるホームページ・LP・ブランドサイトのご相談はお気軽に。',
  ctaLinks: [
    { label: '制作のご相談', href: 'mailto:yuki1990bado@gmail.com' },
    { label: 'その他の制作例', href: '../../index.html' },
  ],

  finLine: 'また、月の夜に。',
  finCredit: '© TSUKIYO — built with three.js / WebGPU',
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
