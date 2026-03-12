# AI導入診断 — 機能仕様書

**プロジェクト**: AI Strategy Partner ホームページ
**目的**: 訪問者が簡単な質問に答えて、自社に向いたAI導入案を知る
**期待効果**: 問い合わせ前に興味を高める、無料相談への導線強化

---

## 1. 機能概要

### 目的（再確認）
- **認知**: AIを導入したい企業が、どんなAIが適しているか分かる
- **興味**: 無料診断を通じて、AI Strategy Partner のサービスをイメージできる
- **行動**: 診断結果から「無料AI相談」「LINE相談」への流れを自然に構築

### 実装場所
トップページ（index.html）に**診断セクション**として追加
- ヒーロセクション → 課題セクション → **【新】AI導入診断** → サービスセクション

### 技術仕様
- **HTML/CSS/JavaScript**: 純フロントエンド（API依存なし）
- **ルールベース**: 質問→回答パターンマッピング
- **動的UI**: 段階的な質問表示、結果のアニメーション
- **デザイン**: AI Strategy Partner の既存CSSに統合

---

## 2. UI/UXフロー

```
┌─────────────────────────────────────────────────┐
│ 【診断スタート】ボタン                          │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Q1: あなたの業種は？                            │
│  □ 営業・マーケティング                        │
│  □ 事務・バックオフィス                        │
│  □ カスタマーサポート                          │
│  □ 企画・データ分析                            │
│  □ その他                                      │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Q2: 従業員数は？                                │
│  ○ 1-10人                                      │
│  ○ 11-50人                                     │
│  ○ 51-100人                                    │
│  ○ 101人以上                                   │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Q3: 特に困っている業務は？（複数選択可）       │
│  ☑ 顧客対応・メール対応                        │
│  ☑ 営業事務・データ入力                        │
│  ☑ レポート・資料作成                          │
│  ☑ スケジュール管理・会議準備                  │
│  ☑ SNS投稿・コンテンツ生成                      │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Q4: 今のAI利用度は？                            │
│  ○ 全く使っていない                            │
│  ○ ChatGPT等を少し使っている                   │
│  ○ AIツールを複数導入している                  │
│  ○ AIを戦略的に活用している                    │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Q5: AI導入の優先度は？                          │
│  ○ 興味段階（まず情報が欲しい）                │
│  ○ 検討段階（予算や効果を測りたい）            │
│  ○ 導入段階（具体的に進めたい）                │
│  ○ 急いでいる（すぐにでも相談したい）          │
└────────────────┬────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────────┐
│  🎯 【診断結果】                                     │
│                                                      │
│  あなたに最適なAI導入は...                          │
│                                                      │
│  【パターンA】AIエージェント構築                    │
│  ✓ あなたのような営業・事務業務が対象              │
│  ✓ 実装期間：3-4週間                               │
│  ✓ 期待効果：業務時間 40-60% 削減                  │
│                                                      │
│  【提案】                                            │
│  1. 初期ヒアリング（1-2日）                        │
│  2. AI戦略設計（3-5日）                            │
│  3. エージェント実装（2-3週間）                    │
│  4. テスト・運用開始                                │
│                                                      │
│  ┌────────────────────────────────────┐             │
│  │ 【CTA1】無料AI相談を予約            │             │
│  └────────────────────────────────────┘             │
│  ┌────────────────────────────────────┐             │
│  │ 【CTA2】LINEで詳しく相談            │             │
│  └────────────────────────────────────┘             │
│                                                      │
│  [ 診断をやり直す ]                                │
└──────────────────────────────────────────────────────┘
```

---

## 3. 質問設計（5問）

### Q1: 業種
**目的**: 適切なAI活用領域を判定
**タイプ**: ラジオボタン（単一選択）
**選択肢**:
- 営業・マーケティング
- 事務・バックオフィス
- カスタマーサポート
- 企画・データ分析
- 製造・物流
- その他

### Q2: 従業員数
**目的**: 導入規模・優先順位を判定
**タイプ**: ラジオボタン
**選択肢**:
- 1-10人（スタートアップ・小規模）
- 11-50人（成長段階）
- 51-100人（中堅企業）
- 101人以上（大企業）

### Q3: 困っている業務（複数選択）
**目的**: 重要度の高い業務を特定 → 導入優先順位を決める
**タイプ**: チェックボックス（最大3つまで推奨）
**選択肢**:
- 顧客対応・メール対応
- 営業事務・見積作成
- レポート・資料作成
- スケジュール管理・会議準備
- SNS投稿・コンテンツ生成
- 社員教育・マニュアル作成
- 在庫・売上管理
- その他

### Q4: 現在のAI利用度
**目的**: 実装の難易度・教育コストを判定
**タイプ**: ラジオボタン
**選択肢**:
- 全く使っていない
- ChatGPT等を少し使っている
- AIツールを複数導入している
- AIを戦略的に活用している

### Q5: AI導入の優先度・緊急度
**目的**: 営業フェーズを判定 → CTA の強度を変える
**タイプ**: ラジオボタン
**選択肢**:
- 興味段階（まず情報が欲しい）
- 検討段階（予算や効果を検討中）
- 導入段階（具体的に進めたい）
- 急いでいる（3ヶ月以内に開始したい）

---

## 4. 回答ロジック＆結果パターン

### ロジックアルゴリズム

```javascript
// スコアリング方式
const score = {
  industry_score: 0,      // 業種による標準度（0-30）
  urgency_score: 0,       // 緊急度（0-20）
  complexity_score: 0,    // 複雑度（0-20）
  readiness_score: 0      // AI導入準備度（0-30）
}

totalScore = sum(score) // 0-100
```

### 診断結果パターン（3種類）

#### **パターンA: カスタムAIエージェント構築【最適】**
**該当者**:
- 業種: 営業・事務・カスタマーサポート
- 困っている業務: 3つ以上複数ある
- AI利用度: 未使用～少し使用
- 緊急度: 中～高

**診断結果メッセージ:**
```
【あなたに最適: AIエージェント構築】

あなたの業務は「AIエージェント」で大幅な効率化が可能です。

✓ 業務: [選択内容] はAI化に最適
✓ 実装期間: 3-4週間
✓ 期待効果: 業務時間 40-60% 削減
✓ 年間効果: 約500-1000時間削減

【提案する導入フロー】
1️⃣ ヒアリング・業務分析（1日）
2️⃣ AI戦略設計＋ロードマップ提案（1週間）
3️⃣ AIエージェント実装＆テスト（2-3週間）
4️⃣ 社員研修・運用開始

【次のステップ】
無料相談で、あなたの業務課題に最適なAI導入案をご提案します。
```

**CTA強度**: 🔴 高（「無料相談」ボタンを目立たせる）

---

#### **パターンB: AI活用の基礎設計【検討推奨】**
**該当者**:
- 業種: その他・不確実
- 困っている業務: 1-2個
- AI利用度: 既に利用している
- 緊急度: 低～中

**診断結果メッセージ:**
```
【あなたに最適: AI導入戦略設計】

あなたはAIを既に活用されていますが、
さらに体系的な AI導入戦略で効果を最大化できます。

✓ 現在のAI活用: [利用状況]
✓ 次のステップ: 複数AIツールの統合・自動化
✓ 期待効果: 現在効果 + 30-50% の効率化

【提案する内容】
1️⃣ 現在のAI活用評価（無料診断）
2️⃣ 導入すべき次のAIツール・エージェントの提案
3️⃣ 統合ロードマップの作成
4️⃣ 段階的な実装プラン

【特にお勧め】
AI導入について「何をすべきか」を明確にしたい企業様向けの
「AI戦略設計」サービスです。
```

**CTA強度**: 🟡 中（「相談」で情報提供メインに）

---

#### **パターンC: AIリテラシー教育から開始【基礎段階】**
**該当者**:
- 業種: その他
- 困っている業務: 未選択または1つ
- AI利用度: 全く使っていない
- 緊急度: 低

**診断結果メッセージ:**
```
【あなたに最適: AI教育・リテラシー向上】

AIの導入前に、まず社内のAI活用スキルを高めることが重要です。

✓ 次のステップ: AI基礎知識＋実務活用法の習得
✓ 実装後の効果: 社内で主体的にAI活用が進む
✓ 投資効果: ROI 3-5倍

【提案する内容】
1️⃣ 社員向けAI基礎研修（1-2日）
2️⃣ 実務別AI活用法（営業・事務・企画など）
3️⃣ 継続サポート・質問対応
4️⃣ その後のAIエージェント導入もスムーズに

【次のステップ】
「AI導入を検討しているが、まず社員教育から」というご企業向け
特別プログラムがあります。お気軽にご相談ください。
```

**CTA強度**: 🟠 低～中（「情報提供」「セミナー参加」の導線も追加）

---

## 5. 診断結果のパターン判定ロジック

```javascript
function determineDiagnosisPattern(answers) {
  let score = {
    aiAgent: 0,
    strategy: 0,
    education: 0
  };

  // 業種スコア
  if (['営業・マーケティング', '事務・バックオフィス', 'カスタマーサポート'].includes(answers.industry)) {
    score.aiAgent += 15;
  } else if (answers.industry === 'その他') {
    score.education += 10;
    score.strategy += 5;
  }

  // 困っている業務数
  const troubleCount = answers.troubles.length;
  if (troubleCount >= 3) {
    score.aiAgent += 20;
  } else if (troubleCount === 2) {
    score.strategy += 15;
    score.aiAgent += 10;
  } else if (troubleCount === 1) {
    score.strategy += 15;
    score.education += 10;
  } else {
    score.education += 20;
  }

  // AI利用度
  if (answers.aiUsage === '全く使っていない') {
    score.aiAgent += 10;
    score.education += 5;
  } else if (answers.aiUsage === 'ChatGPT等を少し使っている') {
    score.aiAgent += 15;
  } else if (answers.aiUsage === 'AIツールを複数導入している') {
    score.strategy += 15;
    score.aiAgent += 5;
  } else {
    score.strategy += 20;
  }

  // 緊急度
  const urgencyMap = {
    '興味段階': 0,
    '検討段階': 10,
    '導入段階': 20,
    '急いでいる': 30
  };
  score.aiAgent += urgencyMap[answers.urgency];
  score.strategy += urgencyMap[answers.urgency] * 0.5;

  // 最もスコアが高いパターンを返す
  const maxScore = Math.max(score.aiAgent, score.strategy, score.education);
  if (score.aiAgent === maxScore) return 'PATTERN_A';
  if (score.strategy === maxScore) return 'PATTERN_B';
  return 'PATTERN_C';
}
```

---

## 6. UI構成（HTML/CSS設計）

### セクション配置

```html
<!-- 既存: ヒーロー → 課題 -->

<!-- 新規: AI診断セクション -->
<section class="ai-diagnosis">
  <div class="container">
    <h2>AI導入診断</h2>
    <p class="diagnosis-description">
      3分で完結！あなたの会社に最適なAI導入方法が分かります。
    </p>

    <!-- 診断フォーム（非表示 → JS で段階表示） -->
    <div class="diagnosis-form" id="diagnosisForm">
      <!-- Q1-Q5 がここに動的に挿入される -->
    </div>

    <!-- 結果表示エリア（非表示 → JS で表示） -->
    <div class="diagnosis-result" id="diagnosisResult" style="display: none;">
      <!-- 結果コンテンツはここに挿入される -->
    </div>
  </div>
</section>

<!-- 既存: サービス → About → Flow -->
```

### スタイル設計

**カラースキーム**:
- 背景: 薄いグレー（`var(--light-gray)`）
- アクセント: プライマリブルー（`var(--primary)`）
- ボタン: オレンジアクセント（`var(--accent)`）

**コンポーネント**:
```css
/* 診断フォーム */
.diagnosis-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.question-group {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--border-gray);
}

.question-group h3 {
  color: var(--primary);
  margin-bottom: 16px;
  font-size: 18px;
}

.option-label {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  border: 2px solid var(--border-gray);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.option-label:hover {
  border-color: var(--primary);
  background: rgba(0, 102, 204, 0.05);
}

.option-label input:checked ~ span {
  color: var(--primary);
  font-weight: 600;
}

/* 診断結果 */
.diagnosis-result {
  max-width: 700px;
  margin: 40px auto;
  padding: 40px;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, white 100%);
  border-left: 5px solid var(--primary);
  border-radius: 8px;
  animation: slideIn 0.5s ease-out;
}

.result-title {
  color: var(--primary);
  font-size: 24px;
  margin-bottom: 20px;
}

.result-pattern {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 6px;
  border-left: 4px solid var(--accent);
}

.result-cta {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  flex: 1;
  min-width: 250px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--primary);
  color: white;
}

.btn-secondary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* アニメーション */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-group[style*="animation"] {
  animation: slideIn 0.4s ease-out;
}
```

---

## 7. 実装用HTML/CSS/JavaScript

### ファイル構成
```
site-ai-strategy-partner/
├── index.html                    (既存、診断セクション追加)
├── assets/
│   ├── css/
│   │   └── style.css            (既存、診断スタイル追加)
│   └── js/
│       └── diagnosis.js         (【新規】診断ロジック)
└── data/
    └── diagnosis-config.json    (【新規】質問・結果定義)
```

### diagnosis-config.json（質問・結果定義）

```json
{
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "text": "あなたの業種は？",
      "type": "radio",
      "options": [
        { "value": "sales", "label": "営業・マーケティング" },
        { "value": "admin", "label": "事務・バックオフィス" },
        { "value": "support", "label": "カスタマーサポート" },
        { "value": "planning", "label": "企画・データ分析" },
        { "value": "manufacturing", "label": "製造・物流" },
        { "value": "other", "label": "その他" }
      ]
    },
    {
      "id": "q2",
      "number": 2,
      "text": "従業員数は？",
      "type": "radio",
      "options": [
        { "value": "small", "label": "1-10人" },
        { "value": "growing", "label": "11-50人" },
        { "value": "medium", "label": "51-100人" },
        { "value": "large", "label": "101人以上" }
      ]
    },
    {
      "id": "q3",
      "number": 3,
      "text": "特に困っている業務は？（複数選択可）",
      "type": "checkbox",
      "options": [
        { "value": "customer_response", "label": "顧客対応・メール対応" },
        { "value": "admin_work", "label": "営業事務・見積作成" },
        { "value": "report_creation", "label": "レポート・資料作成" },
        { "value": "schedule_management", "label": "スケジュール管理・会議準備" },
        { "value": "content_creation", "label": "SNS投稿・コンテンツ生成" },
        { "value": "training", "label": "社員教育・マニュアル作成" },
        { "value": "inventory", "label": "在庫・売上管理" },
        { "value": "other", "label": "その他" }
      ]
    },
    {
      "id": "q4",
      "number": 4,
      "text": "現在のAI利用度は？",
      "type": "radio",
      "options": [
        { "value": "none", "label": "全く使っていない" },
        { "value": "basic", "label": "ChatGPT等を少し使っている" },
        { "value": "multiple", "label": "AIツールを複数導入している" },
        { "value": "strategic", "label": "AIを戦略的に活用している" }
      ]
    },
    {
      "id": "q5",
      "number": 5,
      "text": "AI導入の優先度は？",
      "type": "radio",
      "options": [
        { "value": "interest", "label": "興味段階（まず情報が欲しい）" },
        { "value": "consideration", "label": "検討段階（予算や効果を検討中）" },
        { "value": "implementation", "label": "導入段階（具体的に進めたい）" },
        { "value": "urgent", "label": "急いでいる（3ヶ月以内に開始したい）" }
      ]
    }
  ],

  "patterns": {
    "PATTERN_A": {
      "title": "AIエージェント構築【最適】",
      "icon": "🤖",
      "description": "あなたの業務は「AIエージェント」で大幅な効率化が可能です。",
      "benefits": [
        "業務: [選択内容] はAI化に最適",
        "実装期間: 3-4週間",
        "期待効果: 業務時間 40-60% 削減",
        "年間効果: 約500-1000時間削減"
      ],
      "flow": [
        "ヒアリング・業務分析（1日）",
        "AI戦略設計＋ロードマップ提案（1週間）",
        "AIエージェント実装＆テスト（2-3週間）",
        "社員研修・運用開始"
      ],
      "ctaStrength": "high",
      "primaryCTA": "無料AI相談を予約",
      "secondaryCTA": "LINEで詳しく相談"
    },
    "PATTERN_B": {
      "title": "AI導入戦略設計【検討推奨】",
      "icon": "🎯",
      "description": "あなたはAIを既に活用されていますが、さらに体系的なAI導入戦略で効果を最大化できます。",
      "benefits": [
        "現在のAI活用をさらに拡張",
        "次のステップ: 複数AIツールの統合・自動化",
        "期待効果: 現在効果 + 30-50% の効率化"
      ],
      "flow": [
        "現在のAI活用評価（無料診断）",
        "導入すべき次のAIツール・エージェントの提案",
        "統合ロードマップの作成",
        "段階的な実装プラン"
      ],
      "ctaStrength": "medium",
      "primaryCTA": "AI戦略設計の詳細を知る",
      "secondaryCTA": "無料相談に申し込む"
    },
    "PATTERN_C": {
      "title": "AIリテラシー教育から開始【基礎段階】",
      "icon": "📚",
      "description": "AIの導入前に、まず社内のAI活用スキルを高めることが重要です。",
      "benefits": [
        "次のステップ: AI基礎知識＋実務活用法の習得",
        "実装後の効果: 社内で主体的にAI活用が進む",
        "投資効果: ROI 3-5倍"
      ],
      "flow": [
        "社員向けAI基礎研修（1-2日）",
        "実務別AI活用法（営業・事務・企画など）",
        "継続サポート・質問対応",
        "その後のAIエージェント導入もスムーズに"
      ],
      "ctaStrength": "low",
      "primaryCTA": "AI教育プログラムの資料請求",
      "secondaryCTA": "セミナーに参加する"
    }
  }
}
```

---

## 8. 機能シナリオ（実装フロー）

### ユーザー操作フロー

```javascript
// 1. 「診断スタート」ボタンをクリック
→ フォームが表示される

// 2. Q1～Q5 を段階的に表示
→ 各質問に答える（回答は localStorage に保存）

// 3. すべて回答後、「診断結果を見る」ボタン表示
→ ユーザーがクリック

// 4. 回答を元にスコア計算
→ PATTERN_A / B / C を判定

// 5. 診断結果をアニメーション表示
→ メッセージ＋CTA ボタン

// 6. CTA をクリック
→ 「無料相談フォーム」「LINE連携」「メール」のいずれかへ導線
```

### JavaScript 実装のポイント

```javascript
class AIAdoptionDiagnosis {
  constructor(configUrl = '/data/diagnosis-config.json') {
    this.config = null;
    this.answers = {};
    this.currentQuestion = 0;
    this.loadConfig(configUrl);
  }

  // Config ロード
  async loadConfig(url) {
    const response = await fetch(url);
    this.config = await response.json();
    this.init();
  }

  // 初期化
  init() {
    this.attachEventListeners();
    this.loadAnswersFromStorage();
  }

  // 次の質問表示（段階的）
  displayNextQuestion() {
    if (this.currentQuestion < this.config.questions.length) {
      const q = this.config.questions[this.currentQuestion];
      this.renderQuestion(q);
      this.currentQuestion++;
    } else {
      this.displayResult();
    }
  }

  // 質問をレンダリング
  renderQuestion(question) {
    // HTML を動的生成 + アニメーション
    // radio / checkbox に応じて UI を分け合わせ
  }

  // 結果を計算・表示
  displayResult() {
    const pattern = this.determineDiagnosisPattern(this.answers);
    const resultConfig = this.config.patterns[pattern];
    this.renderResultUI(resultConfig);
  }

  // パターン判定ロジック
  determineDiagnosisPattern(answers) {
    // 前述のスコアリングロジックを実装
  }

  // localStorage に保存（復帰対応）
  saveAnswers() {
    localStorage.setItem('diagnosis_answers', JSON.stringify(this.answers));
  }

  // localStorage から復帰
  loadAnswersFromStorage() {
    const saved = localStorage.getItem('diagnosis_answers');
    if (saved) this.answers = JSON.parse(saved);
  }
}

// 初期化
const diagnosis = new AIAdoptionDiagnosis();
```

---

## 9. CTA（行動喚起）統合

### 「無料AI相談」への導線

**診断結果から**:
- パターンA（高）: 「無料AI相談を予約」（目立つボタン）
- パターンB（中）: 「AI戦略設計の詳細」→ メール相談フォーム
- パターンC（低）: 「資料請求」→ ダウンロード ＆ メール登録

### LINE Business Account 統合（オプション）

```html
<!-- LINE QR コード or 友達追加ボタン -->
<div class="line-cta">
  <p>LINEでも詳しく相談できます</p>
  <a href="https://line.me/R/ti/p/..." class="line-button">
    LINEで相談する
  </a>
</div>
```

### メール連携

```javascript
// 診断結果後、メールアドレス入力 → 結果をメール送信
form.onsubmit = async (e) => {
  e.preventDefault();
  const email = form.email.value;

  // バックエンド or Formspree に送信
  await fetch('/api/diagnosis-email', {
    method: 'POST',
    body: JSON.stringify({
      email,
      pattern: this.pattern,
      timestamp: new Date()
    })
  });
};
```

---

## 10. 実装チェックリスト

- [ ] HTML 追加（診断セクション）
- [ ] CSS 追加（フォーム・結果スタイル）
- [ ] diagnosis-config.json 作成
- [ ] diagnosis.js 実装
- [ ] 質問の段階的表示（アニメーション付き）
- [ ] 回答値の保存・復帰（localStorage）
- [ ] スコアリングロジック実装
- [ ] 3パターン結果の表示実装
- [ ] CTA ボタン統合（無料相談・LINE・メール）
- [ ] レスポンシブ対応（モバイル）
- [ ] ブラウザ互換性テスト
- [ ] UA/GA 連携（診断完了をイベント記録）

---

## 11. 期待効果

| 指標 | 目標 |
|-----|------|
| 診断開始率 | サイト訪問者の 10-15% |
| 診断完了率 | 開始者の 70-80%（5問で完結） |
| 無料相談申し込み率 | 完了者の 20-30%（パターンA） |
| メールアドレス取得率 | 完了者の 50%+ |
| LINE友達追加率 | 完了者の 15-25% |

---

**作成日**: 2026-03-12
**責務**: Web Agency 機能設計
**ステータス**: 仕様完成・実装準備完了
