import { HSLColor } from '../types/colors';

export function generateRandomHSLColor(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 40) + 60, // 60-100% saturation
    l: Math.floor(Math.random() * 20) + 40, // 40-60% lightness
  };
}

export function generateRandomWhite(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 10), // Very low saturation
    l: Math.floor(Math.random() * 2) + 98, // 98-100% lightness
  };
}

export function generateOffWhite(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 15), // Slightly more saturation than pure white
    l: Math.floor(Math.random() * 3) + 95, // 95-98% lightness
  };
}

export function generateTitleBlack(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 15),
    l: Math.floor(Math.random() * 5) + 10, // 10-15% lightness
  };
}

export function generateParagraphBlack(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 10),
    l: Math.floor(Math.random() * 8) + 15, // 15-23% lightness
  };
}

export function getComplementaryColor(color: HSLColor): HSLColor {
  return {
    h: (color.h + 180) % 360,
    s: color.s,
    l: color.l,
  };
}

export function getLighterShade(color: HSLColor): HSLColor {
  return {
    ...color,
    l: Math.min(color.l + 20, 90),
  };
}

export function getDarkerShade(color: HSLColor): HSLColor {
  return {
    ...color,
    l: Math.max(color.l - 20, 10),
  };
}

export function hslToString(color: HSLColor): string {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

export function hexToHSL(hex: string): HSLColor {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(color: HSLColor): string {
  const h = color.h / 360;
  const s = color.s / 100;
  const l = color.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}