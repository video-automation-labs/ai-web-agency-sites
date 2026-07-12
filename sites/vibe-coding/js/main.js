// 月夜 -TSUKIYO- スクロール駆動の月光水庭
import * as THREE from 'three';
import { SITE, AUDIO, PALETTE } from './config.js?r=1';
import {
  initRenderer,
  onResize,
  makeDrift,
  makeWater,
  makeStars,
  glowSprite,
  moonTexture,
  moonPathTexture,
  lerp,
  scrollProgress,
  mountShotHook,
  REDUCED,
} from './fx.js?r=1';
import { createSiteAudio, mountAudioButton, mountSoundGate } from './audio.js?r=1';

// ---- 文言の流し込み ----
document.querySelectorAll('[data-slot]').forEach((el) => {
  const v = SITE[el.dataset.slot];
  if (v) el.textContent = v;
});
const featuresRoot = document.getElementById('features');
SITE.features.forEach((f, i) => {
  const sec = document.createElement('section');
  sec.className = `sec feature ${i % 2 === 0 ? 'left' : 'right'}`;
  sec.innerHTML = `
    <div class="feature-card">
      <p class="feature-en"></p>
      <h2 class="feature-title"></h2>
      <p class="feature-copy"></p>
    </div>`;
  sec.querySelector('.feature-en').textContent = f.en;
  sec.querySelector('.feature-title').textContent = f.title;
  sec.querySelector('.feature-copy').textContent = f.copy;
  featuresRoot.appendChild(sec);
});
document.querySelectorAll('[data-slot-links]').forEach((el) => {
  SITE[el.dataset.slotLinks].forEach((l) => {
    const a = document.createElement('a');
    a.className = 'cta-btn';
    a.href = l.href;
    a.textContent = l.label;
    el.appendChild(a);
  });
});

// セクションのフェードイン
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle('on', e.isIntersecting)),
  { threshold: 0.35 }
);
document.querySelectorAll('.sec').forEach((s) => io.observe(s));

// ---- 音 ----
const audio = await createSiteAudio(AUDIO);
const audioBtn = mountAudioButton(audio);
mountSoundGate(audio, audioBtn);

// ---- 3Dシーン ----
const canvas = document.getElementById('stage');
const renderer = await initRenderer(canvas);
const scene = new THREE.Scene();
scene.background = new THREE.Color(PALETTE.bg);
scene.fog = new THREE.Fog(PALETTE.bg, PALETTE.fogNear, PALETTE.fogFar);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 0.9, 8);
onResize(renderer, camera);

// 月（遠景・カメラ相対で追従）
const MOON_X = -7;
const moonGroup = new THREE.Group();
const moon = new THREE.Mesh(
  new THREE.CircleGeometry(4.6, 64),
  new THREE.MeshBasicMaterial({ map: moonTexture(), fog: false })
);
const haloNear = glowSprite(PALETTE.moonHalo, 13, 0.32);
haloNear.material.fog = false;
const haloFar = glowSprite(PALETTE.moonHaloFar, 34, 0.13);
haloFar.material.fog = false;
moonGroup.add(moon, haloNear, haloFar);
moonGroup.position.set(MOON_X, 11.5, -60);
scene.add(moonGroup);

// 星空
const stars = makeStars({ count: REDUCED ? 300 : 700 });
scene.add(stars);

// 水面
const water = makeWater({
  size: 500,
  y: -1.6,
  moonX: MOON_X,
  deep: PALETTE.waterDeep,
  shallow: PALETTE.waterShallow,
  glint: PALETTE.glint,
});
scene.add(water.mesh);

// 月の道（水面に横たわる光の帯・カメラ相対で追従）
const moonPath = new THREE.Mesh(
  new THREE.PlaneGeometry(7, 130),
  new THREE.MeshBasicMaterial({
    map: moonPathTexture(),
    color: PALETTE.glint,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  })
);
moonPath.rotation.x = -Math.PI / 2;
moonPath.position.set(MOON_X, -1.55, -50);
scene.add(moonPath);

// 桜吹雪
const isMobile = innerWidth < 640;
const petals = makeDrift({
  count: REDUCED || isMobile ? 2500 : 8000,
  area: { x: 36, y: 18, z: 110 },
  center: [0, 2, -40],
  speed: REDUCED ? 0.012 : 0.026,
  dirY: -1,
  sway: 1.4,
  size: 0.16,
  aspect: 0.68,
  baseColor: PALETTE.petalBase,
  tint: PALETTE.petalTint,
  opacity: 0.85,
});
scene.add(petals.mesh);

// 蛍（水面近くをゆっくり上昇する灯）
const fireflies = makeDrift({
  count: REDUCED ? 30 : 90,
  area: { x: 30, y: 4, z: 100 },
  center: [0, -0.4, -40],
  speed: 0.008,
  dirY: 1,
  sway: 2.2,
  size: 0.09,
  aspect: 1,
  baseColor: PALETTE.firefly,
  tint: PALETTE.firefly,
  opacity: 0.9,
  additive: true,
});
scene.add(fireflies.mesh);

// ---- スクロール駆動カメラ ----
const Z0 = 8;
const Z1 = -46;
const zAt = (t) => Z0 + (Z1 - Z0) * t;

let smooth = 0;
const mouse = { x: 0, y: 0 };
addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
});

let pulse = 0;

function step(doRender = true) {
  const t = performance.now() / 1000;
  const p = window.__p ?? scrollProgress();
  smooth = lerp(smooth, p, 0.06);
  const level = audio.getLevel();

  camera.position.z = zAt(smooth);
  camera.position.x = Math.sin(smooth * Math.PI * 1.5) * 0.8 + mouse.x * 0.35;
  camera.position.y = 0.9 + Math.sin(t * 0.4) * 0.06 + mouse.y * -0.2;
  camera.lookAt(camera.position.x * 0.5, 0.5, camera.position.z - 10);

  // 月・月の道・星はカメラ相対（常に遠景）
  moonGroup.position.z = camera.position.z - 62;
  moonPath.position.z = camera.position.z - 55;
  stars.position.z = camera.position.z;

  // 音反応: 花弁・水面・月暈
  petals.uAudio.value = lerp(petals.uAudio.value, level, 0.2);
  water.uAudio.value = lerp(water.uAudio.value, level, 0.15);
  fireflies.uAudio.value = lerp(fireflies.uAudio.value, level * 0.6, 0.1);

  const beat = audio.onset ? audio.onset() : 0;
  if (beat > 0 && !REDUCED) pulse = 1;
  pulse *= 0.94;
  haloNear.scale.setScalar(13 * (1 + pulse * 0.18 + level * 0.1));
  haloNear.material.opacity = 0.32 + pulse * 0.2 + level * 0.12;
  haloFar.scale.setScalar(34 * (1 + pulse * 0.07));
  moonPath.material.opacity = 0.2 + level * 0.35 + pulse * 0.15;

  if (doRender) renderer.render(scene, camera);
}
renderer.setAnimationLoop(() => step(true));

// 検証用フック
mountShotHook();
window.__a = { scene, camera, renderer, petals, water };
window.__frame = (p, n = 1) => {
  window.__p = p;
  smooth = p;
  for (let i = 0; i < n - 1; i++) step(false);
  step(true);
};
