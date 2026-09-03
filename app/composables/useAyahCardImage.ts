export type CardPattern = "none" | "geometric" | "arch" | "stars";

// Grouping used to organize the theme picker so 16+ presets stay browsable
// instead of one long undifferentiated grid.
export type AyahCardThemeCategory = "Classic" | "Ramadan" | "Nature" | "Minimal" | "Luxury" | "Pastel";

export interface AyahCardTheme {
  id: string;
  label: string;
  category: AyahCardThemeCategory;
  background: [string, string]; // gradient stops
  textColor: string;
  accentColor: string;
  pattern: CardPattern;
}

export const CUSTOM_THEME_ID = "custom";

// A curated set of presets — pick one as-is, or use it as a starting point
// and override colors/pattern/text via the custom controls. Palettes are
// grounded in common Islamic/Quranic design conventions (deep green+gold,
// black/white minimalist with a red accent, luminous night gold, soft
// pastel pink/green/beige, blue+sand, and purple/orange mosque-silhouette
// gradients) rather than arbitrary colors.
export const AYAH_CARD_THEMES: AyahCardTheme[] = [
  { id: "teal", label: "Teal", category: "Classic", background: ["#0f2027", "#2c5364"], textColor: "#ffffff", accentColor: "#00f5a0", pattern: "none" },
  { id: "midnight", label: "Midnight Blue", category: "Classic", background: ["#020111", "#191621"], textColor: "#e8ecff", accentColor: "#5b8cff", pattern: "geometric" },
  { id: "maroon", label: "Maroon", category: "Classic", background: ["#2b0a0a", "#6b1e1e"], textColor: "#fbe9e0", accentColor: "#e8a87c", pattern: "arch" },
  { id: "mono", label: "Mono Ink", category: "Classic", background: ["#0a0a0a", "#1c1c1c"], textColor: "#ffffff", accentColor: "#e63946", pattern: "none" },

  { id: "ramadan", label: "Ramadan Night", category: "Ramadan", background: ["#1a2a3a", "#4a1a6c"], textColor: "#ffffff", accentColor: "#ffd700", pattern: "stars" },
  { id: "amberdusk", label: "Amber Dusk", category: "Ramadan", background: ["#3d1e40", "#c96a2e"], textColor: "#fff3e0", accentColor: "#ffb347", pattern: "arch" },

  { id: "emerald", label: "Emerald", category: "Nature", background: ["#0b3d2e", "#145c45"], textColor: "#f2fff8", accentColor: "#7ee8b8", pattern: "geometric" },
  { id: "sunset", label: "Sunset", category: "Nature", background: ["#4a1942", "#c9682f"], textColor: "#fff3e6", accentColor: "#ffd08a", pattern: "none" },
  { id: "ocean", label: "Ocean Blue", category: "Nature", background: ["#0a2a43", "#1f6f8b"], textColor: "#eaf6ff", accentColor: "#f2d9a1", pattern: "geometric" },

  { id: "light", label: "Light", category: "Minimal", background: ["#fdfaf3", "#eef2f0"], textColor: "#1c2b33", accentColor: "#0f7a6c", pattern: "none" },
  { id: "desert", label: "Desert Sand", category: "Minimal", background: ["#f0dfc0", "#d4a668"], textColor: "#3b2411", accentColor: "#8a5a2b", pattern: "arch" },
  { id: "frost", label: "Winter Frost", category: "Minimal", background: ["#dbe9f4", "#aac9dd"], textColor: "#1b2e3d", accentColor: "#4a7fa5", pattern: "geometric" },

  { id: "night", label: "Night Gold", category: "Luxury", background: ["#1a1a2e", "#16213e"], textColor: "#f5e6c8", accentColor: "#d4af37", pattern: "stars" },
  { id: "royal", label: "Royal Purple", category: "Luxury", background: ["#1a0933", "#4b1d6b"], textColor: "#f5e9ff", accentColor: "#d4af37", pattern: "arch" },

  { id: "rosegold", label: "Rose Gold", category: "Pastel", background: ["#fbe4e7", "#f6d1cf"], textColor: "#5c2733", accentColor: "#c98a94", pattern: "none" },
  { id: "sage", label: "Sage Garden", category: "Pastel", background: ["#eef2e6", "#d8e2c8"], textColor: "#2f3b26", accentColor: "#7a9463", pattern: "none" },
];

export const AYAH_CARD_THEME_CATEGORIES: AyahCardThemeCategory[] = [
  "Classic",
  "Ramadan",
  "Nature",
  "Minimal",
  "Luxury",
  "Pastel",
];

// Wraps text onto multiple lines that fit maxWidth, measured with the
// canvas's current font. Works for both LTR and RTL strings — direction is
// handled by the caller via ctx.direction/textAlign, this only splits words.
const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

/** Subtle repeating 8-point-star grid, drawn as thin strokes — decorative,
 * low-opacity, never competes with the text on top of it. */
const drawGeometricPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const step = 90;
  for (let x = -step; x < width + step; x += step) {
    for (let y = -step; y < height + step; y += step) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const r = i % 2 === 0 ? 34 : 16;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
};

/** A handful of small scattered flecks, evoking a night sky — cheap and
 * deterministic (fixed seed via index) so re-renders don't jitter. */
const drawStarsPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < 60; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * width;
    const y = (Math.sin(i * 78.233) * 12345.6789 % 1 + 1) % 1 * height;
    const r = 1 + ((i * 37) % 3);
    ctx.globalAlpha = 0.15 + ((i * 13) % 40) / 100;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

/** A simple stylized dome + minaret silhouette anchored to the bottom edge. */
const drawArchPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = color;
  const baseY = height;
  const centerX = width / 2;

  // Central dome
  ctx.beginPath();
  ctx.arc(centerX, baseY - 60, 90, Math.PI, 0);
  ctx.lineTo(centerX + 90, baseY);
  ctx.lineTo(centerX - 90, baseY);
  ctx.closePath();
  ctx.fill();

  // Two minarets
  for (const dx of [-220, 220]) {
    ctx.beginPath();
    ctx.arc(centerX + dx, baseY - 140, 18, Math.PI, 0);
    ctx.lineTo(centerX + dx + 18, baseY);
    ctx.lineTo(centerX + dx - 18, baseY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

const drawPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: CardPattern, color: string) => {
  if (pattern === "geometric") drawGeometricPattern(ctx, width, height, color);
  else if (pattern === "stars") drawStarsPattern(ctx, width, height, color);
  else if (pattern === "arch") drawArchPattern(ctx, width, height, color);
};

export interface RenderCardOptions {
  arabic: string;
  translation: string;
  translationLabel: string;
  reference: string;
  background: [string, string];
  textColor: string;
  accentColor: string;
  pattern: CardPattern;
  /** A user-uploaded photo, drawn cover-fit with a dark scrim under the gradient tint for legibility. */
  backgroundImage?: HTMLImageElement | null;
  arabicFontScale?: number;
  translationFontScale?: number;
  textAlign?: "center" | "right";
  /** Whether to draw the translation block at all — Arabic-only cards re-center the verse vertically instead. Defaults to true. */
  includeTranslation?: boolean;
  /** Horizontal margin (px, canvas is 1080 wide) on both left and right — controls how wide the text is allowed to wrap. Defaults to 90. */
  sidePadding?: number;
}

export const useAyahCardImage = () => {
  /**
   * Draws the card onto the given canvas and returns nothing — caller reads
   * back the canvas (toBlob/toDataURL) once this resolves. Waits on
   * `document.fonts.ready` first so Arabic/UI custom fonts aren't measured
   * against a fallback font, which would wrap text incorrectly.
   */
  const renderCard = async (canvas: HTMLCanvasElement, opts: RenderCardOptions) => {
    if (import.meta.client && document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* proceed with whatever fonts are available */
      }
    }

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (opts.backgroundImage) {
      // Cover-fit crop, then a dark scrim so text stays legible over an
      // arbitrary user photo regardless of its own brightness/contrast.
      const img = opts.backgroundImage;
      const scale = Math.max(width / img.width, height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, width, height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, opts.background[0]);
      gradient.addColorStop(1, opts.background[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    drawPattern(ctx, width, height, opts.pattern, opts.textColor);

    const padding = opts.sidePadding ?? 90;
    const contentWidth = width - padding * 2;
    const arabicSize = Math.round(56 * (opts.arabicFontScale ?? 1));
    const translationSize = Math.round(34 * (opts.translationFontScale ?? 1));
    const align = opts.textAlign ?? "center";
    const includeTranslation = opts.includeTranslation ?? true;

    // Arabic verse
    ctx.direction = "rtl";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = opts.textColor;
    ctx.font = `${arabicSize}px "Amiri Quran", serif`;
    const arabicLines = wrapLines(ctx, opts.arabic, contentWidth);
    const arabicLineHeight = Math.round(arabicSize * 1.65);
    // Arabic-only cards (no translation) start lower so the shorter block
    // of text sits roughly centered in the frame instead of hugging the top.
    let y = includeTranslation ? height * 0.32 : height * 0.42 - ((arabicLines.length - 1) * arabicLineHeight) / 2;
    for (const line of arabicLines) {
      ctx.fillText(line, width / 2, y);
      y += arabicLineHeight;
    }

    // Divider
    y += 20;
    ctx.strokeStyle = opts.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 60, y);
    ctx.lineTo(width / 2 + 60, y);
    ctx.stroke();
    y += 55;

    // Translation (optional — some users want an Arabic-only wallpaper)
    if (includeTranslation) {
      ctx.direction = "ltr";
      ctx.textAlign = align === "right" ? "right" : "center";
      ctx.font = `${translationSize}px "Sansation", sans-serif`;
      ctx.fillStyle = opts.textColor;
      const translationX = align === "right" ? width - padding : width / 2;
      const translationText = `"${opts.translation}"`;
      const translationLines = wrapLines(ctx, translationText, contentWidth);
      for (const line of translationLines.slice(0, 6)) {
        ctx.fillText(line, translationX, y);
        y += Math.round(translationSize * 1.4);
      }
    }

    // Reference + attribution, pinned near the bottom, always centered.
    ctx.textAlign = "center";
    ctx.font = '28px "Sansation", sans-serif';
    ctx.fillStyle = opts.accentColor;
    ctx.fillText(opts.reference, width / 2, height - 130);

    ctx.font = '22px "Sansation", sans-serif';
    ctx.fillStyle = opts.textColor;
    ctx.globalAlpha = 0.7;
    ctx.fillText(`${opts.translationLabel} · Quran App`, width / 2, height - 80);
    ctx.globalAlpha = 1;
  };

  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));

  const loadImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

  return { renderCard, canvasToBlob, loadImage };
};
