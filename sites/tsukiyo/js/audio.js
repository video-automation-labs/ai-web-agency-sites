// 生成アンビエント（夜のパッド＋陰旋法の爪弾き）と音解析。
// assets/audio/manifest.json を置けば原盤ループ再生に切り替わる。
// 書式: {"tracks":[{"title":"...","file":"./assets/audio/01.m4a"}]}

export async function createSiteAudio(genOpts = {}) {
  try {
    const res = await fetch('./assets/audio/manifest.json', { cache: 'no-store' });
    if (res.ok) {
      const man = await res.json();
      if (man.tracks && man.tracks.length) return createTrackAudio(man.tracks, man.default ?? 0);
    }
  } catch (_) {
    /* manifestなし = 生成音 */
  }
  return createNightAudio(genOpts);
}

// 拍検出: スペクトラルフラックス（音色の立ち上がり）。0=拍なし、>0=拍の強さ
function makeOnsetDetector(getAnalyser) {
  let prev = null;
  let cur = null;
  const hist = [];
  let lastBeat = 0;
  return function onset() {
    const an = getAnalyser();
    if (!an) return 0;
    const n = an.frequencyBinCount;
    if (!prev) {
      prev = new Uint8Array(n);
      cur = new Uint8Array(n);
    }
    an.getByteFrequencyData(cur);
    const lim = Math.min(n, 240);
    let flux = 0;
    for (let i = 2; i < lim; i++) {
      const d = cur[i] - prev[i];
      if (d > 0) flux += d;
    }
    const tmp = prev;
    prev = cur;
    cur = tmp;
    flux /= lim * 255;
    hist.push(flux);
    if (hist.length > 43) hist.shift();
    if (hist.length < 20) return 0;
    const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
    let v = 0;
    for (const f of hist) v += (f - mean) * (f - mean);
    const sd = Math.sqrt(v / hist.length);
    const now = performance.now();
    if (flux > mean + sd * 1.5 && flux > 0.012 && now - lastBeat > 160) {
      lastBeat = now;
      return Math.min(1, ((flux - mean) / (mean + 1e-4)) * 0.6);
    }
    return 0;
  };
}

function makeLevelReader(getAnalyser, getBuf) {
  return function getLevel() {
    const analyser = getAnalyser();
    const td = getBuf();
    if (!analyser || !td) return 0;
    analyser.getByteTimeDomainData(td);
    let s = 0;
    for (let i = 0; i < td.length; i += 4) {
      const v = td[i] - 128;
      s += v * v;
    }
    return Math.min(1, Math.sqrt(s / (td.length / 4)) / 34);
  };
}

// 原盤ループ再生: HTMLAudio → WebAudio解析
function createTrackAudio(tracks, defaultIdx = 0) {
  let ctx = null;
  let analyser = null;
  let gain = null;
  let el = null;
  let td = null;
  let running = false;
  let idx = defaultIdx;

  function ensure() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.src = tracks[idx].file;
    const src = ctx.createMediaElementSource(el);
    gain = ctx.createGain();
    gain.gain.value = 0;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    td = new Uint8Array(analyser.fftSize);
    src.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);
  }

  return {
    get running() {
      return running;
    },
    onset: makeOnsetDetector(() => (running ? analyser : null)),
    getLevel: makeLevelReader(() => (running ? analyser : null), () => td),
    toggle() {
      ensure();
      if (ctx.state === 'suspended') ctx.resume();
      running = !running;
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(running ? 1 : 0, t, 0.6);
      if (running) el.play();
      else
        setTimeout(() => {
          if (!running) el.pause();
        }, 900);
      return running;
    },
    setTrack(i) {
      if (i === idx || !tracks[i]) return;
      idx = i;
      if (!ctx) return;
      el.src = tracks[i].file;
      if (running) el.play();
    },
  };
}

// 生成音: 夜のパッド＋陰旋法の爪弾き
export function createNightAudio(opts = {}) {
  const {
    root = 164.81,
    scale = [0, 1, 5, 7, 8],
    pluckEvery = [1.8, 4.2],
    pluckType = 'triangle',
    pluckLevel = 0.13,
    padLevel = 0.14,
    brightness = 950,
  } = opts;

  let ctx = null;
  let analyser = null;
  let master = null;
  let timer = null;
  let running = false;
  let td = null;

  function ensure() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = brightness;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    td = new Uint8Array(analyser.fftSize);
    master.connect(filt);
    filt.connect(analyser);
    analyser.connect(ctx.destination);

    // パッド: 根音・五度・オクターブ＋僅かなデチューンをLFOで揺らす
    [
      [0.5, 0.5],
      [0.75, 0.22],
      [1.0, 0.3],
      [1.006, 0.18],
    ].forEach(([ratio, g]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = root * ratio;
      const gn = ctx.createGain();
      gn.gain.value = g * padLevel;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + Math.random() * 0.09;
      const lg = ctx.createGain();
      lg.gain.value = g * padLevel * 0.6;
      lfo.connect(lg);
      lg.connect(gn.gain);
      o.connect(gn);
      gn.connect(master);
      o.start();
      lfo.start();
    });
  }

  function note(freq, when, dur = 1.9, level = pluckLevel) {
    const o = ctx.createOscillator();
    o.type = pluckType;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(level, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g);
    g.connect(master);
    o.start(when);
    o.stop(when + dur + 0.1);
  }

  function pluckLoop() {
    if (!running) return;
    const deg = scale[Math.floor(Math.random() * scale.length)];
    const oct = Math.random() < 0.3 ? 2 : 1;
    note(root * Math.pow(2, deg / 12) * oct, ctx.currentTime);
    const [a, b] = pluckEvery;
    timer = setTimeout(pluckLoop, (a + Math.random() * (b - a)) * 1000);
  }

  return {
    get running() {
      return running;
    },
    onset: makeOnsetDetector(() => (running ? analyser : null)),
    getLevel: makeLevelReader(() => (running ? analyser : null), () => td),
    toggle() {
      ensure();
      if (ctx.state === 'suspended') ctx.resume();
      running = !running;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(running ? 1 : 0, t, 0.8);
      if (running) pluckLoop();
      else if (timer) clearTimeout(timer);
      return running;
    },
    setTrack() {},
  };
}

// 入場ゲート: 音のオン/オフを最初に選んでもらう（クリックが自動再生制限の解除になる）
export function mountSoundGate(audio, audioBtn) {
  const gate = document.createElement('div');
  gate.className = 'sound-gate';
  gate.innerHTML = `
    <div class="sound-gate-panel" role="dialog" aria-label="サウンド設定">
      <p class="sound-gate-en">SOUND</p>
      <p class="sound-gate-text">音の流れるサイトです。</p>
      <div class="sound-gate-actions">
        <button type="button" class="sound-gate-btn" data-sound="on">音ありで見る</button>
        <button type="button" class="sound-gate-btn" data-sound="off">音なしで見る</button>
      </div>
    </div>`;
  gate.addEventListener('click', (e) => {
    const btn = e.target.closest('.sound-gate-btn');
    if (!btn) return;
    if (btn.dataset.sound === 'on' && !audio.running) audioBtn.click();
    gate.classList.add('closing');
    setTimeout(() => gate.remove(), 650);
  });
  document.body.appendChild(gate);
  return gate;
}

export function mountAudioButton(audio, labelOn = '音を流す', labelOff = '音を止める') {
  const b = document.createElement('button');
  b.className = 'audio-btn';
  b.textContent = labelOn;
  b.addEventListener('click', () => {
    const on = audio.toggle();
    b.textContent = on ? labelOff : labelOn;
    b.classList.toggle('on', on);
  });
  document.body.appendChild(b);
  return b;
}
