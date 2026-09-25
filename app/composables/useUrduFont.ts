// Registers the bundled Noto Nastaliq Urdu font (Arabic-script subset, weight
// 400, woff2 only, ~159 KB) — but only when a page that displays Urdu calls
// this (/fiqh/** and the poet modules; decision P4). The file ships in the
// build, so it works offline; other routes never download it.
import fontUrl from "@fontsource/noto-nastaliq-urdu/files/noto-nastaliq-urdu-arabic-400-normal.woff2?url";

let registered = false;

export const useUrduFont = () => {
  onMounted(() => {
    if (registered || typeof FontFace === "undefined" || !document.fonts) return;
    registered = true;
    const face = new FontFace("Noto Nastaliq Urdu", `url(${fontUrl}) format("woff2")`, {
      weight: "400",
      style: "normal",
      display: "swap",
    });
    document.fonts.add(face);
    face.load().catch(() => {
      // Falls back to the system Urdu font declared in .urdu-text.
      registered = false;
    });
  });
};
