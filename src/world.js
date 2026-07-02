// Chunk store: generation queue, meshing queue, block get/set, edit persistence.
import * as THREE from 'three';
import { CHUNK, HEIGHT, blockIndex } from './worldgen.js';
import { AIR } from './blocks.js';
import { buildChunkMeshes } from './mesher.js';

const GEN_RADIUS = 5;   // chunks with block data
const MESH_RADIUS = 4;  // chunks with visible meshes
const GEN_PER_FRAME = 3;
const MESH_PER_FRAME = 2;

const key = (cx, cz) => cx + ',' + cz;

export class World {
  constructor(scene, gen, materials, edits = {}) {
    this.scene = scene;
    this.gen = gen;
    this.materials = materials; // { opaque, water }
    this.chunks = new Map();    // key -> { cx, cz, data, solidMesh, waterMesh, dirty, meshed }
    this.edits = edits;         // "x,y,z" -> block id (persisted)
  }

  getChunk(cx, cz) {
    return this.chunks.get(key(cx, cz));
  }

  ensureData(cx, cz) {
    let c = this.getChunk(cx, cz);
    if (c) return c;
    const data = this.gen.generateChunk(cx, cz);
    c = { cx, cz, data, solidMesh: null, waterMesh: null, dirty: true, meshed: false };
    this.chunks.set(key(cx, cz), c);
    this.applyEdits(c);
    return c;
  }

  applyEdits(c) {
    const x0 = c.cx * CHUNK, z0 = c.cz * CHUNK;
    for (const k in this.edits) {
      const [x, y, z] = k.split(',').map(Number);
      if (x >= x0 && x < x0 + CHUNK && z >= z0 && z < z0 + CHUNK && y >= 0 && y < HEIGHT) {
        c.data[blockIndex(x - x0, y, z - z0)] = this.edits[k];
      }
    }
  }

  getBlock(x, y, z) {
    if (y < 0 || y >= HEIGHT) return AIR;
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
    const c = this.getChunk(cx, cz);
    if (!c) return AIR;
    return c.data[blockIndex(x - cx * CHUNK, y, z - cz * CHUNK)];
  }

  setBlock(x, y, z, id) {
    if (y < 0 || y >= HEIGHT) return;
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
    const c = this.getChunk(cx, cz);
    if (!c) return;
    const lx = x - cx * CHUNK, lz = z - cz * CHUNK;
    c.data[blockIndex(lx, y, lz)] = id;
    this.edits[x + ',' + y + ',' + z] = id;
    this.markDirty(cx, cz);
    // borders: neighbor faces may change
    if (lx === 0) this.markDirty(cx - 1, cz);
    if (lx === CHUNK - 1) this.markDirty(cx + 1, cz);
    if (lz === 0) this.markDirty(cx, cz - 1);
    if (lz === CHUNK - 1) this.markDirty(cx, cz + 1);
  }

  markDirty(cx, cz) {
    const c = this.getChunk(cx, cz);
    if (c) c.dirty = true;
  }

  // Rebuild a chunk's meshes immediately (used for edits, so feedback is instant).
  remesh(c) {
    this.disposeMeshes(c);
    const { solid, water } = buildChunkMeshes(this, c.cx, c.cz);
    c.solidMesh = solid ? this.addMesh(solid, this.materials.opaque) : null;
    c.waterMesh = water ? this.addMesh(water, this.materials.water) : null;
    c.dirty = false;
    c.meshed = true;
  }

  addMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  disposeMeshes(c) {
    for (const m of [c.solidMesh, c.waterMesh]) {
      if (m) {
        this.scene.remove(m);
        m.geometry.dispose();
      }
    }
    c.solidMesh = c.waterMesh = null;
  }

  hasNeighborData(cx, cz) {
    return this.getChunk(cx - 1, cz) && this.getChunk(cx + 1, cz)
      && this.getChunk(cx, cz - 1) && this.getChunk(cx, cz + 1);
  }

  // Called every frame: stream chunks in/out around the player.
  update(px, pz) {
    const pcx = Math.floor(px / CHUNK), pcz = Math.floor(pz / CHUNK);

    // 1. generate missing data, closest first
    let genBudget = GEN_PER_FRAME;
    const wanted = [];
    for (let dx = -GEN_RADIUS; dx <= GEN_RADIUS; dx++) {
      for (let dz = -GEN_RADIUS; dz <= GEN_RADIUS; dz++) {
        if (!this.getChunk(pcx + dx, pcz + dz)) wanted.push([dx * dx + dz * dz, pcx + dx, pcz + dz]);
      }
    }
    wanted.sort((a, b) => a[0] - b[0]);
    for (const [, cx, cz] of wanted) {
      if (genBudget-- <= 0) break;
      this.ensureData(cx, cz);
    }

    // 2. mesh dirty/unmeshed chunks in view radius, closest first
    let meshBudget = MESH_PER_FRAME;
    const toMesh = [];
    for (let dx = -MESH_RADIUS; dx <= MESH_RADIUS; dx++) {
      for (let dz = -MESH_RADIUS; dz <= MESH_RADIUS; dz++) {
        const c = this.getChunk(pcx + dx, pcz + dz);
        if (c && (c.dirty || !c.meshed) && this.hasNeighborData(c.cx, c.cz)) {
          toMesh.push([dx * dx + dz * dz, c]);
        }
      }
    }
    toMesh.sort((a, b) => a[0] - b[0]);
    for (const [, c] of toMesh) {
      if (meshBudget-- <= 0) break;
      this.remesh(c);
    }

    // 3. unload far chunks
    for (const [k, c] of this.chunks) {
      const dx = c.cx - pcx, dz = c.cz - pcz;
      if (Math.max(Math.abs(dx), Math.abs(dz)) > GEN_RADIUS + 2) {
        this.disposeMeshes(c);
        this.chunks.delete(k);
      }
    }
  }

  countMeshedChunks() {
    let n = 0;
    for (const c of this.chunks.values()) if (c.meshed) n++;
    return n;
  }
}
