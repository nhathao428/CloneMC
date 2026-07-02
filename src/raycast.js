// Voxel raycast (Amanatides & Woo DDA). Returns the first non-air, non-water
// block hit plus the empty cell just before it (for placement).
import { AIR, BLOCK } from './blocks.js';

export function raycastVoxel(world, origin, dir, maxDist) {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const stepX = dir.x > 0 ? 1 : -1;
  const stepY = dir.y > 0 ? 1 : -1;
  const stepZ = dir.z > 0 ? 1 : -1;

  const tDeltaX = dir.x !== 0 ? Math.abs(1 / dir.x) : Infinity;
  const tDeltaY = dir.y !== 0 ? Math.abs(1 / dir.y) : Infinity;
  const tDeltaZ = dir.z !== 0 ? Math.abs(1 / dir.z) : Infinity;

  const frac = (v) => v - Math.floor(v);
  let tMaxX = dir.x !== 0 ? (dir.x > 0 ? 1 - frac(origin.x) : frac(origin.x)) * tDeltaX : Infinity;
  let tMaxY = dir.y !== 0 ? (dir.y > 0 ? 1 - frac(origin.y) : frac(origin.y)) * tDeltaY : Infinity;
  let tMaxZ = dir.z !== 0 ? (dir.z > 0 ? 1 - frac(origin.z) : frac(origin.z)) * tDeltaZ : Infinity;

  let px = x, py = y, pz = z;
  let t = 0;

  while (t <= maxDist) {
    const id = world.getBlock(x, y, z);
    if (id !== AIR && id !== BLOCK.WATER) {
      return { id, block: [x, y, z], prev: [px, py, pz] };
    }
    px = x; py = y; pz = z;
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      t = tMaxX; tMaxX += tDeltaX; x += stepX;
    } else if (tMaxY < tMaxZ) {
      t = tMaxY; tMaxY += tDeltaY; y += stepY;
    } else {
      t = tMaxZ; tMaxZ += tDeltaZ; z += stepZ;
    }
  }
  return null;
}
