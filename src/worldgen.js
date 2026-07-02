// Procedural terrain: rolling hills + mountains, sea, beaches, caves, trees.
import { makeNoise } from './noise.js';
import { BLOCK, AIR } from './blocks.js';

export const CHUNK = 16;
export const HEIGHT = 64;
export const SEA_LEVEL = 22;

export const blockIndex = (x, y, z) => x + (z << 4) + (y << 8);

export class WorldGen {
  constructor(seed) {
    this.seed = seed;
    this.noise = makeNoise(seed);
  }

  heightAt(x, z) {
    const n = this.noise;
    const hills = n.fbm2(x * 0.012, z * 0.012, 4);
    const mountains = Math.max(0, n.fbm2(x * 0.004 + 100, z * 0.004 - 100, 3));
    const h = Math.round(24 + hills * 10 + mountains * 26);
    return Math.max(2, Math.min(HEIGHT - 8, h));
  }

  treeAt(x, z) {
    const h = this.heightAt(x, z);
    if (h <= SEA_LEVEL + 1) return 0;
    const t = this.noise.hash2(x, z);
    if (t >= 0.018) return 0;
    // a tree grows only where its hash is the local minimum → min 1 block spacing
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if ((dx || dz) && this.noise.hash2(x + dx, z + dz) <= t) return 0;
      }
    }
    return 4 + Math.floor(this.noise.hash2(x + 999, z - 999) * 3); // trunk height 4-6
  }

  isCave(x, y, z, h) {
    if (y < 4 || y > h - 4 || h <= SEA_LEVEL + 1) return false;
    return this.noise.noise3(x * 0.09, y * 0.11, z * 0.09) > 0.58;
  }

  generateChunk(cx, cz) {
    const data = new Uint8Array(CHUNK * CHUNK * HEIGHT);
    const baseX = cx * CHUNK, baseZ = cz * CHUNK;

    for (let x = 0; x < CHUNK; x++) {
      for (let z = 0; z < CHUNK; z++) {
        const wx = baseX + x, wz = baseZ + z;
        const h = this.heightAt(wx, wz);
        const beach = h >= SEA_LEVEL - 1 && h <= SEA_LEVEL + 2;

        for (let y = 0; y <= h; y++) {
          let id;
          if (y === 0) id = BLOCK.BEDROCK;
          else if (y === h) id = beach ? BLOCK.SAND : (h < SEA_LEVEL ? BLOCK.DIRT : BLOCK.GRASS);
          else if (y >= h - 3) id = beach ? BLOCK.SAND : BLOCK.DIRT;
          else id = BLOCK.STONE;
          if (id !== BLOCK.BEDROCK && this.isCave(wx, y, wz, h)) id = AIR;
          data[blockIndex(x, y, z)] = id;
        }
        for (let y = h + 1; y <= SEA_LEVEL; y++) {
          data[blockIndex(x, y, z)] = BLOCK.WATER;
        }
      }
    }

    this.plantTrees(data, baseX, baseZ);
    return data;
  }

  // Trees may straddle chunk borders, so scan a margin around this chunk
  // and write only the parts that land inside it.
  plantTrees(data, baseX, baseZ) {
    const setIfAir = (wx, y, wz, id) => {
      const x = wx - baseX, z = wz - baseZ;
      if (x < 0 || x >= CHUNK || z < 0 || z >= CHUNK || y < 1 || y >= HEIGHT) return;
      const i = blockIndex(x, y, z);
      if (data[i] === AIR || (id === BLOCK.LOG && data[i] === BLOCK.LEAVES)) data[i] = id;
    };

    for (let wx = baseX - 2; wx < baseX + CHUNK + 2; wx++) {
      for (let wz = baseZ - 2; wz < baseZ + CHUNK + 2; wz++) {
        const trunk = this.treeAt(wx, wz);
        if (!trunk) continue;
        const h = this.heightAt(wx, wz);
        const top = h + trunk;

        for (let dy = top - 1; dy <= top + 1; dy++) {
          const r = dy === top + 1 ? 1 : 2;
          for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
              if (dx === 0 && dz === 0 && dy <= top) continue;
              // trim corners for a rounder canopy
              if (Math.abs(dx) === r && Math.abs(dz) === r && this.noise.hash3(wx + dx, dy, wz + dz) < 0.6) continue;
              setIfAir(wx + dx, dy, wz + dz, BLOCK.LEAVES);
            }
          }
        }
        for (let y = h + 1; y <= top; y++) setIfAir(wx, y, wz, BLOCK.LOG);
      }
    }
  }
}
