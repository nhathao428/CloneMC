// Seeded value noise (2D/3D) + fBm. No deps, fully deterministic per seed.

function mix32(n) {
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return (n ^ (n >>> 16)) >>> 0;
}

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export function makeNoise(seed) {
  const s = seed | 0;

  function hash2(x, z) {
    const n = (Math.imul(x, 374761393) + Math.imul(z, 668265263)) ^ s;
    return mix32(n) / 4294967296;
  }

  function hash3(x, y, z) {
    const n = (Math.imul(x, 374761393) + Math.imul(y, 1274126177) + Math.imul(z, 668265263)) ^ s;
    return mix32(n) / 4294967296;
  }

  function noise2(x, z) {
    const xi = Math.floor(x), zi = Math.floor(z);
    const xf = smooth(x - xi), zf = smooth(z - zi);
    const a = hash2(xi, zi), b = hash2(xi + 1, zi);
    const c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
    return lerp(lerp(a, b, xf), lerp(c, d, xf), zf) * 2 - 1;
  }

  function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
    const c000 = hash3(xi, yi, zi), c100 = hash3(xi + 1, yi, zi);
    const c010 = hash3(xi, yi + 1, zi), c110 = hash3(xi + 1, yi + 1, zi);
    const c001 = hash3(xi, yi, zi + 1), c101 = hash3(xi + 1, yi, zi + 1);
    const c011 = hash3(xi, yi + 1, zi + 1), c111 = hash3(xi + 1, yi + 1, zi + 1);
    const x00 = lerp(c000, c100, xf), x10 = lerp(c010, c110, xf);
    const x01 = lerp(c001, c101, xf), x11 = lerp(c011, c111, xf);
    return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf) * 2 - 1;
  }

  function fbm2(x, z, octaves = 4, lacunarity = 2, gain = 0.5) {
    let sum = 0, amp = 1, freq = 1, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += noise2(x * freq, z * freq) * amp;
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return sum / norm;
  }

  return { hash2, hash3, noise2, noise3, fbm2 };
}
