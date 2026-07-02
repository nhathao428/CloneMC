// First-person held block: rendered in a separate overlay scene so it never
// clips into terrain. Bobs while walking, swings on click.
import * as THREE from 'three';
import { BLOCKS } from './blocks.js';

const BASE_POS = new THREE.Vector3(0.92, -0.88, -1.7);
const BASE_ROT = new THREE.Euler(0.14, 0.72, 0.05);
const SWING_TIME = 0.22;
// default BoxGeometry uv corners per face, in vertex order
const FACE_UV = [[0, 1], [1, 1], [0, 0], [1, 0]];

export class Hand {
  constructor(atlas, aspect) {
    this.atlas = atlas;
    this.blockId = 0;
    this.t = 0;
    this.swingT = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 10);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(-1, 2, 1);
    this.scene.add(dir);

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.62, 0.62),
      new THREE.MeshLambertMaterial({ map: atlas.texture, alphaTest: 0.5 }),
    );
    this.scene.add(this.mesh);
  }

  setBlock(id) {
    if (id === this.blockId) return;
    this.blockId = id;
    const tiles = BLOCKS[id].tiles; // [top, side, bottom]
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    const faceTiles = [tiles[1], tiles[1], tiles[0], tiles[2], tiles[1], tiles[1]];
    const uv = this.mesh.geometry.attributes.uv;
    for (let f = 0; f < 6; f++) {
      const r = this.atlas.tileUV(faceTiles[f]);
      for (let v = 0; v < 4; v++) {
        uv.setXY(
          f * 4 + v,
          FACE_UV[v][0] ? r.u1 : r.u0,
          FACE_UV[v][1] ? r.v1 : r.v0,
        );
      }
    }
    uv.needsUpdate = true;
  }

  swing() {
    this.swingT = 1;
  }

  onResize(aspect) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  update(dt, moving) {
    this.t += dt * (moving ? 9 : 2.2);
    if (this.swingT > 0) this.swingT = Math.max(0, this.swingT - dt / SWING_TIME);

    const bobAmp = moving ? 0.035 : 0.008;
    const bobY = Math.sin(this.t) * bobAmp;
    const bobX = Math.cos(this.t * 0.5) * bobAmp * 0.7;
    const arc = this.swingT > 0 ? Math.sin((1 - this.swingT) * Math.PI) : 0;

    this.mesh.position.set(
      BASE_POS.x + bobX,
      BASE_POS.y + bobY - arc * 0.3,
      BASE_POS.z - arc * 0.28,
    );
    this.mesh.rotation.set(
      BASE_ROT.x - arc * 0.95,
      BASE_ROT.y + arc * 0.25,
      BASE_ROT.z,
    );
  }

  render(renderer) {
    renderer.clearDepth();
    renderer.render(this.scene, this.camera);
  }
}
