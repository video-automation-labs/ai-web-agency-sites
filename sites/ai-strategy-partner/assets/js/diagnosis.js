/**
 * AI導入診断 — Rebuilt for Apple-inspired UI
 */

const LINE_URL = 'https://lin.ee/kJu1w8C';

class AIAdoptionDiagnosis {
  constructor() {
    this.config = null;
    this.answers = {};
    this.currentQuestion = 0;
    this.formContainer = document.getElementById('diagnosisForm');
    this.resultContainer = document.getElementById('diagnosisResult');
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const response = await fetch('./data/diagnosis-config.json');
      if (!response.ok) throw new Error(`${response.status}`);
      this.config = await response.json();
      this.setupStartButton();
    } catch (e) {
      console.error('Config load error:', e);
    }
  }

  setupStartButton() {
    const btn = document.getElementById('diagnosisStartBtn');
    if (btn) btn.addEventListener('click', () => this.start());
  }

  start() {
    this.answers = {};
    this.currentQuestion = 0;

    const btn = document.getElementById('diagnosisStartBtn');
    if (btn) btn.style.display = 'none';

    this.resultContainer.innerHTML = '';
    this.resultContainer.style.display = 'none';
    this.formContainer.style.display = 'block';

    this.showQuestion();
  }

  showQuestion() {
    const questions = this.config.questions;

    if (this.currentQuestion >= questions.length) {
      this.showResult();
      return;
    }

    const q = questions[this.currentQuestion];
    const total = questions.length;
    const current = this.currentQuestion + 1;
    const progressPct = Math.round(((current - 1) / total) * 100);

    const isLast = current === total;

    const optionsHtml = q.options.map(opt => `
      <label class="diag-option">
        <input type="${q.type}" name="${q.id}" value="${opt.value}">
        <span class="diag-option-text">${opt.label}</span>
      </label>
    `).join('');

    this.formContainer.innerHTML = `
      <div class="diag-block">
        <div class="diag-progress">
          <div class="diag-progress-bar" style="width:${progressPct}%"></div>
        </div>
        <div class="diag-step">${current} / ${total}</div>
        <h3 class="diag-question">${q.text}</h3>
        <div class="diag-options">${optionsHtml}</div>
        <button class="diag-next-btn" id="diagNextBtn">
          ${isLast ? '診断結果を見る' : '次へ →'}
        </button>
        <p class="diag-hint">${q.type === 'checkbox' ? '複数選択できます' : '1つ選んでください'}</p>
      </div>
    `;

    document.getElementById('diagNextBtn').addEventListener('click', () => {
      if (this.capture(q)) {
        this.currentQuestion++;
        this.showQuestion();
      }
    });
  }

  capture(q) {
    const inputs = this.formContainer.querySelectorAll(`input[name="${q.id}"]`);
    if (q.type === 'radio') {
      const checked = Array.from(inputs).find(i => i.checked);
      if (!checked) { this.shake(); return false; }
      this.answers[q.id] = checked.value;
    } else {
      const checked = Array.from(inputs).filter(i => i.checked).map(i => i.value);
      if (!checked.length) { this.shake(); return false; }
      this.answers[q.id] = checked;
    }
    return true;
  }

  shake() {
    const block = this.formContainer.querySelector('.diag-block');
    if (!block) return;
    block.classList.add('diag-shake');
    setTimeout(() => block.classList.remove('diag-shake'), 500);
  }

  showResult() {
    const pattern = this.calcPattern();
    const r = this.config.patterns[pattern];

    this.formContainer.style.display = 'none';
    this.resultContainer.style.display = 'block';

    const benefitsHtml = r.benefits.map(b => `<li>${b}</li>`).join('');
    const flowHtml = r.flow.map((s, i) => `
      <div class="diag-flow-step">
        <span class="diag-flow-num">${String(i + 1).padStart(2, '0')}</span>
        <span>${s}</span>
      </div>
    `).join('');

    this.resultContainer.innerHTML = `
      <div class="diag-result">
        <div class="diag-result-label">診断結果</div>
        <h3 class="diag-result-title">${r.title}</h3>
        <p class="diag-result-desc">${r.description}</p>

        <div class="diag-result-section">
          <h4>期待される効果</h4>
          <ul class="diag-benefits">${benefitsHtml}</ul>
        </div>

        <div class="diag-result-section">
          <h4>推奨ステップ</h4>
          <div class="diag-flow">${flowHtml}</div>
        </div>

        <div class="diag-result-cta">
          <a href="${LINE_URL}" target="_blank" rel="noopener" class="btn-line diag-cta-btn">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M40 22.3C40 15.5 33.2 10 24.8 10C16.4 10 9.6 15.5 9.6 22.3C9.6 28.4 14.9 33.5 22.2 34.4C22.7 34.5 23.4 34.7 23.6 35.1C23.8 35.5 23.7 36.1 23.6 36.5L23.3 38.1C23.2 38.5 22.9 39.5 24.8 38.7C26.7 37.9 34.9 32.8 38.4 28.8C40.8 26.3 40 24 40 22.3Z" fill="white"/></svg>
            この結果をLINEで相談する（無料）
          </a>
          <button class="diag-retry-btn" id="diagRetryBtn">もう一度診断する</button>
        </div>
      </div>
    `;

    document.getElementById('diagRetryBtn').addEventListener('click', () => this.start());
  }

  calcPattern() {
    const a = this.answers;
    let score = { A: 0, B: 0, C: 0 };

    // Q1: 業種
    const q1map = {
      sales:         { A: 15, B: 5,  C: 0  },
      admin:         { A: 15, B: 5,  C: 0  },
      support:       { A: 15, B: 5,  C: 0  },
      planning:      { A: 10, B: 15, C: 5  },
      manufacturing: { A: 5,  B: 10, C: 5  },
      other:         { A: 0,  B: 5,  C: 10 }
    };
    const q1 = q1map[a.q1] || {};
    score.A += q1.A || 0; score.B += q1.B || 0; score.C += q1.C || 0;

    // Q3: 困っている業務数
    const cnt = (a.q3 || []).length;
    if      (cnt >= 3) { score.A += 20; }
    else if (cnt === 2) { score.B += 15; score.A += 10; }
    else if (cnt === 1) { score.B += 15; score.C += 10; }
    else               { score.C += 20; }

    // Q4: AI利用度
    const q4map = {
      none:      { A: 10, B: 0,  C: 5  },
      basic:     { A: 15, B: 5,  C: 0  },
      multiple:  { A: 5,  B: 15, C: 0  },
      strategic: { A: 0,  B: 20, C: 0  }
    };
    const q4 = q4map[a.q4] || {};
    score.A += q4.A || 0; score.B += q4.B || 0; score.C += q4.C || 0;

    // Q5: 緊急度
    const q5map = {
      interest:       { A: 0,  B: 0,  C: 5  },
      consideration:  { A: 10, B: 10, C: 0  },
      implementation: { A: 20, B: 5,  C: 0  },
      urgent:         { A: 30, B: 10, C: 0  }
    };
    const q5 = q5map[a.q5] || {};
    score.A += q5.A || 0; score.B += q5.B || 0; score.C += q5.C || 0;

    const max = Math.max(score.A, score.B, score.C);
    if (score.A === max) return 'PATTERN_A';
    if (score.B === max) return 'PATTERN_B';
    return 'PATTERN_C';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AIAdoptionDiagnosis();
});
