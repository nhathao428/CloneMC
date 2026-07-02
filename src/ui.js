// Hotbar, block highlight box, underwater tint, debug HUD.
import * as THREE from 'three';
import { BLOCK, BLOCKS } from './blocks.js';

export const HOTBAR = [
  BLOCK.GRASS, BLOCK.DIRT, BLOCK.STONE, BLOCK.SAND, BLOCK.LOG,
  BLOCK.LEAVES, BLOCK.PLANKS, BLOCK.GLASS, BLOCK.BRICK,
];

export class UI {
  constructor(atlas, scene) {
    this.atlas = atlas;
    this.slots = [...HOTBAR];
    this.selected = 0;
    this.buildHotbar();

    // wireframe box around the targeted block
    const geo = new THREE.BoxGeometry(1.002, 1.002, 1.002);
    const edges = new THREE.EdgesGeometry(geo);
    this.highlight = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.7 }),
    );
    this.highlight.visible = false;
    scene.add(this.highlight);

    this.waterOverlay = document.getElementById('water-overlay');
    this.debugEl = document.getElementById('debug');
  }

  get currentBlock() { return this.slots[this.selected]; }

  buildHotbar() {
    const bar = document.getElementById('hotbar');
    bar.innerHTML = '';
    this.slotEls = this.slots.map((id, i) => {
      const slot = document.createElement('div');
      slot.className = 'slot' + (i === this.selected ? ' active' : '');
      slot.appendChild(this.blockIcon(id));
      const num = document.createElement('span');
      num.className = 'num';
      num.textContent = String(i + 1);
      slot.appendChild(num);
      bar.appendChild(slot);
      return slot;
    });
    this.updateLabel();
  }

  blockIcon(id) {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const tile = BLOCKS[id].tiles[1]; // side texture
    const col = tile % this.atlas.ATLAS_COLS, row = Math.floor(tile / this.atlas.ATLAS_COLS);
    ctx.drawImage(this.atlas.canvas, col * 16, row * 16, 16, 16, 0, 0, 32, 32);
    return c;
  }

  select(i) {
    if (i < 0 || i >= this.slots.length) return;
    this.slotEls[this.selected].classList.remove('active');
    this.selected = i;
    this.slotEls[this.selected].classList.add('active');
    this.updateLabel();
  }

  scroll(delta) {
    const n = this.slots.length;
    this.select(((this.selected + (delta > 0 ? 1 : -1)) % n + n) % n);
  }

  // middle-click pick: put the looked-at block into the current slot
  pick(id) {
    if (!BLOCKS[id] || id === BLOCK.BEDROCK) return;
    this.slots[this.selected] = id;
    const slot = this.slotEls[this.selected];
    slot.replaceChild(this.blockIcon(id), slot.firstChild);
    this.updateLabel();
  }

  updateLabel() {
    document.getElementById('block-label').textContent = BLOCKS[this.currentBlock].name;
  }

  setHighlight(hit) {
    if (hit) {
      this.highlight.position.set(hit.block[0] + 0.5, hit.block[1] + 0.5, hit.block[2] + 0.5);
      this.highlight.visible = true;
    } else {
      this.highlight.visible = false;
    }
  }

  setUnderwater(under) {
    this.waterOverlay.style.display = under ? 'block' : 'none';
  }

  setDebug(text) {
    this.debugEl.textContent = text;
  }
}
