# AI Web Agency デモサイト

AIで自動生成されたホームページの実例集です。

## 公開 URL（Cloudflare Pages）

| サイト | URL |
|-------|-----|
| 琥珀ホームページ | https://kohaku-official.pages.dev |
| 琥珀LP | https://kohaku-lp.pages.dev |
| OpenClaw LP | https://openclaw-lp.pages.dev |
| AI戦略パートナーHP | https://ai-strategy-partner.pages.dev |
| AI戦略パートナーLP | https://ai-strategy-partner-lp.pages.dev |
| AI4コマ漫画LP | https://ai-4koma-manga-lp.pages.dev |

## フォルダ構成

```
ai-web-agency-sites/
├── sites/
│   ├── kohaku-official/         # 琥珀ホームページ
│   ├── kohaku-lp/               # 琥珀LP
│   ├── openclaw-lp/             # OpenClaw LP
│   ├── ai-strategy-partner/     # AI戦略パートナーHP
│   ├── ai-strategy-partner-lp/  # AI戦略パートナーLP
│   ├── ai-4koma-manga-lp/       # AI4コマ漫画LP
│   ├── motto-custom-motors/     # バイク屋HP（非公開）
│   └── kobayashi-kigyojuku-lp/  # 小林起業塾LP（非公開）
├── _archive/2026-06/            # 廃止・重複サイト
└── README.md
```

## ローカル確認

```bash
cd ~/ai-web-agency-sites
python3 -m http.server 8181
# http://localhost:8181/sites/<サイト名>/ で確認
```

## 新しいサイトを追加して公開する手順

### 1. サイトをコピー

VIBE_OS_MASTER で作成したサイトをこのリポジトリに追加する：

```bash
cp -r ~/VIBE_OS_MASTER/06_OUTPUT/<カテゴリ>/<サイト名> ~/ai-web-agency-sites/sites/<サイト名>
```

### 2. GitHubにプッシュ

```bash
cd ~/ai-web-agency-sites
git add sites/<サイト名>
git commit -m "feat: <サイト名>を追加"
git push origin main
```

### 3. Cloudflare Pages にデプロイ（初回のみ）

wranglerでプロジェクトを作成してデプロイ：

```bash
cd ~/ai-web-agency-sites

# プロジェクト作成
npx wrangler pages project create <サイト名> --production-branch main

# デプロイ（少し待ってから実行）
npx wrangler pages deploy sites/<サイト名> --project-name <サイト名>
```

完了すると `https://<サイト名>.pages.dev` で公開される。

### 4. 既存サイトを更新する場合

```bash
cd ~/ai-web-agency-sites

# 最新ファイルをコピー
cp -r ~/VIBE_OS_MASTER/06_OUTPUT/<カテゴリ>/<サイト名>/. sites/<サイト名>/

# プッシュ（GitHubに連携済みのプロジェクトは自動で再デプロイされる）
git add sites/<サイト名>
git commit -m "feat: <サイト名>を更新"
git push origin main

# CLIデプロイのプロジェクトは手動で再デプロイ
npx wrangler pages deploy sites/<サイト名> --project-name <サイト名>
```

### 注意点

- Root directoryのパスはスペースなしで入力する（スペースがあるとデプロイ失敗する）
- Build command・Build output directoryは空欄でOK（静的HTMLサイトの場合）
- 公開不要なサイトは `sites/` に置いたままでも、Cloudflareプロジェクトを作らなければ非公開

## 不要になったサイトを取り下げる

```bash
npx wrangler pages project delete <サイト名> --yes
```

## 技術

- HTML5 / CSS3 / JavaScript（Vanilla）
- Cloudflare Pages（ホスティング）
- GitHub（ソース管理）

© 2026 AI Web Agency
