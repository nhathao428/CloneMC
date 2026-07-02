// CloneMC entry point: three.js setup, game loop, input, save/load.
import * as THREE from 'three';
import { createAtlas, AIR, BLOCK } from './blocks.js';
import { WorldGen, CHUNK, SEA_LEVEL } from './worldgen.js';
import { World } from './world.js';
import { setAtlas } from './mesher.js';
import { Player } from './player.js';
import { raycastVoxel } from './raycast.js';
import { Sky } from './sky.js';
import { UI } from './ui.js';
import { Sfx } from './audio.js';
import { Hand } from './hand.js';

const SAVE_KEY = 'clonemc-save-v1';
const VIEW_DIST = 4 * CHUNK;
const REACH = 6;

// ---------- save / load ----------
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      seed,
      edits: world.edits,
      player: { x: player.pos.x, y: player.pos.y, z: player.pos.z, yaw: player.yaw, pitch: player.pitch },
    }));
  } catch { /* storage full — keep playing without saving */ }
}

const save = loadSave();
let seed = save?.seed ?? ((Math.random() * 2 ** 31) | 0);

// ---------- three.js ----------
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.08, VIEW_DIST * 1.6);

const atlas = createAtlas();
setAtlas(atlas);

const materials = {
  opaque: new THREE.MeshLambertMaterial({
    map: atlas.texture, vertexColors: true, alphaTest: 0.5, side: THREE.FrontSide,
  }),
  water: new THREE.MeshLambertMaterial({
    map: atlas.texture, vertexColors: true, transparent: true, opacity: 0.72, side: THREE.DoubleSide,
  }),
};

const gen = new WorldGen(seed);
const world = new World(scene, gen, materials, save?.edits ?? {});
const sky = new Sky(scene, VIEW_DIST);
const ui = new UI(atlas, scene);
const sfx = new Sfx();
const hand = new Hand(atlas, window.innerWidth / window.innerHeight);

// ---------- player ----------
function spawnPlayer() {
  const h = Math.max(gen.heightAt(8, 8), SEA_LEVEL);
  return new Player(8.5, h + 1.01, 8.5);
}

let player = spawnPlayer();
if (save?.player) {
  const p = save.player;
  player.pos = { x: p.x, y: p.y, z: p.z };
  player.yaw = p.yaw;
  player.pitch = p.pitch;
}

// pre-generate around spawn so the player doesn't fall through the void
for (let i = 0; i < 400; i++) world.update(player.pos.x, player.pos.z);

// ---------- input ----------
const keys = new Set();
const overlay = document.getElementById('overlay');
let locked = false;

document.getElementById('play').addEventListener('click', () => {
  sfx.ensure();
  renderer.domElement.requestPointerLock();
});

document.getElementById('new-world').addEventListener('click', () => {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === renderer.domElement;
  overlay.style.display = locked ? 'none' : 'flex';
  if (!locked) { keys.clear(); persist(); }
});

document.addEventListener('mousemove', (e) => {
  if (locked) player.look(e.movementX, e.movementY);
});

document.addEventListener('keydown', (e) => {
  if (!locked) return;
  keys.add(e.code);
  if (e.code === 'KeyF') player.fly = !player.fly;
  if (e.code === 'KeyR') { player = spawnPlayer(); }
  if (e.code.startsWith('Digit')) {
    const n = Number(e.code.slice(5));
    if (n >= 1 && n <= 9) ui.select(n - 1);
  }
});
document.addEventListener('keyup', (e) => keys.delete(e.code));

document.addEventListener('wheel', (e) => { if (locked) ui.scroll(e.deltaY); });
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('mousedown', (e) => {
  if (!locked) return;
  hand.swing();
  const hit = raycastVoxel(world, { x: player.pos.x, y: player.eyeY, z: player.pos.z }, player.lookDir(), REACH);
  if (!hit) return;

  if (e.button === 0) { // break
    if (hit.id === BLOCK.BEDROCK) return;
    world.setBlock(hit.block[0], hit.block[1], hit.block[2], AIR);
    remeshNow(hit.block);
    sfx.break();
  } else if (e.button === 2) { // place
    const [px, py, pz] = hit.prev;
    const target = world.getBlock(px, py, pz);
    if ((target === AIR || target === BLOCK.WATER) && !player.intersectsCell(px, py, pz)) {
      world.setBlock(px, py, pz, ui.currentBlock);
      remeshNow(hit.prev);
      sfx.place();
    }
  } else if (e.button === 1) { // pick block
    ui.pick(hit.id);
  }
});

// instant remesh of the edited chunk (+ dirty neighbors) for responsive feedback
function remeshNow([x, , z]) {
  const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const c = world.getChunk(cx + dx, cz + dz);
      if (c && c.dirty && c.meshed) world.remesh(c);
    }
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  hand.onResize(camera.aspect);
  renderer.setSize(window.innerWidth, window.innerHeight);
});
window.addEventListener('beforeunload', persist);
setInterval(persist, 10000);
document.getElementById('seed-label').textContent = 'Seed: ' + seed;

// debug/testing hook
window.__game = {
  get player() { return player; },
  world, ui, sky,
  teleport(x, y, z, yaw = 0, pitch = 0) {
    player.pos = { x, y, z };
    player.yaw = yaw;
    player.pitch = pitch;
    player.vel = { x: 0, y: 0, z: 0 };
  },
};

// ---------- game loop ----------
const clock = new THREE.Clock();
let fps = 0, fpsFrames = 0, fpsTime = 0;

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);

  const headInWater = locked ? player.update(dt, keys, world) : false;
  world.update(player.pos.x, player.pos.z);
  sky.update(dt, player.pos);

  camera.position.set(player.pos.x, player.eyeY, player.pos.z);
  const d = player.lookDir();
  camera.lookAt(player.pos.x + d.x, player.eyeY + d.y, player.pos.z + d.z);

  const hit = locked
    ? raycastVoxel(world, { x: player.pos.x, y: player.eyeY, z: player.pos.z }, d, REACH)
    : null;
  ui.setHighlight(hit);
  ui.setUnderwater(headInWater);

  fpsFrames++;
  fpsTime += dt;
  if (fpsTime >= 0.5) {
    fps = Math.round(fpsFrames / fpsTime);
    fpsFrames = 0;
    fpsTime = 0;
  }
  ui.setDebug(
    `${fps} fps | xyz ${player.pos.x.toFixed(1)} ${player.pos.y.toFixed(1)} ${player.pos.z.toFixed(1)}`
    + ` | chunks ${world.countMeshedChunks()}${player.fly ? ' | FLY' : ''}`,
  );

  hand.setBlock(ui.currentBlock);
  const moving = locked && ['KeyW', 'KeyA', 'KeyS', 'KeyD'].some((k) => keys.has(k));
  hand.update(dt, moving);

  renderer.clear();
  renderer.render(scene, camera);
  hand.render(renderer);
}

renderer.autoClear = false;
frame();
