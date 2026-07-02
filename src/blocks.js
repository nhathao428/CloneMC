// Block registry + procedurally drawn 16x16 pixel texture atlas (no image assets).
import * as THREE from 'three';

export const AIR = 0;
export const BLOCK = {
  GRASS: 1, DIRT: 2, STONE: 3, SAND: 4, WATER: 5, LOG: 6,
  LEAVES: 7, PLANKS: 8, COBBLE: 9, GLASS: 10, BEDROCK: 11, BRICK: 12,
};

// tiles: [top, side, bottom] atlas tile indices
export const BLOCKS = {
  [BLOCK.GRASS]:   { name: 'Grass',   tiles: [0, 1, 2],    solid: true,  opaque: true },
  [BLOCK.DIRT]:    { name: 'Dirt',    tiles: [2, 2, 2],    solid: true,  opaque: true },
  [BLOCK.STONE]:   { name: 'Stone',   tiles: [3, 3, 3],    solid: true,  opaque: true },
  [BLOCK.SAND]:    { name: 'Sand',    tiles: [4, 4, 4],    solid: true,  opaque: true },
  [BLOCK.WATER]:   { name: 'Water',   tiles: [5, 5, 5],    solid: false, opaque: false, liquid: true },
  [BLOCK.LOG]:     { name: 'Log',     tiles: [7, 6, 7],    solid: true,  opaque: true },
  [BLOCK.LEAVES]:  { name: 'Leaves',  tiles: [8, 8, 8],    solid: true,  opaque: false },
  [BLOCK.PLANKS]:  { name: 'Planks',  tiles: [9, 9, 9],    solid: true,  opaque: true },
  [BLOCK.COBBLE]:  { name: 'Cobble',  tiles: [10, 10, 10], solid: true,  opaque: true },
  [BLOCK.GLASS]:   { name: 'Glass',   tiles: [11, 11, 11], solid: true,  opaque: false },
  [BLOCK.BEDROCK]: { name: 'Bedrock', tiles: [12, 12, 12], solid: true,  opaque: true },
  [BLOCK.BRICK]:   { name: 'Brick',   tiles: [13, 13, 13], solid: true,  opaque: true },
};

export const isSolid = (id) => id !== AIR && BLOCKS[id].solid;
export const isOpaque = (id) => id !== AIR && BLOCKS[id].opaque;
// Occluders for ambient occlusion (leaves cast AO too)
export const castsAO = (id) => id !== AIR && (BLOCKS[id].opaque || id === BLOCK.LEAVES);

const TILE = 16;
const ATLAS_COLS = 16;
const ATLAS_SIZE = TILE * ATLAS_COLS;

// Small deterministic RNG so textures look identical every run
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function drawTile(ctx, index, painter) {
  const ox = (index % ATLAS_COLS) * TILE;
  const oy = Math.floor(index / ATLAS_COLS) * TILE;
  const rng = makeRng(index * 7919 + 17);
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(ox + x, oy + y, 1, 1); };
  const clear = (x, y) => ctx.clearRect(ox + x, oy + y, 1, 1);
  const fill = (c) => { ctx.fillStyle = c; ctx.fillRect(ox, oy, TILE, TILE); };
  const speckle = (colors, n) => {
    for (let i = 0; i < n; i++) {
      px((rng() * TILE) | 0, (rng() * TILE) | 0, colors[(rng() * colors.length) | 0]);
    }
  };
  painter({ px, clear, fill, speckle, rng });
}

function paintAtlas(ctx) {
  // 0 grass top
  drawTile(ctx, 0, (t) => { t.fill('#6faa3f'); t.speckle(['#5f9a35', '#7fba4f', '#67a239'], 90); });
  // 1 grass side
  drawTile(ctx, 1, (t) => {
    t.fill('#8a6244'); t.speckle(['#7a5438', '#96704e', '#6f4c32'], 70);
    for (let x = 0; x < TILE; x++) {
      const d = 3 + ((t.rng() * 2) | 0);
      for (let y = 0; y < d; y++) t.px(x, y, y < d - 1 ? '#6faa3f' : '#5f9a35');
    }
  });
  // 2 dirt
  drawTile(ctx, 2, (t) => { t.fill('#8a6244'); t.speckle(['#7a5438', '#96704e', '#6f4c32'], 90); });
  // 3 stone
  drawTile(ctx, 3, (t) => { t.fill('#8d8d8d'); t.speckle(['#7d7d7d', '#9d9d9d', '#858585'], 90); });
  // 4 sand
  drawTile(ctx, 4, (t) => { t.fill('#dbd29e'); t.speckle(['#cfc48c', '#e5ddb0', '#d5ca94'], 90); });
  // 5 water
  drawTile(ctx, 5, (t) => { t.fill('#3d6fd1'); t.speckle(['#3866c4', '#4a7cdb', '#4272d4'], 60); });
  // 6 log side
  drawTile(ctx, 6, (t) => {
    t.fill('#6b4a2b');
    for (let x = 0; x < TILE; x++) {
      if (x % 4 === 0 || x % 7 === 0) for (let y = 0; y < TILE; y++) if (t.rng() > 0.2) t.px(x, y, '#59391f');
    }
    t.speckle(['#7a5836', '#59391f'], 30);
  });
  // 7 log top
  drawTile(ctx, 7, (t) => {
    t.fill('#b08a4f');
    for (let r = 2; r <= 7; r += 2) {
      for (let a = 0; a < 40; a++) {
        const th = (a / 40) * Math.PI * 2;
        t.px(8 + Math.round(Math.cos(th) * r * 0.9) - 1, 8 + Math.round(Math.sin(th) * r * 0.7) - 1, '#8a683a');
      }
    }
    for (let i = 0; i < TILE; i++) { t.px(i, 0, '#6b4a2b'); t.px(i, 15, '#6b4a2b'); t.px(0, i, '#6b4a2b'); t.px(15, i, '#6b4a2b'); }
  });
  // 8 leaves (with transparent holes)
  drawTile(ctx, 8, (t) => {
    t.fill('#3e7a25'); t.speckle(['#356b1e', '#488a2d', '#2f6119'], 110);
    for (let i = 0; i < 34; i++) t.clear((t.rng() * TILE) | 0, (t.rng() * TILE) | 0);
  });
  // 9 planks
  drawTile(ctx, 9, (t) => {
    t.fill('#b08a4f'); t.speckle(['#a5804a', '#ba9458'], 60);
    for (let y = 3; y < TILE; y += 4) for (let x = 0; x < TILE; x++) t.px(x, y, '#8a683a');
    t.px(3, 0, '#8a683a'); t.px(3, 1, '#8a683a'); t.px(3, 2, '#8a683a');
    t.px(11, 4, '#8a683a'); t.px(11, 5, '#8a683a'); t.px(11, 6, '#8a683a');
    t.px(6, 8, '#8a683a'); t.px(6, 9, '#8a683a'); t.px(6, 10, '#8a683a');
    t.px(13, 12, '#8a683a'); t.px(13, 13, '#8a683a'); t.px(13, 14, '#8a683a');
  });
  // 10 cobble
  drawTile(ctx, 10, (t) => {
    t.fill('#6e6e6e');
    for (let i = 0; i < 9; i++) {
      const cx = (t.rng() * TILE) | 0, cy = (t.rng() * TILE) | 0, r = 2 + ((t.rng() * 3) | 0);
      const shade = ['#828282', '#8f8f8f', '#787878'][(t.rng() * 3) | 0];
      for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
        if (dx * dx + dy * dy <= r * r) {
          const x = cx + dx, y = cy + dy;
          if (x >= 0 && x < TILE && y >= 0 && y < TILE) t.px(x, y, shade);
        }
      }
    }
    t.speckle(['#5e5e5e', '#999999'], 40);
  });
  // 11 glass (mostly transparent + frame)
  drawTile(ctx, 11, (t) => {
    for (let i = 0; i < TILE; i++) { t.px(i, 0, '#cfeaf2'); t.px(i, 15, '#cfeaf2'); t.px(0, i, '#cfeaf2'); t.px(15, i, '#cfeaf2'); }
    t.px(3, 2, '#eaf7fb'); t.px(2, 3, '#eaf7fb'); t.px(4, 2, '#eaf7fb');
    t.px(12, 11, '#eaf7fb'); t.px(11, 12, '#eaf7fb'); t.px(13, 10, '#eaf7fb');
  });
  // 12 bedrock
  drawTile(ctx, 12, (t) => { t.fill('#3a3a3a'); t.speckle(['#222222', '#555555', '#484848'], 130); });
  // 13 brick
  drawTile(ctx, 13, (t) => {
    t.fill('#9c5040');
    for (let y = 0; y < TILE; y += 4) for (let x = 0; x < TILE; x++) t.px(x, y, '#b8b0a4');
    for (let row = 0; row < 4; row++) {
      const off = row % 2 === 0 ? 4 : 0;
      for (let x = off; x < TILE; x += 8) for (let y = row * 4 + 1; y < row * 4 + 4; y++) t.px(x, y, '#b8b0a4');
    }
    t.speckle(['#8c4638', '#a85a48'], 40);
  });
}

export function createAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext('2d');
  paintAtlas(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  // uv rect for a tile, slightly inset to avoid bleeding
  const inset = 0.02;
  function tileUV(index) {
    const col = index % ATLAS_COLS, row = Math.floor(index / ATLAS_COLS);
    return {
      u0: (col + inset) / ATLAS_COLS,
      u1: (col + 1 - inset) / ATLAS_COLS,
      v0: 1 - (row + 1 - inset) / ATLAS_COLS,
      v1: 1 - (row + inset) / ATLAS_COLS,
    };
  }

  return { canvas, texture, tileUV, TILE, ATLAS_COLS };
}
