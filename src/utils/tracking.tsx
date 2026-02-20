export const getSoftColor = (text: string) => {
  if (!text)
    return {
      dot: "#d4d4d8",
      backgroundColor: "#f4f4f5",
      color: "#a1a1aa",
      borderColor: "#e4e4e7",
    };

  // ── 3 hashes completamente independientes ──────────────────────
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57, h3 = 0x12345678;

  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    // Cada hash mezcla valor + posición con multiplicadores distintos
    h1 = Math.imul(h1 ^ (c * (i + 1)), 0x9e3779b9);
    h2 = Math.imul(h2 ^ (c * (i + 7)), 0x85ebca6b);
    h3 = Math.imul(h3 ^ (c << (i % 8)), 0xc2b2ae35);
    // Avalanche cruzado entre los 3
    h1 ^= h2 >>> 13;
    h2 ^= h3 >>> 17;
    h3 ^= h1 >>> 5;
  }

  // Finalizer — elimina cualquier patrón residual
  h1 ^= h1 >>> 16; h1 = Math.imul(h1, 0x85ebca6b);
  h2 ^= h2 >>> 13; h2 = Math.imul(h2, 0xc2b2ae35);
  h3 ^= h3 >>> 16; h3 = Math.imul(h3, 0x9e3779b9);

  const a = Math.abs(h1) >>> 0; // controla HUE
  const b = Math.abs(h2) >>> 0; // controla SATURACIÓN

  // ── Hue: 0–359 ─────────────────────────────────────────────────
  const hue = a % 360;

  // ── Saturación en 3 bandas bien separadas ──────────────────────
  // Banda 0: 35–49%  (apagado)
  // Banda 1: 55–69%  (medio)
  // Banda 2: 72–84%  (vivo)
  // → Strings con hue cercano caerán en bandas distintas
  const band = b % 3;
  const saturation =
    band === 0 ? 35 + (b % 15)
  : band === 1 ? 55 + (b % 15)
  :              72 + (b % 13);

  return {
    dot:             `hsl(${hue}, ${saturation}%, 42%)`,
    backgroundColor: `hsl(${hue}, ${saturation}%, 96%)`,
    color:           `hsl(${hue}, ${saturation}%, 20%)`,
    borderColor:     `hsl(${hue}, ${saturation}%, 82%)`,
  };
};