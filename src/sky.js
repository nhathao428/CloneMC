// Day/night cycle: sky + fog color, orbiting sun light, ambient dimming.
import * as THREE from 'three';

const DAY_LENGTH = 300; // seconds per full cycle
const DAY_SKY = new THREE.Color(0x87ceeb);
const NIGHT_SKY = new THREE.Color(0x0b1026);
const DUSK_SKY = new THREE.Color(0xe8926b);

export class Sky {
  constructor(scene, viewDist) {
    this.scene = scene;
    this.time = DAY_LENGTH * 0.25; // start mid-morning

    this.sun = new THREE.DirectionalLight(0xfff4e0, 1.6);
    this.ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(this.sun, this.ambient);

    this.skyColor = new THREE.Color();
    scene.background = this.skyColor;
    scene.fog = new THREE.Fog(this.skyColor, viewDist * 0.45, viewDist * 0.95);
  }

  update(dt, playerPos) {
    this.time = (this.time + dt) % DAY_LENGTH;
    const angle = (this.time / DAY_LENGTH) * Math.PI * 2; // 0 = sunrise
    const elevation = Math.sin(angle); // >0 day, <0 night

    // sun orbits around the player so shadows/lighting stay consistent
    this.sun.position.set(
      playerPos.x + Math.cos(angle) * 100,
      playerPos.y + elevation * 100,
      playerPos.z + 40,
    );
    this.sun.target.position.set(playerPos.x, playerPos.y, playerPos.z);
    this.sun.target.updateMatrixWorld();

    const day = THREE.MathUtils.clamp(elevation * 3, 0, 1);       // 1 = full day
    const dusk = THREE.MathUtils.clamp(1 - Math.abs(elevation) * 5, 0, 1); // 1 = horizon

    this.skyColor.copy(NIGHT_SKY).lerp(DAY_SKY, day);
    this.skyColor.lerp(DUSK_SKY, dusk * 0.55);
    this.scene.fog.color.copy(this.skyColor);

    this.sun.intensity = 0.2 + day * 1.5;
    this.ambient.intensity = 0.35 + day * 0.85;
  }
}
