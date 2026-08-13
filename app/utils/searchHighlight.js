// Escapes the raw text FIRST, then only ever inserts a fixed <mark> tag —
// same safe pattern as the tafsir markdown renderer (Pass 7): the source
// text is third-party API content rendered with v-html, so unescaped
// injection would be a real XSS hole.
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text, query) {
  const escaped = escapeHtml(text || "");
  const q = (query || "").trim();
  if (!q) return escaped;
  try {
    const re = new RegExp(`(${escapeRegExp(q)})`, "gi");
    return escaped.replace(re, "<mark>$1</mark>");
  } catch {
    return escaped;
  }
}
