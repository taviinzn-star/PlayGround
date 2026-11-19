import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const game = document.querySelector('#game');
const intro = document.querySelector('#intro');
const enterButton = document.querySelector('#enter-button');
const loading = document.querySelector('#loading');
const toast = document.querySelector('#toast');
const coordLabel = document.querySelector('#coordinates');
const soundButton = document.querySelector('#sound-toggle');
const soundIcon = document.querySelector('#sound-icon');
const isMobile = matchMedia('(pointer: coarse)').matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#111a32');
scene.fog = new THREE.FogExp2('#111a32', 0.0085);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 260);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 1.8));
renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;

const mat = (color, roughness = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
const stone = mat('#626c83');
const stoneLight = mat('#8790a3');
const edgeStone = mat('#414b64');
const gold = mat('#dfad68', 0.36, { metalness: 0.28 });
const darkMetal = mat('#22283d', 0.45, { metalness: 0.58 });
const velvet = mat('#bb5961', 0.92);
const velvetDark = mat('#8e3f53', 0.9);
const linen = mat('#e3d8c6', 0.94);
const teal = mat('#3c7883', 0.9);
const glowMat = new THREE.MeshBasicMaterial({ color: '#ffc879' });

scene.add(new THREE.HemisphereLight('#a9c5e8', '#282239', 1.65));
const moonLight = new THREE.DirectionalLight('#ffe0b0', 3.1);
moonLight.position.set(-24, 35, 18);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
moonLight.shadow.camera.left = -34; moonLight.shadow.camera.right = 34;
moonLight.shadow.camera.top = 34; moonLight.shadow.camera.bottom = -34;
moonLight.shadow.camera.near = 1; moonLight.shadow.camera.far = 90;
moonLight.shadow.bias = -0.00022;
moonLight.shadow.normalBias = 0.025;
scene.add(moonLight);
const fill = new THREE.PointLight('#648cce', 105, 88, 2);
fill.position.set(13, 10, -17); scene.add(fill);
const warm = new THREE.PointLight('#ffa76b', 76, 48, 2);
warm.position.set(-13, 7, 9); scene.add(warm);

function box(parent, name, size, position, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}
function sphere(parent, name, size, position, material, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, Math.max(12, segments - 4)), material);
  mesh.name = name; mesh.scale.set(...size); mesh.position.set(...position);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cylinder(parent, name, top, bottom, height, position, material, segments = 12) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, segments), material);
  mesh.name = name; mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

// A deep, layered floating rock gives the central arena a real suspended silhouette.
const arena = new THREE.Group(); scene.add(arena);
const arenaBase = new THREE.Mesh(new THREE.CylinderGeometry(17.2, 12.4, 5.2, 12, 3), edgeStone);
arenaBase.position.y = -2.45; arenaBase.rotation.y = Math.PI / 12; arenaBase.castShadow = true; arenaBase.receiveShadow = true; arena.add(arenaBase);
const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(17.8, 17.2, 0.82, 12, 1), stone);
topPlate.position.y = 0.18; topPlate.rotation.y = Math.PI / 12; topPlate.receiveShadow = true; topPlate.castShadow = true; arena.add(topPlate);
const floor = new THREE.Mesh(new THREE.CylinderGeometry(17.35, 17.35, 0.15, 48), mat('#9295a0', 0.95));
floor.position.y = 0.64; floor.receiveShadow = true; arena.add(floor);
// Broken concentric inlays on the arena surface.
for (let i = 0; i < 16; i++) {
  const a = i / 16 * Math.PI * 2;
  const arc = new THREE.Mesh(new THREE.TorusGeometry(15.15, 0.055, 5, 24, Math.PI / 7), i % 2 ? darkMetal : gold);
  arc.rotation.x = Math.PI / 2; arc.rotation.z = a; arc.position.set(Math.sin(a) * 0.18, 0.73, Math.cos(a) * 0.18); arena.add(arc);
}
for (let i = 0; i < 12; i++) {
  const a = i / 12 * Math.PI * 2;
  const x = Math.sin(a) * 17.22, z = Math.cos(a) * 17.22;
  const p = new THREE.Group(); p.position.set(x, 0.8, z); p.rotation.y = -a;
  box(p, 'Arena rim block', [2.4, 0.35, 0.36], [0, 0, 0], i % 3 === 0 ? gold : edgeStone);
  arena.add(p);
}
// Floating rock teeth beneath the island.
for (let i = 0; i < 18; i++) {
  const a = i * 2.399;
  const y = -4.6 - (i % 5) * 1.05;
  const r = 5.5 + (i % 4) * 1.1;
  const shard = new THREE.Mesh(new THREE.ConeGeometry(0.65 + (i % 3) * 0.25, 2.8 + (i % 4) * 0.65, 5), i % 4 === 0 ? stoneLight : edgeStone);
  shard.position.set(Math.cos(a) * r, y, Math.sin(a) * r); shard.rotation.set(0.2 * Math.sin(a), a, 0.18 * Math.cos(a));
  shard.castShadow = true; shard.receiveShadow = true; arena.add(shard);
}

// Elevated stepping stones and distant floating slabs, each made of actual 3D meshes.
const platformData = [
  [-22, 4.1, -6, 5.0, 4.1, 0.9, 0.3], [22, 2.8, -9, 5.6, 4.4, 1.1, -0.2],
  [-19, -1.6, 12, 4.1, 4.8, 0.9, -0.4], [20, 7.5, 13, 5.0, 4.0, 1.0, 0.2],
  [1, 8.6, -29, 7.6, 5.2, 1.25, 0], [-4, -1.7, 27, 6.7, 5.1, 1.0, 0.1],
  [-34, 10.4, -24, 5.4, 4.3, 0.9, 0.5], [34, 3.4, 27, 5.4, 4.8, 1.2, -0.2],
  [39, 12.5, -18, 7, 5.1, 1.2, 0.35], [-41, 5.5, 20, 6.2, 4.8, 1.0, 0.1],
  [0, 1.0, -49, 8.2, 6.4, 1.1, 0.2], [48, 7.2, 7, 5.7, 5.1, 0.9, -0.3],
];
platformData.forEach(([x, y, z, w, d, h, rot], i) => {
  const island = new THREE.Group(); island.position.set(x, y, z); island.rotation.y = rot; scene.add(island);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.52, w * 0.4, h, 6), i % 4 === 0 ? teal : stone);
  cap.scale.z = d / w; cap.position.y = -h * 0.5; cap.castShadow = true; cap.receiveShadow = true; island.add(cap);
  const surface = new THREE.Mesh(new THREE.BoxGeometry(w, 0.24, d), i % 3 === 1 ? stoneLight : stone);
  surface.position.y = 0.06; surface.castShadow = true; surface.receiveShadow = true; island.add(surface);
  const vein = new THREE.Mesh(new THREE.BoxGeometry(w * 0.65, 0.045, 0.055), i % 2 ? darkMetal : gold);
  vein.position.set(0, 0.19, d * 0.23); island.add(vein);
  const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.72, 2.1, 5), edgeStone);
  tooth.position.set(w * 0.22, -h - 1.0, -d * 0.2); tooth.rotation.z = 0.18; tooth.castShadow = true; island.add(tooth);
  if (i % 3 === 0) {
    const post = cylinder(island, 'Broken beacon', 0.12, 0.18, 2.4, [-w * 0.28, 1.32, 0], darkMetal, 8);
    sphere(island, 'Beacon light', [0.2, 0.2, 0.2], [-w * 0.28, 2.65, 0], glowMat, 12);
  }
});

// Giant furniture islands: a richly upholstered sofa and a bed with oversized pillows.
function makeSofa(x, z, scale = 1) {
  const g = new THREE.Group(); g.position.set(x, 0.77, z); g.rotation.y = -0.32; g.scale.setScalar(scale); scene.add(g);
  const base = box(g, 'Sofa carved plinth', [8.2, 0.58, 3.2], [0, 0.1, 0], darkMetal);
  box(g, 'Sofa front rail', [7.6, 0.55, 0.38], [0, 0.28, 1.45], gold);
  box(g, 'Sofa back', [7.6, 2.2, 0.5], [0, 1.52, -1.3], velvetDark);
  box(g, 'Sofa back cushion', [6.9, 1.65, 0.44], [0, 1.78, -0.95], velvet);
  box(g, 'Sofa seat', [6.55, 0.55, 2.15], [0, 0.72, 0.1], velvet);
  for (const sx of [-3.75, 3.75]) {
    box(g, 'Sofa arm', [0.8, 1.65, 3], [sx, 0.86, 0], velvetDark);
    box(g, 'Sofa arm cap', [0.86, 0.16, 2.9], [sx, 1.72, 0], gold);
    for (const sz of [-1.12, 1.12]) cylinder(g, 'Sofa foot', 0.13, 0.19, 0.7, [sx * 0.8, -0.44, sz], darkMetal, 8);
  }
  for (let i = 0; i < 3; i++) {
    const cushion = box(g, 'Sofa seat cushion', [2.02, 0.4, 1.68], [-2.18 + i * 2.18, 1.16, 0.08], i === 1 ? mat('#d78770') : linen);
    cushion.rotation.y = (i - 1) * 0.035;
    const pillow = sphere(g, 'Sofa pillow', [0.61, 0.72, 0.28], [-2.45 + i * 2.45, 1.78, -0.61], i === 1 ? teal : linen, 24);
    pillow.rotation.z = (i - 1) * -0.16;
  }
  return g;
}
function makeBed(x, y, z, scale = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = 0.42; g.scale.setScalar(scale); scene.add(g);
  box(g, 'Bed floating base', [8.5, 0.65, 11], [0, 0.12, 0], darkMetal);
  box(g, 'Bed side trim', [8.7, 0.18, 11.1], [0, 0.43, 0], gold);
  box(g, 'Bed mattress', [8.15, 1.1, 10.4], [0, 0.97, 0], linen);
  box(g, 'Bed headboard', [8.7, 3.4, 0.55], [0, 2.03, -5.15], velvetDark);
  box(g, 'Headboard inset', [7.9, 2.75, 0.16], [0, 2.12, -4.83], velvet);
  for (let i = 0; i < 3; i++) {
    const pillow = sphere(g, 'Oversized pillow', [1.32, 0.43, 0.92], [-2.3 + i * 2.3, 1.72, -3.48], i === 1 ? teal : '#f5e9d8', 28);
    pillow.rotation.y = (i - 1) * 0.045;
    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.018, 5, 36), gold);
    seam.scale.set(1.54, 0.55, 1); seam.rotation.x = Math.PI / 2; seam.position.set(-2.3 + i * 2.3, 1.79, -3.48); g.add(seam);
  }
  const blanket = box(g, 'Folded blanket', [7.9, 0.16, 3.1], [0, 1.58, 1.78], teal);
  blanket.rotation.x = -0.018;
  for (let i = -3; i <= 3; i++) box(g, 'Blanket stitch', [0.025, 0.025, 2.8], [i * 1.05, 1.68, 1.78], gold, {castShadow:false});
  for (const sx of [-3.6, 3.6]) for (const sz of [-4.5, 4.5]) cylinder(g, 'Bed leg', 0.19, 0.27, 1.0, [sx, -0.66, sz], gold, 8);
  return g;
}
makeSofa(-6.2, -7.0, 1.0);
makeBed(1.4, 8.95, -28.6, 0.94);
// A monumental armchair and stacked cushions make the other distant platforms read as furniture.
const chair = new THREE.Group(); chair.position.set(21.5, 2.6, -9.0); chair.rotation.y = -0.4; scene.add(chair);
box(chair, 'Giant chair seat', [5.4, 0.75, 4.5], [0, 0.7, 0], velvet);
box(chair, 'Giant chair back', [5.4, 4.3, 0.8], [0, 2.8, -1.9], velvetDark);
box(chair, 'Giant chair cushion', [4.1, 0.38, 3.4], [0, 1.28, 0.25], linen);
for (const x of [-2.45, 2.45]) box(chair, 'Chair arm', [0.62, 1.8, 4.2], [x, 1.48, 0], teal);

// A few small architectural landmarks help establish scale across the void.
function addPillar(x, y, z, height, material = darkMetal) {
  const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
  cylinder(g, 'Monument shaft', 0.42, 0.65, height, [0, height / 2, 0], material, 8);
  cylinder(g, 'Monument capital', 0.8, 0.8, 0.28, [0, height, 0], gold, 8);
  sphere(g, 'Floating light', [0.22, 0.22, 0.22], [0, height + 0.42, 0], glowMat, 12);
}
addPillar(-12, 0.8, -12, 4.2); addPillar(12, 0.8, -13, 3.1); addPillar(0, 0.8, -15.1, 5.0);

// Starfield and distant atmospheric specks (GPU point cloud, no flat backdrop image).
const starCount = isMobile ? 650 : 1200;
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const radius = 72 + Math.random() * 105;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
  starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  const c = new THREE.Color(i % 7 === 0 ? '#ffce8b' : (i % 4 === 0 ? '#83b6e2' : '#d4ddf2'));
  starColors[i * 3] = c.r; starColors[i * 3 + 1] = c.g; starColors[i * 3 + 2] = c.b;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.26, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true }));
scene.add(stars);
// Glowing, curved nebula ribbons are real tube geometry suspended in the sky.
for (let j = 0; j < 3; j++) {
  const points = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    points.push(new THREE.Vector3(-65 + t * 130, 23 + Math.sin(t * 7 + j * 1.6) * 5 + j * 5, -68 - j * 8 + Math.cos(t * 8 + j) * 6));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.09 + j * 0.04, 5, false), new THREE.MeshBasicMaterial({ color: j === 1 ? '#9873c7' : '#5584bc', transparent: true, opacity: 0.24 }));
  scene.add(ribbon);
}
const moon = new THREE.Mesh(new THREE.SphereGeometry(3.1, 24, 18), new THREE.MeshBasicMaterial({ color: '#f5d6a5' }));
moon.position.set(-44, 30, -85); scene.add(moon);
const moonHalo = new THREE.Mesh(new THREE.SphereGeometry(4.2, 20, 16), new THREE.MeshBasicMaterial({ color: '#f2bd78', transparent: true, opacity: 0.08, side: THREE.BackSide }));
moonHalo.position.copy(moon.position); scene.add(moonHalo);

// Simple stylized explorer avatar: enough scale reference for third-person navigation.
const player = new THREE.Group(); player.position.set(0, 0.77, 3.8); scene.add(player);
const bodyMat = mat('#d85e59', 0.62), darkSuit = mat('#222b43', 0.68), skin = mat('#e5b994', 0.84);
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.43, 0.7, 4, 8), bodyMat); torso.position.y = 1.36; torso.castShadow = true; player.add(torso);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), skin); head.position.y = 2.1; head.castShadow = true; player.add(head);
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), darkSuit); hair.position.y = 2.21; hair.castShadow = true; player.add(hair);
const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.12, 6, 14), gold); scarf.position.y = 1.87; scarf.rotation.x = Math.PI / 2; player.add(scarf);
for (const side of [-1, 1]) {
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.56, 3, 6), bodyMat);
  arm.position.set(side * 0.52, 1.35, 0); arm.rotation.z = -side * 0.14; arm.castShadow = true; player.add(arm);
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.58, 3, 6), darkSuit);
  leg.position.set(side * 0.2, 0.48, 0); leg.castShadow = true; player.add(leg);
  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.19, 0.53), darkSuit);
  boot.position.set(side * 0.2, 0.15, 0.1); boot.castShadow = true; player.add(boot);
}

let yaw = 0.38, pitch = 0.29, distance = isMobile ? 20 : 23;
let targetYaw = yaw, targetPitch = pitch, targetDistance = distance;
let cameraTarget = new THREE.Vector3();
let started = false, pointer = null, pointerX = 0, pointerY = 0, pinchStart = 0;
let walkInput = { x: 0, z: 0 }, keys = new Set(), lastMove = 0;
const clock = new THREE.Clock();
const lookAtTarget = new THREE.Vector3();
function updateCamera(dt) {
  yaw += (targetYaw - yaw) * Math.min(1, dt * 8);
  pitch += (targetPitch - pitch) * Math.min(1, dt * 8);
  distance += (targetDistance - distance) * Math.min(1, dt * 7);
  lookAtTarget.set(player.position.x, player.position.y + 1.35, player.position.z);
  cameraTarget.lerp(lookAtTarget, Math.min(1, dt * 5));
  const horizontal = Math.cos(pitch) * distance;
  camera.position.set(cameraTarget.x + Math.sin(yaw) * horizontal, cameraTarget.y + Math.sin(pitch) * distance, cameraTarget.z + Math.cos(yaw) * horizontal);
  camera.lookAt(cameraTarget);
}
function resize() {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 1.8)); renderer.setSize(innerWidth, innerHeight, false);
}
addEventListener('resize', resize, { passive: true });

function startGame() {
  if (started) return;
  started = true;
  intro.classList.add('hidden');
  document.querySelector('#camera-hint').style.opacity = '0';
  setTimeout(() => { intro.style.display = 'none'; }, 800);
  if (isMobile) document.querySelector('.mobile-controls').classList.add('active');
  showToast('Arena pronta. Explore ao seu ritmo.');
}
enterButton.addEventListener('click', startGame);

canvas.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.joystick')) return;
  if (pointer === null) {
    pointer = event.pointerId; pointerX = event.clientX; pointerY = event.clientY;
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
  }
});
canvas.addEventListener('pointermove', (event) => {
  if (event.pointerId !== pointer) return;
  const dx = event.clientX - pointerX, dy = event.clientY - pointerY;
  pointerX = event.clientX; pointerY = event.clientY;
  targetYaw -= dx * 0.0052;
  targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.0045, -0.12, 1.02);
});
function releasePointer(event) { if (event.pointerId === pointer) pointer = null; }
canvas.addEventListener('pointerup', releasePointer); canvas.addEventListener('pointercancel', releasePointer);
canvas.addEventListener('wheel', (event) => { event.preventDefault(); targetDistance = THREE.MathUtils.clamp(targetDistance + event.deltaY * 0.018, 9, 37); }, { passive: false });
canvas.addEventListener('touchstart', (event) => { if (event.touches.length === 2) pinchStart = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY); }, { passive: true });
canvas.addEventListener('touchmove', (event) => { if (event.touches.length === 2) { const d = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY); targetDistance = THREE.MathUtils.clamp(targetDistance + (pinchStart - d) * 0.035, 9, 37); pinchStart = d; } }, { passive: true });
addEventListener('keydown', (event) => { if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)) event.preventDefault(); keys.add(event.code); if (event.code === 'Enter' && !started) startGame(); });
addEventListener('keyup', (event) => keys.delete(event.code));
addEventListener('blur', () => keys.clear());

// Mobile virtual joystick; camera is controlled by dragging anywhere else on the canvas.
const joystick = document.querySelector('#joystick');
const knob = document.querySelector('.stick-knob');
let stickPointer = null;
joystick.addEventListener('pointerdown', (event) => { event.preventDefault(); stickPointer = event.pointerId; joystick.setPointerCapture(event.pointerId); updateStick(event); });
joystick.addEventListener('pointermove', (event) => { if (event.pointerId === stickPointer) updateStick(event); });
function updateStick(event) {
  const rect = joystick.querySelector('.stick-base').getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2), dy = event.clientY - (rect.top + rect.height / 2);
  const radius = 25, len = Math.hypot(dx, dy), scale = len > radius ? radius / len : 1;
  const x = dx * scale, y = dy * scale;
  knob.style.transform = `translate(${x}px,${y}px)`;
  walkInput.x = x / radius; walkInput.z = y / radius;
}
function resetStick(event) { if (event.pointerId === stickPointer) { stickPointer = null; walkInput.x = 0; walkInput.z = 0; knob.style.transform = ''; } }
joystick.addEventListener('pointerup', resetStick); joystick.addEventListener('pointercancel', resetStick);

let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }

// Optional synthesized low-level ambient tone (no downloaded audio or hidden playback).
let audioContext = null, ambientGain = null, audioOn = false;
soundButton.addEventListener('click', async () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioContext.createOscillator(), osc2 = audioContext.createOscillator();
      ambientGain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 230;
      osc1.type = 'sine'; osc1.frequency.value = 55; osc2.type = 'sine'; osc2.frequency.value = 82.4;
      const mix = audioContext.createGain(); mix.gain.value = 0.18;
      osc1.connect(mix); osc2.connect(mix); mix.connect(filter); filter.connect(ambientGain); ambientGain.connect(audioContext.destination);
      ambientGain.gain.value = 0; osc1.start(); osc2.start();
    }
    await audioContext.resume(); audioOn = !audioOn;
    ambientGain.gain.setTargetAtTime(audioOn ? 0.075 : 0, audioContext.currentTime, 0.25);
    soundButton.setAttribute('aria-label', audioOn ? 'Desativar som ambiente' : 'Ativar som ambiente');
    soundIcon.innerHTML = audioOn ? '<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a5 5 0 0 1 0 6"/>' : '<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m17 9 5 6m0-6-5 6"/>';
  } catch { showToast('Áudio indisponível neste navegador.'); }
});

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  const now = clock.elapsedTime;
  stars.rotation.y = now * 0.002;
  fill.position.y = 10 + Math.sin(now * 0.35) * 1.2;
  const inputX = walkInput.x + ((keys.has('KeyD') || keys.has('ArrowRight')) ? 1 : 0) - ((keys.has('KeyA') || keys.has('ArrowLeft')) ? 1 : 0);
  const inputZ = walkInput.z + ((keys.has('KeyS') || keys.has('ArrowDown')) ? 1 : 0) - ((keys.has('KeyW') || keys.has('ArrowUp')) ? 1 : 0);
  const magnitude = Math.hypot(inputX, inputZ);
  if (started && magnitude > 0.05) {
    const forwardX = -Math.sin(targetYaw), forwardZ = -Math.cos(targetYaw);
    const rightX = Math.cos(targetYaw), rightZ = -Math.sin(targetYaw);
    const dx = (rightX * inputX + forwardX * -inputZ) / Math.max(1, magnitude);
    const dz = (rightZ * inputX + forwardZ * -inputZ) / Math.max(1, magnitude);
    const nx = player.position.x + dx * dt * 5.1, nz = player.position.z + dz * dt * 5.1;
    // Keep the explorer safely on the central arena for this environment-first prototype.
    if (Math.hypot(nx, nz) < 15.9) { player.position.x = nx; player.position.z = nz; }
    player.rotation.y = Math.atan2(dx, dz);
    player.position.y = 0.77 + Math.abs(Math.sin(now * 10)) * 0.035;
    lastMove = now;
  } else {
    player.position.y += (0.77 - player.position.y) * Math.min(1, dt * 8);
  }
  if (started) {
    const px = Math.round(player.position.x * 2), pz = Math.round(player.position.z * 2);
    coordLabel.textContent = `${String(px + 40).padStart(3, '0')} · ${String(pz + 40).padStart(3, '0')}`;
  }
  updateCamera(dt);
  renderer.render(scene, camera);
}
updateCamera(1);
animate();
setTimeout(() => loading.classList.add('done'), 500);
