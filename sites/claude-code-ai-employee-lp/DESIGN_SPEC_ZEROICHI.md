# AI社員構築プログラム LP デザイン仕様書

## 目的

Claude CodeとAI社員を活用して、個人が自分の知識・経験を商品、LP、SNS発信、相談導線まで形にするための講座LP。法人向けの業務改善ではなく、コーチ、講師、カウンセラー、コンサルタント、セラピスト、副業準備中の人など、ゼロイチでビジネスを作りたい個人を主対象にする。

## LPコンセプト

Claude CodeとAI社員で、あなたの知識・経験を“売れるビジネス”に変える。

AIを学ぶだけで終わらせず、AI社員と一緒に商品設計、LP制作、SNS発信、相談導線まで作る実践型プログラムとして見せる。

## トーン

- 信頼感がある
- 初心者にもやさしい
- 高級感より親しみやすさ
- 女性サービス業にも合う
- ポップすぎず、ビジネス寄り
- スマホで読みやすい

## カラー

- Background: `#fffaf5`
- Soft Background: `#f3f8ff`
- Surface: `#ffffff`
- Text Main: `#14213d`
- Text Muted: `#657086`
- Claude Orange: `#f0643d`
- Claude Orange Dark: `#d94e2c`
- Blue Accent: `#2f7dd3`
- Green Accent: `#21a867`
- Border: `#eadfd6`
- Shadow: `0 18px 48px rgba(20, 33, 61, 0.10)`

## Font

- Primary: `Noto Sans JP`
- Latin / numbers: `Inter`
- Weight: 400, 500, 700, 800, 900

## Layout

- Max width: `1120px`
- Desktop section padding: `72px 0`
- Mobile section padding: `48px 0`
- Card radius: `8px`
- Button radius: `8px`
- Hero layout: desktop 2カラム、mobile 1カラム
- Pricing: desktop 3カラム、mobile 1カラム

## セクション構成

1. Header
   - ブランド、ナビ、CTA
2. Hero
   - 価値提案、CTA、信頼バッジ、AI社員ダッシュボード、コハクちゃん
3. 悩みへの共感
   - 商品、LP、AI活用、相談導線の4悩み
4. 理想の未来
   - 経験棚卸しからAI社員チーム化までの流れ
5. 得られること
   - 商品設計、LP制作、SNS運用、AI秘書、LINE/相談導線、一人で進める力
6. カリキュラム
   - 7日間のステップ
7. 特典
   - テンプレート、プロンプト、チェックリスト、個別相談
8. 講座生の声
   - 3名の声
9. 料金・プラン
   - 7日、30日、60日の3プラン。30日を推奨
10. FAQ
   - 初心者、商品未定、Claude Code未経験、忙しさの不安を解消
11. Final CTA
   - 無料相談へ自然に誘導

## CTA

Primary:
無料相談でAI社員の作り方を聞く

Sub:
無理な勧誘はありません。まずは今の状況整理だけでも大丈夫です。

## 画像方針

モック画像から切り抜かず、GPT-image2で新規生成した素材を使用する。重要な日本語テキストは画像内に埋め込まず、HTML/CSSで表示する。

使用素材:

- `assets_v3/hero-dashboard.png`
- `assets_v3/kohaku-guide.png`
- `assets_v3/ai-employee-pixel.png`
- `assets_v3/problem-idea.png`
- `assets_v3/problem-lp-sns.png`
- `assets_v3/problem-ai-business.png`
- `assets_v3/problem-sales-flow.png`
- `assets_v3/avatar-coach-zeroichi.png`
- `assets_v3/avatar-owner-zeroichi.png`
- `assets_v3/avatar-instructor-zeroichi.png`

## PC表示

- FVは左にコピー、右にダッシュボード画像とコハクちゃん。
- 悩みカードは4列。
- 未来の流れは横並び。
- ベネフィットは6列に近いカードグリッド。
- カリキュラムは横スクロールではなく7ステップを均等配置。
- 料金は3列で、30日プランを中央に配置し強調。

## スマホ表示

- CTAをファーストビュー上部に早めに表示。
- 全カードを1列化。
- ダッシュボード、コハクちゃん、AI社員キャラは切れないように `object-fit: contain`。
- カリキュラムは縦タイムライン化。
- 料金はおすすめプランを先に目立たせる。
