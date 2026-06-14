# assets_v3 素材一覧

このフォルダの素材は、`mockups/lp-mockup-zeroichi-ai-employee-v1.png` を参考に、モックから切り抜かずGPT-image2で新規生成したLP実装用素材です。

## 主要素材

- `hero-dashboard.png`
  - FV右側のAI社員ダッシュボード。
  - 日本語の重要コピーは画像内に依存せずHTMLで表示。

- `kohaku-guide.png`
  - 透過PNG。
  - ヒーロー、理想の未来、最終CTAの案内役。

- `ai-employee-pixel.png`
  - 透過PNG。
  - Claude風の小さなAI社員キャラ。
  - カード、料金、CTAのアクセントに使用。

## 悩みカード用

- `problem-idea.png`
  - 商品アイデアがまとまらない

- `problem-lp-sns.png`
  - LPや発信が一人では進まない

- `problem-ai-business.png`
  - AIを使っても仕事につながらない

- `problem-sales-flow.png`
  - 相談や販売までの導線が作れない

## 講座生の声用

- `avatar-coach-zeroichi.png`
  - コーチ想定

- `avatar-owner-zeroichi.png`
  - 一人起業家想定

- `avatar-instructor-zeroichi.png`
  - 講師想定

## 生成方式

- Built-in `image_gen` tool / GPT-image2
- 透過素材はクロマキー背景で生成後、`remove_chroma_key.py` で背景除去
