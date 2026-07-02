// Chunk mesher: culled faces, baked vertex AO, separate water geometry.
import * as THREE from 'three';
import { CHUNK, HEIGHT } from './worldgen.js';
import { AIR, BLOCK, BLOCKS, isOpaque, castsAO } from './blocks.js';

// Face table (three.js voxel layout, CCW winding facing outward).
// uv: [u, v] within the tile. tile: which of [top, side, bottom] to use.
const FACES = [
  { dir: [-1, 0, 0], tile: 1, corners: [ // -X
    { pos: [0, 1, 0], uv: [0, 1] }, { pos: [0, 0, 0], uv: [0, 0] },
    { pos: [0, 1, 1], uv: [1, 1] }, { pos: [0, 0, 1], uv: [1, 0] }] },
  { dir: [1, 0, 0], tile: 1, corners: [ // +X
    { pos: [1, 1, 1], uv: [0, 1] }, { pos: [1, 0, 1], uv: [0, 0] },
    { pos: [1, 1, 0], uv: [1, 1] }, { pos: [1, 0, 0], uv: [1, 0] }] },
  { dir: [0, -1, 0], tile: 2, corners: [ // -Y
    { pos: [1, 0, 1], uv: [1, 0] }, { pos: [0, 0, 1], uv: [0, 0] },
    { pos: [1, 0, 0], uv: [1, 1] }, { pos: [0, 0, 0], uv: [0, 1] }] },
  { dir: [0, 1, 0], tile: 0, corners: [ // +Y
    { pos: [0, 1, 1], uv: [1, 1] }, { pos: [1, 1, 1], uv: [0, 1] },
    { pos: [0, 1, 0], uv: [1, 0] }, { pos: [1, 1, 0], uv: [0, 0] }] },
  { dir: [0, 0, -1], tile: 1, corners: [ // -Z
    { pos: [1, 0, 0], uv: [0, 0] }, { pos: [0, 0, 0], uv: [1, 0] },
    { pos: [1, 1, 0], uv: [0, 1] }, { pos: [0, 1, 0], uv: [1, 1] }] },
  { dir: [0, 0, 1], tile: 1, corners: [ // +Z
    { pos: [0, 0, 1], uv: [0, 0] }, { pos: [1, 0, 1], uv: [1, 0] },
    { pos: [0, 1, 1], uv: [0, 1] }, { pos: [1, 1, 1], uv: [1, 1] }] },
];

// Directional shading baked into vertex colors (minecraft-style)
const FACE_SHADE = [0.78, 0.78, 0.55, 1.0, 0.68, 0.68];
const AO_LEVELS = [0.45, 0.62, 0.82, 1.0];

let atlas = null;
export function setAtlas(a) { atlas = a; }

function faceVisible(id, neighborId) {
  if (neighborId === AIR) return true;
  if (isOpaque(neighborId)) return false;
  return neighborId !== id; // hide water-water, glass-glass, leaves-leaves internal faces
}

// Vertex AO: for a face along `dir`, test the two edge neighbors and the
// corner neighbor in the plane one step out from the face.
function vertexAO(world, bx, by, bz, dir, corner) {
  const nx = bx + dir[0], ny = by + dir[1], nz = bz + dir[2];
  // tangent axes = the two axes not used by dir
  const axes = dir[0] !== 0 ? [1, 2] : dir[1] !== 0 ? [0, 2] : [0, 1];
  const off = [0, 0, 0];
  const s = [0, 0];
  for (let i = 0; i < 2; i++) s[i] = corner.pos[axes[i]] === 1 ? 1 : -1;

  const at = (dx, dy, dz) => castsAO(world.getBlock(nx + dx, ny + dy, nz + dz)) ? 1 : 0;
  off[axes[0]] = s[0];
  const side1 = at(off[0], off[1], off[2]);
  off[axes[0]] = 0; off[axes[1]] = s[1];
  const side2 = at(off[0], off[1], off[2]);
  off[axes[0]] = s[0];
  const cornerOcc = at(off[0], off[1], off[2]);

  return side1 && side2 ? 0 : 3 - (side1 + side2 + cornerOcc);
}

function makeGeometry(arrays) {
  if (arrays.indices.length === 0) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arrays.positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(arrays.normals, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(arrays.colors, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(arrays.uvs, 2));
  g.setIndex(arrays.indices);
  g.computeBoundingSphere();
  return g;
}

export function buildChunkMeshes(world, cx, cz) {
  const solid = { positions: [], normals: [], colors: [], uvs: [], indices: [] };
  const water = { positions: [], normals: [], colors: [], uvs: [], indices: [] };
  const baseX = cx * CHUNK, baseZ = cz * CHUNK;

  for (let y = 0; y < HEIGHT; y++) {
    for (let z = 0; z < CHUNK; z++) {
      for (let x = 0; x < CHUNK; x++) {
        const wx = baseX + x, wz = baseZ + z;
        const id = world.getBlock(wx, y, wz);
        if (id === AIR) continue;
        const isWater = id === BLOCK.WATER;
        const out = isWater ? water : solid;
        const tiles = BLOCKS[id].tiles;

        for (let f = 0; f < 6; f++) {
          const face = FACES[f];
          const nId = world.getBlock(wx + face.dir[0], y + face.dir[1], wz + face.dir[2]);
          if (!faceVisible(id, nId)) continue;

          const uvRect = atlas.tileUV(tiles[face.tile]);
          const shade = FACE_SHADE[f];
          const start = out.positions.length / 3;
          const ao = [0, 0, 0, 0];

          for (let v = 0; v < 4; v++) {
            const c = face.corners[v];
            out.positions.push(wx + c.pos[0], y + c.pos[1], wz + c.pos[2]);
            out.normals.push(face.dir[0], face.dir[1], face.dir[2]);
            out.uvs.push(
              c.uv[0] ? uvRect.u1 : uvRect.u0,
              c.uv[1] ? uvRect.v1 : uvRect.v0,
            );
            ao[v] = isWater ? 3 : vertexAO(world, wx, y, wz, face.dir, c);
            const b = shade * AO_LEVELS[ao[v]];
            out.colors.push(b, b, b);
          }

          // flip the quad diagonal toward the brighter pair to avoid AO anisotropy
          if (ao[0] + ao[3] > ao[1] + ao[2]) {
            out.indices.push(start, start + 1, start + 3, start, start + 3, start + 2);
          } else {
            out.indices.push(start, start + 1, start + 2, start + 2, start + 1, start + 3);
          }
        }
      }
    }
  }

  return { solid: makeGeometry(solid), water: makeGeometry(water) };
}
