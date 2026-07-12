// 描画部品: WebGPURenderer初期化・発光テクスチャ・TSL水面・漂流パーティクル
import * as THREE from 'three';
import {
  time,
  uniform,
  hash,
  instanceIndex,
  sin,
  fract,
  vec2,
  vec3,
  float,
  uv,
  smoothstep,
  mix,
  positionWorld,
  positionView,
} from 'three/tsl';

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const lerp = (a, b, k) => a + (b - a) * k;

export async function initRenderer(canvas) {
  // ?gl=1 でWebGL強制（検証用）。通常はWebGPU→非対応環境ではWebGLへ自動フォールバック
  const forceWebGL = new URLSearchParams(location.search).has('gl');
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, forceWebGL });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  await renderer.init();
  const isWebGPU = !!(renderer.backend && renderer.backend.isWebGPUBackend);
  const badge = document.createElement('div');
  badge.className = 'gpu-badge';
  badge.textContent = isWebGPU ? 'WEBGPU' : 'WEBGL FALLBACK';
  document.body.appendChild(badge);
  return renderer;
}

export function onResize(renderer, camera) {
  const fix = (w, h) => {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.__fix = fix; // 検証用: 非表示タブでも寸法を与えられる
  window.addEventListener('resize', () => fix(window.innerWidth, window.innerHeight));
}

export function scrollProgress() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  return h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
}

// ---- 発光スプライト ----
let _glowTex = null;
function glowTexture() {
  if (_glowTex) return _glowTex;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.5)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  _glowTex = new THREE.CanvasTexture(c);
  return _glowTex;
}

export function glowSprite(color, scale, opacity = 1) {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(),
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const s = new THREE.Sprite(mat);
  s.scale.setScalar(scale);
  return s;
}

// ---- 月面テクスチャ（海のまだら＋縁の減光。固定シードで毎回同じ月） ----
let _moonTex = null;
export function moonTexture() {
  if (_moonTex) return _moonTex;
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const cx = size / 2;
  const r = size / 2 - 2;

  const base = g.createRadialGradient(cx - r * 0.2, cx - r * 0.24, r * 0.1, cx, cx, r);
  base.addColorStop(0, '#f8f4e6');
  base.addColorStop(0.55, '#eee9d5');
  base.addColorStop(0.85, '#e0d9c1');
  base.addColorStop(1, '#c2bba2');
  g.fillStyle = base;
  g.beginPath();
  g.arc(cx, cx, r, 0, Math.PI * 2);
  g.fill();
  g.save();
  g.clip();

  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 24; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * r * 0.7;
    const x = cx + Math.cos(a) * d;
    const y = cx + Math.sin(a) * d * 0.9;
    const br = r * (0.07 + rnd() * 0.18);
    const alpha = 0.07 + rnd() * 0.11;
    const blot = g.createRadialGradient(x, y, 0, x, y, br);
    blot.addColorStop(0, `rgba(110,108,94,${alpha})`);
    blot.addColorStop(0.7, `rgba(110,108,94,${alpha * 0.5})`);
    blot.addColorStop(1, 'rgba(110,108,94,0)');
    g.fillStyle = blot;
    g.beginPath();
    g.arc(x, y, br, 0, Math.PI * 2);
    g.fill();
  }
  const limb = g.createRadialGradient(cx, cx, r * 0.55, cx, cx, r);
  limb.addColorStop(0, 'rgba(28,30,42,0)');
  limb.addColorStop(0.8, 'rgba(28,30,42,0.15)');
  limb.addColorStop(1, 'rgba(28,30,42,0.5)');
  g.fillStyle = limb;
  g.beginPath();
  g.arc(cx, cx, r, 0, Math.PI * 2);
  g.fill();
  g.restore();

  _moonTex = new THREE.CanvasTexture(c);
  _moonTex.colorSpace = THREE.SRGBColorSpace;
  return _moonTex;
}

// ---- 月の道（水面の光の帯）用テクスチャ: 縦長グラデーション ----
export function moonPathTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const g = c.getContext('2d');
  const gx = g.createLinearGradient(0, 0, 128, 0);
  gx.addColorStop(0, 'rgba(255,255,255,0)');
  gx.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  gx.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gx;
  g.fillRect(0, 0, 128, 512);
  const gy = g.createLinearGradient(0, 0, 0, 512);
  gy.addColorStop(0, 'rgba(0,0,0,0)');
  gy.addColorStop(0.35, 'rgba(0,0,0,0.55)');
  gy.addColorStop(1, 'rgba(0,0,0,0.9)');
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = gy;
  g.fillRect(0, 0, 128, 512);
  return new THREE.CanvasTexture(c);
}

/**
 * TSL水面: 基調色のグラデーション＋月直下の煌めき（月の道）。
 * uAudio(0..1) で煌めきが強くなる。moonX = 月のワールドX座標。
 */
export function makeWater({ size = 400, y = -1.6, moonX = -7, deep, shallow, glint }) {
  const uAudio = uniform(0);
  const toV3 = (hex) => {
    const c = new THREE.Color(hex);
    return vec3(c.r, c.g, c.b);
  };

  const mat = new THREE.MeshBasicNodeMaterial();
  const p = positionWorld;
  const t = time;

  // さざ波: 周期の違うsinを重ねた擬似ノイズ
  const w1 = sin(p.x.mul(0.9).add(t.mul(0.6))).mul(sin(p.z.mul(1.4).sub(t.mul(0.45))));
  const w2 = sin(p.x.mul(2.1).sub(t.mul(0.9)).add(p.z.mul(1.8)));
  const ripple = w1.mul(0.6).add(w2.mul(0.4)); // -1..1

  // 細かい煌めき: 高周波の干渉縞から山だけ拾う
  const sp1 = sin(p.x.mul(9.3).add(t.mul(1.7)).add(sin(p.z.mul(7.1).sub(t.mul(1.3)))));
  const sp2 = sin(p.z.mul(11.7).sub(t.mul(2.1)).add(sin(p.x.mul(6.7).add(t))));
  const sparkle = smoothstep(0.55, 0.98, sp1.mul(sp2));

  // 月の道: 月のX直下ほど強く、縁はさざ波で揺らぐ
  const dx = p.x.sub(float(moonX)).add(ripple.mul(1.1));
  const path = dx.mul(dx).mul(-0.06).exp(); // ガウス状の帯

  // カメラの足元では煌めきを消す（スクリーン上で巨大化して見えるため）
  const viewDist = positionView.z.negate();
  const fade = smoothstep(float(9), float(26), viewDist);

  const base = mix(toV3(deep), toV3(shallow), smoothstep(float(-0.6), float(0.9), ripple));
  const glintStrength = path
    .mul(sparkle.mul(0.85).add(path.mul(0.12)))
    .mul(uAudio.mul(1.6).add(0.55))
    .mul(fade);
  const col = base.add(toV3(glint).mul(glintStrength));

  // ?wdebug=path|sparkle で該当項をグレースケール表示（検証用）
  const dbg = new URLSearchParams(location.search).get('wdebug');
  mat.colorNode = dbg === 'path' ? vec3(path) : dbg === 'sparkle' ? vec3(sparkle) : col;

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size, 1, 1), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  return { mesh, uAudio };
}

/**
 * TSL漂流パーティクル（桜吹雪・蛍に共用）
 * dirY > 0 で上昇、< 0 で降下。uTint / uAudio は uniform ノード。
 */
export function makeDrift({
  count = 6000,
  area = { x: 34, y: 18, z: 100 },
  center = [0, 2, -40],
  speed = 0.03,
  dirY = -1,
  sway = 1.3,
  size = 0.16,
  aspect = 0.68,
  baseColor = '#f3d7de',
  tint = '#d87a8f',
  opacity = 0.85,
  additive = false,
}) {
  const uTint = uniform(new THREE.Color(tint));
  const uAudio = uniform(0);

  const mat = new THREE.SpriteNodeMaterial({
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const i = instanceIndex;
  const h1 = hash(i);
  const h2 = hash(i.add(1234));
  const h3 = hash(i.add(5678));
  const h4 = hash(i.add(9012));
  const t = time;

  const cycle = fract(h2.add(t.mul(float(speed).mul(h1.mul(0.8).add(0.4))).mul(-dirY)));
  const py = cycle.mul(area.y).sub(area.y / 2).add(center[1]);
  const px = h1
    .sub(0.5)
    .mul(area.x)
    .add(sin(t.mul(h4.mul(0.5).add(0.3)).add(h3.mul(6.28))).mul(sway))
    .add(center[0]);
  const pz = h3.sub(0.5).mul(area.z).add(center[2]);

  mat.positionNode = vec3(px, py, pz);
  const s = float(size).mul(h4.mul(h4).mul(1.35).add(0.35)).mul(uAudio.mul(0.7).add(1));
  mat.scaleNode = aspect === 1 ? s : vec2(s, s.mul(aspect));
  mat.rotationNode = t.mul(h4.mul(1.6).add(0.4)).add(h1.mul(6.28));

  const d = uv().sub(vec2(0.5)).length();
  const soft = smoothstep(0.5, 0.16, d);
  const bc = new THREE.Color(baseColor);
  mat.colorNode = mix(vec3(bc.r, bc.g, bc.b), uTint, h2.mul(0.85));
  mat.opacityNode = soft.mul(float(opacity)).mul(h1.mul(0.5).add(0.5));

  const p = new THREE.Sprite(mat);
  p.count = count;
  p.frustumCulled = false;
  return { mesh: p, uTint, uAudio };
}

// ---- 星空 ----
export function makeStars({ count = 700, radius = 160 } = {}) {
  const pos = new Float32Array(count * 3);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const el = rnd() * 0.5 + 0.04; // 仰角: 地平線の少し上〜天頂手前
    const r = radius * (0.8 + rnd() * 0.2);
    pos[i * 3] = Math.cos(a) * Math.cos(el * Math.PI) * r;
    pos[i * 3 + 1] = Math.sin(el * Math.PI) * r * 0.6;
    pos[i * 3 + 2] = Math.sin(a) * Math.cos(el * Math.PI) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: '#cdd3e8',
    size: 0.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    fog: false,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

// 検証用: 非表示タブでもキャンバス内容をJPEGで抜き出す
export function mountShotHook() {
  window.__shot = () => {
    const c = document.querySelector('canvas.stage');
    if (!c) return null;
    const s = document.createElement('canvas');
    const w = 800;
    const h = Math.round((c.height / c.width) * w);
    s.width = w;
    s.height = h;
    s.getContext('2d').drawImage(c, 0, 0, w, h);
    return s.toDataURL('image/jpeg', 0.82);
  };
}
