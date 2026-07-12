# バイブコーディング — VIBE CODING STUDIO 公式サイト

月夜テンプレート（`sites/tsukiyo/`）を転用した、AI講師/バイブコーディング事業の顔となるサイト。
月光の水庭の世界観そのままに、「このサイト自体がAIとの対話だけで作られている」ことを営業の証明として使う。

- 公開URL: https://video-automation-labs.github.io/ai-web-agency-sites/sites/vibe-coding/
- 事業設計の正本: Google Docs「バイブコーディング」（料金・カリキュラム・発信内容）
- 商品モデル: AI社員導入コンサル（成果物ベースの4段階料金）
  1. AI導入相談 ¥10,000 — 方向性決定
  2. スターター構築 ¥100,000 — AI社員1人が稼働
  3. 業務構築 ¥300,000 — 1業務まるごとAI化
  4. AI組織構築 ¥500,000 — AI社員チーム運用

## 編集ルール

- 文言・料金・リンクの変更は `js/config.js` だけを書き換える
- 描画エンジン（main.js / fx.js / audio.js）はテンプレート共通。改良するときは
  正本の `sites/tsukiyo/` 側を直してからコピーで反映する
- 検証用フック（`?gl=1` / `?wdebug=` / `window.__frame()` / `window.__shot()`）は
  tsukiyo の README を参照

## ローカル確認

```bash
cd ai-web-agency-sites && python3 -m http.server 8899
# → http://127.0.0.1:8899/sites/vibe-coding/
```

制作: 2026-07-12（テンプレート: sites/tsukiyo）
