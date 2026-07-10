# ポイ活トラベルNAVI

楽天経済圏（楽天トラベル・楽天カード・楽天銀行・楽天モバイル・楽天Pay・ふるさと納税）を使って、お得に旅行に行く方法を発信するアフィリエイトサイト。

Threads（発見）→ 公式LINE（継続接点）→ 本サイト（詳しい情報＋楽天リンク）という導線で運用する。

## ページ構成

```
poikatsu-travel-navi/
├── index.html          トップページ
├── about.html           運営者情報・アフィリエイト開示
├── line.html             公式LINE友だち追加ランディング
├── articles/
│   ├── index.html        記事一覧（カテゴリ絞り込み付き）
│   └── 01〜15.html        記事本編 15本
└── assets/css/style.css  共通デザイン
```

## 開き方（ローカル確認）

```bash
open /Users/kobayashiyuuki/ai-web-agency-sites/sites/poikatsu-travel-navi/index.html
```

## 公式LINE

すでに開設済みのアカウントを使用：**https://lin.ee/vumdnv8A**
全ページの「LINEで友だち追加する」ボタン、`line.html`、`index.html` の楽天トラベルCTA帯に設定済み。

リッチメニュー・あいさつメッセージ・週次配信テンプレの文面案は、設計プロポーザル（Claude Artifact）にまとめてあります。実際のLINE公式アカウント管理画面（https://manager.line.biz/）への反映は本人作業です。

## 楽天アフィリエイトリンクの差し替え（必須・公開前に必ず実施）

全記事内のCTAリンクは、以下のプレースホルダーで統一してあります。

```
RAKUTEN_AFFILIATE_ID
```

対象ファイル数と、含まれる箇所を確認する：

```bash
cd /Users/kobayashiyuuki/ai-web-agency-sites/sites/poikatsu-travel-navi
grep -rl "RAKUTEN_AFFILIATE_ID" .
```

自分の楽天アフィリエイトIDが分かれば、以下で一括置換できる（`<あなたのID>` を実際の値に置き換える）：

```bash
cd /Users/kobayashiyuuki/ai-web-agency-sites/sites/poikatsu-travel-navi
grep -rl "RAKUTEN_AFFILIATE_ID" . | xargs sed -i '' 's/RAKUTEN_AFFILIATE_ID/<あなたのID>/g'
```

> 注意：楽天アフィリエイトの正式なリンクは、案件（楽天トラベル／カード／銀行／モバイル／Pay／ふるさと納税）ごとに「リンクジェネレーター」で発行するのが最も確実です。特に成果が大きい記事（`01-spu-guide.html`, `06〜08-エリア別`, `15-beginner-guide.html`）だけでも、公式のリンクジェネレーターで生成した正式リンクに個別に差し替えることを推奨します。

## デプロイ手順（Cloudflare Pages）

### 初回

```bash
cd ~/ai-web-agency-sites
git add sites/poikatsu-travel-navi
git commit -m "feat: ポイ活トラベルNAVIを追加"
git push origin main

npx wrangler pages project create poikatsu-travel-navi --production-branch main
npx wrangler pages deploy sites/poikatsu-travel-navi --project-name poikatsu-travel-navi
```

公開後は `https://poikatsu-travel-navi.pages.dev` でアクセスできる。

### 更新時

> ⚠️ git push だけでは本番に反映されない。必ず wrangler デプロイも実行する。

```bash
cd ~/ai-web-agency-sites
git add sites/poikatsu-travel-navi
git commit -m "feat: ポイ活トラベルNAVIを更新"
git push origin main
npx wrangler pages deploy sites/poikatsu-travel-navi --project-name poikatsu-travel-navi
```

公開後は `03_TOOLS/site-portal/index.html` にも登録する。

## 残タスク（公開前チェックリスト）

- [ ] 楽天アフィリエイトリンクを正式なものに差し替え（上記参照）
- [ ] LINE公式アカウントのリッチメニュー・あいさつメッセージを設定（本人作業）
- [ ] Threads新規アカウントを開設し、プロフィールにLINEリンクを設置（本人作業）
- [ ] Cloudflare Pagesへデプロイ
- [ ] site-portalに登録
