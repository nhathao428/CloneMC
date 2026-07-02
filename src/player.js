// First-person player: AABB collision vs voxels, walk/sprint/jump/swim/fly.
import { BLOCK, isSolid } from './blocks.js';

const HALF_W = 0.3;   // half width of player AABB
const PLAYER_H = 1.8;
const EYE = 1.62;
const GRAVITY = -26;
const JUMP_VEL = 8.6;
const WALK_SPEED = 4.3;
const SPRINT_SPEED = 6.2;
const FLY_SPEED = 12;
const SWIM_SPEED = 3;
const EPS = 1e-3;

export class Player {
  constructor(x, y, z) {
    this.pos = { x, y, z }; // feet position
    this.vel = { x: 0, y: 0, z: 0 };
    this.yaw = 0;
    this.pitch = 0;
    this.onGround = false;
    this.fly = false;
    this.inWater = false;
  }

  get eyeY() { return this.pos.y + EYE; }

  look(dx, dy, sensitivity = 0.0022) {
    this.yaw -= dx * sensitivity;
    this.pitch -= dy * sensitivity;
    const lim = Math.PI / 2 - 0.01;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
  }

  lookDir() {
    const cp = Math.cos(this.pitch);
    return {
      x: -Math.sin(this.yaw) * cp,
      y: Math.sin(this.pitch),
      z: -Math.cos(this.yaw) * cp,
    };
  }

  collides(world, px, py, pz) {
    const x0 = Math.floor(px - HALF_W), x1 = Math.floor(px + HALF_W);
    const y0 = Math.floor(py), y1 = Math.floor(py + PLAYER_H);
    const z0 = Math.floor(pz - HALF_W), z1 = Math.floor(pz + HALF_W);
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++)
          if (isSolid(world.getBlock(x, y, z))) return true;
    return false;
  }

  // Would placing a block at cell (bx,by,bz) overlap the player?
  intersectsCell(bx, by, bz) {
    return bx + 1 > this.pos.x - HALF_W && bx < this.pos.x + HALF_W
      && by + 1 > this.pos.y && by < this.pos.y + PLAYER_H
      && bz + 1 > this.pos.z - HALF_W && bz < this.pos.z + HALF_W;
  }

  update(dt, keys, world) {
    const p = this.pos, v = this.vel;
    this.inWater = world.getBlock(Math.floor(p.x), Math.floor(p.y + 0.5), Math.floor(p.z)) === BLOCK.WATER;
    const headInWater = world.getBlock(Math.floor(p.x), Math.floor(this.eyeY), Math.floor(p.z)) === BLOCK.WATER;

    // --- horizontal input in camera space ---
    let ix = 0, iz = 0;
    if (keys.has('KeyW')) iz -= 1;
    if (keys.has('KeyS')) iz += 1;
    if (keys.has('KeyA')) ix -= 1;
    if (keys.has('KeyD')) ix += 1;
    const len = Math.hypot(ix, iz);
    if (len > 0) { ix /= len; iz /= len; }
    // rotate local input (x right, -z forward) into world space by yaw
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    const wx = ix * cos + iz * sin;
    const wz = -ix * sin + iz * cos;

    const speed = this.fly ? FLY_SPEED
      : this.inWater ? SWIM_SPEED
      : keys.has('ControlLeft') || keys.has('ControlRight') ? SPRINT_SPEED
      : WALK_SPEED;
    v.x = wx * speed;
    v.z = wz * speed;

    // --- vertical ---
    if (this.fly) {
      v.y = (keys.has('Space') ? FLY_SPEED : 0) - (keys.has('ShiftLeft') || keys.has('ShiftRight') ? FLY_SPEED : 0);
    } else if (this.inWater) {
      v.y += GRAVITY * 0.25 * dt;
      v.y = Math.max(v.y, -4);
      if (keys.has('Space')) v.y = headInWater ? 4 : 6; // float up / hop out at surface
    } else {
      v.y += GRAVITY * dt;
      v.y = Math.max(v.y, -50);
      if (keys.has('Space') && this.onGround) {
        v.y = JUMP_VEL;
        this.onGround = false;
      }
    }

    // --- integrate with substeps so fast falls can't tunnel through blocks ---
    const maxDisp = Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)) * dt;
    const steps = Math.max(1, Math.ceil(maxDisp / 0.4));
    const sdt = dt / steps;
    for (let i = 0; i < steps; i++) this.moveStep(sdt, world);

    return headInWater;
  }

  moveStep(dt, world) {
    const p = this.pos, v = this.vel;

    // X axis
    let nx = p.x + v.x * dt;
    if (this.collides(world, nx, p.y, p.z)) {
      nx = v.x > 0
        ? Math.floor(nx + HALF_W) - HALF_W - EPS
        : Math.floor(nx - HALF_W) + 1 + HALF_W + EPS;
      if (this.collides(world, nx, p.y, p.z)) nx = p.x;
      v.x = 0;
    }
    p.x = nx;

    // Z axis
    let nz = p.z + v.z * dt;
    if (this.collides(world, p.x, p.y, nz)) {
      nz = v.z > 0
        ? Math.floor(nz + HALF_W) - HALF_W - EPS
        : Math.floor(nz - HALF_W) + 1 + HALF_W + EPS;
      if (this.collides(world, p.x, p.y, nz)) nz = p.z;
      v.z = 0;
    }
    p.z = nz;

    // Y axis
    let ny = p.y + v.y * dt;
    if (this.collides(world, p.x, ny, p.z)) {
      if (v.y < 0) {
        ny = Math.floor(ny) + 1 + EPS;
        this.onGround = true;
      } else {
        ny = Math.floor(ny + PLAYER_H) - PLAYER_H - EPS;
      }
      if (this.collides(world, p.x, ny, p.z)) ny = p.y;
      v.y = 0;
    } else if (v.y < -0.1) {
      this.onGround = false;
    }
    p.y = ny;
  }
}
