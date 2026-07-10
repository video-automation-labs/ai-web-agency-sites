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

## 楽天アフィリエイトリンク（2026-07-10 差し替え済み）

`affiliate.rakuten.co.jp` の「URLからリンクを作成」で以下4件は正式リンクを発行済み・全記事に反映済み：

- 楽天トラベル（`travel.rakuten.co.jp`）
- 楽天カード（`www.rakuten-card.co.jp`）
- 楽天ふるさと納税（`event.rakuten.co.jp/furusato/`）
- 楽天スーパーDEAL（`event.rakuten.co.jp/superdeal/`）

以下3件は「URLからリンクを作成」ではエラーになった（金融・通信系は個別の提携申請が必要な可能性が高い）。該当記事（`05-bank-card-combo.html`, `11-mobile-travel.html`, `13-rakuten-pay.html`）は `RAKUTEN_AFFILIATE_ID` プレースホルダーのまま残っている：

- 楽天銀行（`www.rakuten-bank.co.jp`）
- 楽天モバイル（`network.mobile.rakuten.co.jp`）
- 楽天Pay（`pay.rakuten.co.jp`）

対応方法：楽天アフィリエイトの「商品・サービスを探す」から該当サービスを検索し、提携申請（審査）が必要か確認する。提携後にリンクジェネレーターで発行し、該当ファイル内の該当箇所を差し替える。残りプレースホルダーの場所を確認する：

```bash
cd /Users/kobayashiyuuki/ai-web-agency-sites/sites/poikatsu-travel-navi
grep -rn "RAKUTEN_AFFILIATE_ID" articles/
```

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

## 残タスク

- [x] 楽天アフィリエイトリンク差し替え（トラベル／カード／ふるさと納税／スーパーDEAL）
- [x] Cloudflare Pagesへデプロイ（https://poikatsu-travel-navi.pages.dev）
- [ ] 楽天銀行／楽天モバイル／楽天Payの提携申請 → リンク差し替え（上記参照）
- [ ] LINE公式アカウントのリッチメニュー・あいさつメッセージを設定（本人作業）
- [ ] Threads新規アカウントを開設し、プロフィールにLINEリンクを設置（本人作業）
- [ ] site-portalに登録
- [ ] トップページ用の解説動画（ナレーション＋テロップ）を作成・埋め込み
