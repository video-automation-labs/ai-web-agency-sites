/**
 * AI導入診断 - JavaScript Implementation
 *
 * 責務:
 * - 質問の段階的表示
 * - 回答の保存・管理
 * - スコアリングと結果判定
 * - 結果のレンダリング
 */

class AIAdoptionDiagnosis {
  constructor(configUrl = '/data/diagnosis-config.json') {
    this.config = null;
    this.answers = {};
    this.currentQuestion = 0;
    this.formContainer = document.getElementById('diagnosisForm');
    this.resultContainer = document.getElementById('diagnosisResult');
    this.loadConfig(configUrl);
  }

  /**
   * Config を JSON から読み込む
   */
  async loadConfig(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load config: ${response.status}`);
      this.config = await response.json();
      this.init();
    } catch (error) {
      console.error('Config load error:', error);
      this.showError('診断データの読み込みに失敗しました');
    }
  }

  /**
   * 初期化
   */
  init() {
    this.attachEventListeners();
    this.loadAnswersFromStorage();
    this.setupStartButton();
  }

  /**
   * 「診断スタート」ボタンのセットアップ
   */
  setupStartButton() {
    const startBtn = document.getElementById('diagnosisStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startDiagnosis());
    }
  }

  /**
   * 診断開始
   */
  startDiagnosis() {
    // 回答をリセット
    this.answers = {};
    this.currentQuestion = 0;
    localStorage.removeItem('diagnosis_answers');

    // スタートボタンを非表示
    const startBtn = document.getElementById('diagnosisStartBtn');
    if (startBtn) startBtn.style.display = 'none';

    // フォームコンテナをクリア＆表示
    this.formContainer.innerHTML = '';
    this.formContainer.style.display = 'block';
    this.resultContainer.style.display = 'none';

    // 最初の質問を表示
    this.displayNextQuestion();
  }

  /**
   * 次の質問を表示（段階的）
   */
  displayNextQuestion() {
    if (this.currentQuestion < this.config.questions.length) {
      const question = this.config.questions[this.currentQuestion];
      this.renderQuestion(question);
      this.currentQuestion++;
    } else {
      this.displayResult();
    }
  }

  /**
   * 質問をレンダリング
   */
  renderQuestion(question) {
    const questionHtml = document.createElement('div');
    questionHtml.className = 'question-group';
    questionHtml.style.animation = 'slideIn 0.4s ease-out';

    let optionsHtml = '';

    if (question.type === 'radio') {
      optionsHtml = question.options
        .map(opt => `
          <label class="option-label">
            <input type="radio" name="${question.id}" value="${opt.value}" />
            <span>${opt.label}</span>
          </label>
        `)
        .join('');
    } else if (question.type === 'checkbox') {
      optionsHtml = question.options
        .map(opt => `
          <label class="option-label">
            <input type="checkbox" name="${question.id}" value="${opt.value}" />
            <span>${opt.label}</span>
          </label>
        `)
        .join('');
    }

    questionHtml.innerHTML = `
      <h3>Q${question.number}: ${question.text}</h3>
      <div class="options-group">
        ${optionsHtml}
      </div>
      <div class="question-nav">
        <button class="btn-next" data-question-id="${question.id}">
          ${this.currentQuestion === this.config.questions.length ? '診断結果を見る' : '次へ'}
        </button>
      </div>
    `;

    this.formContainer.innerHTML = '';
    this.formContainer.appendChild(questionHtml);

    // 前回の回答を復元
    if (this.answers[question.id]) {
      if (question.type === 'radio') {
        const radio = questionHtml.querySelector(`input[value="${this.answers[question.id]}"]`);
        if (radio) radio.checked = true;
      } else if (question.type === 'checkbox') {
        const selected = Array.isArray(this.answers[question.id]) ? this.answers[question.id] : [];
        selected.forEach(val => {
          const checkbox = questionHtml.querySelector(`input[value="${val}"]`);
          if (checkbox) checkbox.checked = true;
        });
      }
    }

    // 次へボタンのイベント
    const nextBtn = questionHtml.querySelector('.btn-next');
    nextBtn.addEventListener('click', () => {
      const isAnswered = this.captureAnswer(question);
      if (isAnswered) {
        this.displayNextQuestion();
      }
    });

    // Enter キーで次へ（radio のみ）
    if (question.type === 'radio') {
      const radios = questionHtml.querySelectorAll(`input[name="${question.id}"]`);
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          nextBtn.focus();
        });
      });
    }
  }

  /**
   * 回答をキャプチャして保存
   */
  captureAnswer(question) {
    const inputs = this.formContainer.querySelectorAll(`input[name="${question.id}"]`);

    if (question.type === 'radio') {
      const checked = Array.from(inputs).find(i => i.checked);
      if (!checked) {
        alert('選択してください');
        return false;
      }
      this.answers[question.id] = checked.value;
    } else if (question.type === 'checkbox') {
      const checked = Array.from(inputs)
        .filter(i => i.checked)
        .map(i => i.value);
      if (checked.length === 0) {
        alert('1つ以上選択してください');
        return false;
      }
      this.answers[question.id] = checked;
    }

    // localStorage に保存
    this.saveAnswers();
    return true;
  }

  /**
   * 診断結果を計算・表示
   */
  displayResult() {
    const pattern = this.determineDiagnosisPattern(this.answers);
    const resultConfig = this.config.patterns[pattern];

    this.formContainer.style.display = 'none';
    this.resultContainer.style.display = 'block';
    this.resultContainer.innerHTML = this.renderResultHTML(resultConfig);

    // CTA イベント
    this.attachResultCTAListeners();

    // やり直しボタン
    const retryBtn = this.resultContainer.querySelector('.btn-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.startDiagnosis());
    }

    // Google Analytics イベント記録
    if (window.gtag) {
      gtag('event', 'diagnosis_complete', {
        pattern: pattern
      });
    }
  }

  /**
   * パターン判定ロジック
   */
  determineDiagnosisPattern(answers) {
    let score = {
      aiAgent: 0,
      strategy: 0,
      education: 0
    };

    // Q1: 業種スコア
    const industryMap = {
      'sales': { aiAgent: 15, strategy: 5, education: 0 },
      'admin': { aiAgent: 15, strategy: 5, education: 0 },
      'support': { aiAgent: 15, strategy: 5, education: 0 },
      'planning': { aiAgent: 10, strategy: 15, education: 5 },
      'manufacturing': { aiAgent: 5, strategy: 10, education: 5 },
      'other': { aiAgent: 0, strategy: 5, education: 10 }
    };
    const industryScore = industryMap[answers.q1] || {};
    score.aiAgent += industryScore.aiAgent || 0;
    score.strategy += industryScore.strategy || 0;
    score.education += industryScore.education || 0;

    // Q3: 困っている業務数
    const troubleCount = (answers.q3 || []).length;
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

    // Q4: AI利用度
    const aiUsageMap = {
      'none': { aiAgent: 10, strategy: 0, education: 5 },
      'basic': { aiAgent: 15, strategy: 5, education: 0 },
      'multiple': { aiAgent: 5, strategy: 15, education: 0 },
      'strategic': { aiAgent: 0, strategy: 20, education: 0 }
    };
    const aiUsageScore = aiUsageMap[answers.q4] || {};
    score.aiAgent += aiUsageScore.aiAgent || 0;
    score.strategy += aiUsageScore.strategy || 0;
    score.education += aiUsageScore.education || 0;

    // Q5: 緊急度
    const urgencyMap = {
      'interest': { aiAgent: 0, strategy: 0, education: 5 },
      'consideration': { aiAgent: 10, strategy: 10, education: 0 },
      'implementation': { aiAgent: 20, strategy: 5, education: 0 },
      'urgent': { aiAgent: 30, strategy: 10, education: 0 }
    };
    const urgencyScore = urgencyMap[answers.q5] || {};
    score.aiAgent += urgencyScore.aiAgent || 0;
    score.strategy += urgencyScore.strategy || 0;
    score.education += urgencyScore.education || 0;

    // 最もスコアが高いパターンを返す
    const maxScore = Math.max(score.aiAgent, score.strategy, score.education);
    if (score.aiAgent === maxScore) return 'PATTERN_A';
    if (score.strategy === maxScore) return 'PATTERN_B';
    return 'PATTERN_C';
  }

  /**
   * 結果 HTML をレンダリング
   */
  renderResultHTML(resultConfig) {
    const benefitsHtml = resultConfig.benefits
      .map(b => `<li>✓ ${b}</li>`)
      .join('');

    const flowHtml = resultConfig.flow
      .map((step, idx) => `<div class="flow-item"><span class="flow-number">${idx + 1}</span>${step}</div>`)
      .join('');

    const ctaButtonClass = resultConfig.ctaStrength === 'high'
      ? 'btn-primary'
      : 'btn-secondary';

    const secondaryButtonClass = resultConfig.ctaStrength === 'high'
      ? 'btn-secondary'
      : 'btn-tertiary';

    return `
      <div class="diagnosis-result-content">
        <div class="result-header">
          <div class="result-icon">${resultConfig.icon}</div>
          <h3 class="result-title">${resultConfig.title}</h3>
          <p class="result-description">${resultConfig.description}</p>
        </div>

        <div class="result-benefits">
          <h4>期待される効果</h4>
          <ul>
            ${benefitsHtml}
          </ul>
        </div>

        <div class="result-flow">
          <h4>導入フロー</h4>
          <div class="flow-container">
            ${flowHtml}
          </div>
        </div>

        <div class="result-cta">
          <button class="btn ${ctaButtonClass} btn-primary-cta">
            ${resultConfig.primaryCTA}
          </button>
          <button class="btn ${secondaryButtonClass} btn-secondary-cta">
            ${resultConfig.secondaryCTA}
          </button>
        </div>

        <div class="result-footer">
          <button class="btn-retry">診断をやり直す</button>
        </div>
      </div>
    `;
  }

  /**
   * 結果 CTA イベント設定
   */
  attachResultCTAListeners() {
    const primaryCTA = this.resultContainer.querySelector('.btn-primary-cta');
    const secondaryCTA = this.resultContainer.querySelector('.btn-secondary-cta');

    if (primaryCTA) {
      primaryCTA.addEventListener('click', () => {
        window.location.href = '#contact';
      });
    }

    if (secondaryCTA) {
      secondaryCTA.addEventListener('click', () => {
        // LINE の友達追加 or メール送信フォーム
        alert('詳しくはお問い合わせフォームからご相談ください');
        window.location.href = '#contact';
      });
    }
  }

  /**
   * localStorage に回答を保存
   */
  saveAnswers() {
    localStorage.setItem('diagnosis_answers', JSON.stringify(this.answers));
  }

  /**
   * localStorage から回答を復帰
   */
  loadAnswersFromStorage() {
    const saved = localStorage.getItem('diagnosis_answers');
    if (saved) {
      this.answers = JSON.parse(saved);
    }
  }

  /**
   * イベントリスナー設定
   */
  attachEventListeners() {
    // フォーム内のインタラクティブ要素を委譲で管理
  }

  /**
   * エラー表示
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.formContainer.appendChild(errorDiv);
  }
}

/**
 * DOM 読み込み完了時に初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  const diagnosis = new AIAdoptionDiagnosis('/data/diagnosis-config.json');
});
