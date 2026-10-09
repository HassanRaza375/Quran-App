# Khamenei, "The Rulings of Khums": the book's unnumbered statements (the rules the Q&A follow, e.g. "Khums is
# obligatory on seven things", "Whenever a Mukallaf earns property ..."). They carry no question number, so the three
# official editions (English, Urdu, Persian) are lined up by a monotone alignment inside the whole book: two texts are
# paired only when their lengths agree closely (a translation is about as long as its original) and the alignment is
# the best one overall. Anything that cannot be lined up is left unpaired and listed, never guessed.
# Text comes from the same crawled files as kh_khums.py; nothing is typed by hand.
import html, json, math, os, re
from paths import SRC

TR = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
LIST_NODES = {"en": 35612, "ur": 34676, "fa": 32278}      # "Khums is obligatory on seven things": one list, one statement
FOOT = re.compile(r"^\[\d+\]")


def _txt(r):
    t = html.unescape(re.sub(r"<[^>]+>", "", re.sub(r"<br\s*/?>", "\n", r))).replace("\xa0", " ")
    return "\n".join(re.sub(r"[ \t]+", " ", ln).strip() for ln in t.split("\n")).strip()


def _heading(t):
    """A short line with no sentence ending is a sub-heading, not a statement."""
    return len(t) < 70 and not re.search(r"[.:;?!)۔؟]$", t.strip()) and "\n" not in t


def _h5(path, qre, lang):
    out = []
    for nd in json.load(open(os.path.join(SRC, path), encoding="utf-8")):
        cur, L = None, []
        for kind, raw in re.findall(r'<h5 class="(matn|answer|note|subTitle)"[^>]*>(.*?)</h5>', nd["body"], re.S):
            t = _txt(raw)
            if not t or kind in ("note", "subTitle"):
                continue
            if kind == "matn":
                if re.match(qre, t.translate(TR)):
                    cur = {"a": False}
                    continue
                if cur is None or cur["a"]:
                    L.append(t)
            elif cur:
                cur["a"] = True
        if nd["id"] == LIST_NODES[lang]:
            L = ["\n".join(x for x in L if not FOOT.match(x))]
        else:
            L = [x for x in L if not FOOT.match(x) and not _heading(x)]
        out += [{"text": x, "sn": nd["id"], "section": nd["path"], "title": nd["path"][-1], "para": k + 1} for k, x in enumerate(L)]
    return out


def _fa():
    out = []
    for nd in json.load(open(os.path.join(SRC, "fa/khums_fa.json"), encoding="utf-8")):
        if nd["id"] < 32278:
            continue
        L, since_q = [], 99
        for m in re.finditer(r"<ol([^>]*)>(.*?)</ol>|<p([^>]*)>(.*?)</p>", nd["body"], re.S):
            if m.group(2) is not None:
                since_q = 0
                continue
            t = _txt(m.group(4))
            if not t:
                continue
            if re.match(r"^(\d+)\.\s+", t.translate(TR)) and nd["id"] != LIST_NODES["fa"]:
                since_q = 0
                continue
            since_q += 1
            if since_q == 1:          # the first paragraph after a question is its answer
                continue
            L.append(t)
        if nd["id"] == LIST_NODES["fa"]:
            L = ["\n".join(L)]
        else:
            L = [x for x in L if not FOOT.match(x) and not _heading(x)]
        out += [{"text": x, "sn": nd["id"], "section": nd["path"], "title": nd["path"][-1], "para": k + 1} for k, x in enumerate(L)]
    return out


def _dedup(L):
    seen, out = set(), []
    for s in L:
        if s["text"] not in seen:
            seen.add(s["text"])
            out.append(s)
    return out


EN = _dedup(_h5("khums_en.json", r"^Q?\s*(\d+)\s*[:.]\s*", "en"))
UR = _dedup(_h5("ur_books/khums_ur.json", r"^(\d+)\s*[:.]\s*", "ur"))
FA = _dedup(_fa())

BOUNDS = {"ur": (0.8, 1.6), "fa": (0.7, 1.35)}      # allowed length of the other edition relative to the English


def _digits(t):
    return sorted(re.findall(r"\d+", t.translate(TR)))


def align(a, b, lang):
    """Monotone alignment of English statements `a` to the other edition's `b`: index -> index."""
    lo, hi = BOUNDS[lang]
    n, m = len(a), len(b)
    sc = [[None] * m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            r = len(b[j]["text"]) / max(1, len(a[i]["text"]))
            if lo <= r <= hi:
                s = 1.0 - abs(math.log(r / ((lo * hi) ** 0.5))) * 0.6
                s += 0.8 if _digits(a[i]["text"]) == _digits(b[j]["text"]) else 0
                sc[i][j] = s
    D = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            best = max(D[i - 1][j], D[i][j - 1])
            if sc[i - 1][j - 1] is not None:
                best = max(best, D[i - 1][j - 1] + sc[i - 1][j - 1])
            D[i][j] = best
    i, j, pairs = n, m, {}
    while i > 0 and j > 0:
        if sc[i - 1][j - 1] is not None and abs(D[i][j] - (D[i - 1][j - 1] + sc[i - 1][j - 1])) < 1e-9:
            pairs[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif D[i][j] == D[i - 1][j]:
            i -= 1
        else:
            j -= 1
    return pairs


# Which node(s) of the Urdu and Persian editions hold the same section as each English node (the books group the
# sections a little differently, so a pairing is only ever looked for inside the same section).
SECTIONS = {
    35612: ([34676], [32278]), 35613: ([34677], [32279]), 35614: ([34678], [32279]), 35616: ([34679, 34680], [32280, 32281]),
    35624: ([34682], [32283]), 35628: ([34682], [32283]), 35625: ([34683], [32284]), 35629: ([34683], [32284]),
    35630: ([34683], [32284]), 35632: ([34685], [32299]), 35633: ([34686], [32286, 32287, 32288]), 35634: ([34692], [32289]),
    35635: ([34693], [32290]), 35636: ([34694], [32291]), 35641: ([34699], [32296]), 35642: ([34700], [32297]),
    35643: ([34701], [32298]),
}


def _pair_all(other, lang):
    """EN statement index -> index in `other`, aligned section by section (English nodes sharing one target are aligned together)."""
    groups = {}
    for i, e in enumerate(EN):
        tgt = tuple(SECTIONS.get(e["sn"], ([], []))[0 if lang == "ur" else 1])
        groups.setdefault(tgt, []).append(i)
    out = {}
    for tgt, idx in groups.items():
        if not tgt:
            continue
        cand = [j for j, x in enumerate(other) if x["sn"] in tgt]
        a = [EN[i] for i in idx]
        b = [other[j] for j in cand]
        for ai, bj in align(a, b, lang).items():
            out[idx[ai]] = cand[bj]
    return out


FA_OF = _pair_all(FA, "fa")

# Urdu and Persian share most of their religious vocabulary, so the two Arabic-script editions are lined up by the
# words they have in common (a much stronger signal than length). An English statement gets the Urdu text that is
# lined up with its Persian one; with no Persian match it gets no Urdu either (nothing is guessed).
_NORM = str.maketrans({"ي": "ی", "ك": "ک", "ى": "ی", "ە": "ہ", "ۀ": "ہ", "ہ": "ه", "ۃ": "ه", "ة": "ه", "ے": "ی", "ں": "ن", "ٹ": "ت", "ڈ": "د", "ڑ": "ر", "گ": "ک", "چ": "ج", "پ": "ب", "ژ": "ز", "ھ": "ه", "ؤ": "و", "أ": "ا", "إ": "ا", "آ": "ا"})


def _words(t):
    t = re.sub(r"[ً-ٰٟـ‌‍]", "", t).translate(_NORM)
    return {w for w in re.findall(r"[ء-ؿف-يٮ-ۓ]{3,}", t) if not w.isdigit()}


def _sim(u, f):
    a, b = _words(u), _words(f)
    return len(a & b) / max(1, min(len(a), len(b)))


def _ur_fa():
    """Persian index -> Urdu index, aligned section by section."""
    groups = {}
    for e in EN:
        u, f = SECTIONS.get(e["sn"], ([], []))
        if u and f:
            groups[(tuple(u), tuple(f))] = 1
    out, used_u = {}, set()
    for (un, fn) in groups:
        cu = [j for j, x in enumerate(UR) if x["sn"] in un and j not in used_u]
        cf = [j for j, x in enumerate(FA) if x["sn"] in fn]
        n, m = len(cf), len(cu)
        sc = [[_sim(UR[cu[j]]["text"], FA[cf[i]]["text"]) for j in range(m)] for i in range(n)]
        D = [[0.0] * (m + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                best = max(D[i - 1][j], D[i][j - 1])
                if sc[i - 1][j - 1] >= 0.22:
                    best = max(best, D[i - 1][j - 1] + sc[i - 1][j - 1])
                D[i][j] = best
        i, j = n, m
        while i > 0 and j > 0:
            if sc[i - 1][j - 1] >= 0.22 and abs(D[i][j] - (D[i - 1][j - 1] + sc[i - 1][j - 1])) < 1e-9:
                out[cf[i - 1]] = cu[j - 1]
                used_u.add(cu[j - 1])
                i, j = i - 1, j - 1
            elif D[i][j] == D[i - 1][j]:
                i -= 1
            else:
                j -= 1
    return out


_UF = _ur_fa()


def _digits_ok(a, b):
    """Same numbers in both texts; a list-item marker (1., 2-) in one edition only is not a difference."""
    da, db = _digits(a), _digits(b)
    if da == db:
        return True
    extra = set(da) ^ set(db)
    return all(len(x) == 1 for x in extra) and abs(len(da) - len(db)) <= 7 and (not da or not db or set(da) <= set(db) or set(db) <= set(da))


# Only a statement that all three editions confirm is paired: the Persian and Urdu must be lined up with each other
# by shared vocabulary, with the English by length, and must carry the same numbers. Everything else stays English
# only (listed in the progress log); a wrong Persian citation would be worse than none.
TRIPLE = {}
for _i, _f in FA_OF.items():
    _u = _UF.get(_f)
    if _u is not None and _digits_ok(EN[_i]["text"], FA[_f]["text"]) and _digits_ok(EN[_i]["text"], UR[_u]["text"]):
        TRIPLE[_i] = (_u, _f)
UR_OF = {i: u for i, (u, f) in TRIPLE.items()}
FA_OF = {i: f for i, (u, f) in TRIPLE.items()}

# ---- citations: section heading and paragraph number inside it, in each edition's own language ----
def ref(lang, rec):
    return {"en": f"Para. {rec['para']}, {rec['title']}", "ur": f"فقرہ {rec['para']}، {rec['title']}", "fa": f"بند {rec['para']}، {rec['title']}"}[lang]


def lookup(lang, reference):
    """The statement an edition's citation refers to (used by the source snapshot and the mismatch check)."""
    for rec in {"en": EN, "ur": UR, "fa": FA}[lang]:
        if ref(lang, rec) == reference:
            return rec["text"]
    return None


def fragment(rec):
    """A question or answer printed inside the statements (starts with "Q:" / "A:"): not a statement of its own."""
    return bool(re.match(r"^(Q|A)\s*:", rec["text"]))


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    print(len(EN), len(UR), len(FA), "paired ur", len(UR_OF), "fa", len(FA_OF))
    for i, e in enumerate(EN):
        u, f = UR_OF.get(i), FA_OF.get(i)
        print(i, e["sn"], len(e["text"]), "UR", None if u is None else (u, len(UR[u]["text"])), "FA", None if f is None else (f, len(FA[f]["text"])), "|", e["text"][:60].replace("\n", " "))
