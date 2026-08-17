export interface AyahCardTheme {
  id: string;
  label: string;
  background: [string, string]; // gradient stops
  textColor: string;
  accentColor: string;
}

export const AYAH_CARD_THEMES: AyahCardTheme[] = [
  { id: "teal", label: "Teal", background: ["#0f2027", "#2c5364"], textColor: "#ffffff", accentColor: "#00f5a0" },
  { id: "night", label: "Night Gold", background: ["#1a1a2e", "#16213e"], textColor: "#f5e6c8", accentColor: "#d4af37" },
  { id: "ramadan", label: "Ramadan", background: ["#1a2a3a", "#4a1a6c"], textColor: "#ffffff", accentColor: "#ffd700" },
  { id: "light", label: "Light", background: ["#fdfaf3", "#eef2f0"], textColor: "#1c2b33", accentColor: "#0f7a6c" },
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

export const useAyahCardImage = () => {
  /**
   * Draws the card onto the given canvas and returns nothing — caller reads
   * back the canvas (toBlob/toDataURL) once this resolves. Waits on
   * `document.fonts.ready` first so Arabic/UI custom fonts aren't measured
   * against a fallback font, which would wrap text incorrectly.
   */
  const renderCard = async (
    canvas: HTMLCanvasElement,
    opts: {
      arabic: string;
      translation: string;
      translationLabel: string;
      reference: string;
      theme: AyahCardTheme;
    }
  ) => {
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

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, opts.theme.background[0]);
    gradient.addColorStop(1, opts.theme.background[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const padding = 90;
    const contentWidth = width - padding * 2;

    // Arabic verse
    ctx.direction = "rtl";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = opts.theme.textColor;
    ctx.font = '56px "Amiri Quran", serif';
    const arabicLines = wrapLines(ctx, opts.arabic, contentWidth);
    const arabicLineHeight = 92;
    let y = height * 0.32;
    for (const line of arabicLines) {
      ctx.fillText(line, width / 2, y);
      y += arabicLineHeight;
    }

    // Divider
    y += 20;
    ctx.strokeStyle = opts.theme.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 60, y);
    ctx.lineTo(width / 2 + 60, y);
    ctx.stroke();
    y += 55;

    // Translation
    ctx.direction = "ltr";
    ctx.font = '34px "Sansation", sans-serif';
    ctx.fillStyle = opts.theme.textColor;
    const translationText = `"${opts.translation}"`;
    const translationLines = wrapLines(ctx, translationText, contentWidth);
    for (const line of translationLines.slice(0, 6)) {
      ctx.fillText(line, width / 2, y);
      y += 48;
    }

    // Reference + attribution, pinned near the bottom
    ctx.font = '28px "Sansation", sans-serif';
    ctx.fillStyle = opts.theme.accentColor;
    ctx.fillText(opts.reference, width / 2, height - 130);

    ctx.font = '22px "Sansation", sans-serif';
    ctx.fillStyle = opts.theme.textColor;
    ctx.globalAlpha = 0.7;
    ctx.fillText(`${opts.translationLabel} · Quran App`, width / 2, height - 80);
    ctx.globalAlpha = 1;
  };

  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));

  return { renderCard, canvasToBlob };
};
