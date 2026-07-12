# 月夜 -TSUKIYO- — WebGPU世界観サイトテンプレート

three.js r182（WebGPU / TSL）で描く「月光の水庭」。
画像・動画を一切使わず、月・水面・桜吹雪・蛍・星空をすべてコードで描画する。
営業トーク用ショーケース：「こんな感じのホームページ、作れますよ」の実物。

## 見どころ（商談で見せるポイント）

| 演出 | 実装 |
|------|------|
| 月の道（水面の光の帯） | TSLシェーダー。ガウス帯×高周波干渉縞の煌めき |
| 水面のさざ波 | 周期の違うsin波を重ねた擬似ノイズ（テクスチャ不要） |
| 桜吹雪 8,000枚 | GPUパーティクル（SpriteNodeMaterial、CPU負荷ゼロ） |
| 蛍 | 同パーティクルの上昇＋加算合成 |
| 音に反応する光 | WebAudio解析→月暈・水面煌めき・花弁サイズが呼吸 |
| 生成アンビエント | 陰旋法の爪弾き＋パッド（音源ファイル不要・著作権フリー） |
| WebGPU | 対応ブラウザはWebGPU、非対応はWebGLへ自動フォールバック |

## 構成

```
tsukiyo/
├── index.html      … セクション骨格＋importmap（three@0.182.0）
├── css/style.css   … 全スタイル
└── js/
    ├── config.js   … ★ブランド転用時はここだけ書き換える（文言・配色・音）
    ├── main.js     … シーン組み立て・スクロールカメラ・音反応ループ
    ├── fx.js       … 描画部品（水面・パーティクル・月・星・発光）
    └── audio.js    … 生成アンビエント＋音解析（レベル・拍検出）
```

## 別ブランドへの転用手順

1. `sites/tsukiyo/` をコピーして `sites/<新名前>/` にする
2. `js/config.js` の SITE（文言）・PALETTE（配色）・AUDIO（音の性格）を書き換える
3. 実際の楽曲を流したい場合は `assets/audio/manifest.json` を置く
   （`{"tracks":[{"title":"曲名","file":"./assets/audio/01.m4a"}]}` — 生成音から自動で切り替わる）

## 検証用フック（開発時）

- `?gl=1` … WebGL強制（フォールバック確認）
- `?wdebug=path|sparkle` … 水面シェーダーの項を単体表示
- `window.__frame(0.5)` … スクロール進捗を直接指定して1フレーム描画
- `window.__shot()` … キャンバスをJPEG dataURLで取得

## ローカル確認

```bash
cd ai-web-agency-sites && python3 -m http.server 8899
# → http://127.0.0.1:8899/sites/tsukiyo/
```

制作: 2026-07-12（参考: vibe.co.jp/sakuya の構成研究＋独自の水面表現を追加）
