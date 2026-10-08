# Verbatim lookup of official texts by number, for Phase 2+ generators.
import glob, os, re

from paths import SRC as HERE  # downloaded sources (README.md)
TR = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")

def _read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

def _clean(s):
    s = re.sub(r"\[\d+\]", "", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = "\n".join(l.strip() for l in s.split("\n"))
    # drop page-navigation lines ("NEXT SECTION →", "← PREVIOUS") and bullet separators
    s = "\n".join(l for l in s.split("\n") if not (l.endswith("→") or l.startswith("←") or l == "•"))
    return s.strip()

# ---------- Sistani English: index "Ruling n." across the downloaded chapter pages ----------
SIS_EN = {}      # n -> (text, page_id, starred)
SIS_EN_HEAD_RE = re.compile(r"^Ruling (\d+)\.(\*?)\s*", re.M)
for p in sorted(glob.glob(os.path.join(HERE, "en", "p*.txt"))):
    page = os.path.basename(p)[1:-4]
    t = _read(p)
    # the page body sits between the header and footer language menus
    t = max(t.split("\nالعربية\nفارسی"), key=len)
    ms = list(SIS_EN_HEAD_RE.finditer(t))
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(t)
        body = t[m.end():end]
        # stop at the next section heading (ALL CAPS line) or footnote block "[1] ..."
        body = re.split(r"\n\[\d+\] ", body)[0]
        # unnumbered "The seventh condition:" style headings start a new unit
        body = re.split(r"\n(?=(?:The )?(?:\w+) condition:)", body)[0]
        body = re.split(r"\n(?=[A-Z0-9 ,.&'‘’()ʾʿĀĪŪḤḌṢṬẒ‑\-»]{12,}\n)", body)[0]
        n = int(m.group(1))
        if n not in SIS_EN:
            SIS_EN[n] = (_clean(body), page, m.group(2) == "*")

# ---------- Sistani Urdu: "مسئلہ (n)" ----------
SIS_UR = {}      # n -> (text, page_id)
# A mas'ala header starts a line; "…ذکر مسئلہ (۶۳۳) میں…" inside a ruling is a cross-reference.
UR_HEAD_RE = re.compile(r"^\s*مسئلہ\s*\(\s*([۰-۹٠-٩0-9]+)\s*\)\s*", re.M)
for p in sorted(glob.glob(os.path.join(HERE, "ur", "u*.txt"))):
    page = os.path.basename(p)[1:-4]
    t = max(_read(p).split("\nالعربية\nفارسی"), key=len)
    ms = list(UR_HEAD_RE.finditer(t))
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(t)
        n = int(m.group(1).translate(TR))
        body = t[m.end():end]
        body = body.split("\n←")[0].split("احکام طہارت ←")[0]
        body = re.split(r"\n(?=\(\S+ شرط:\))", body)[0]  # "(ساتویں شرط:)" starts a new unit
        # trailing section headings leak into the last mas'ala before them ("۱ -کرپانی",
        # "بیت الخلاء کے احکام"): short, unpunctuated, not a "(n:)" list item
        lines = _clean(body).split("\n")
        # a section heading (short, unpunctuated, not a "(n:)"/"۱:)" list item) ends the unit,
        # together with any unnumbered section intro after it ("وضوءجبیرہ کے احکام" + intro)
        def is_heading(l):
            if re.match(r"^[۰-۹0-9]+\s*-", l):          # "۱ -کرپانی", "۵ - خون": numbered section heading
                return True
            if re.match(r"^[(\[]|^[۰-۹0-9،,\s]+[:)]", l):  # "(اول:)", "۱)پیشاب", "۶،۷)کتااورسور", "۲:)": list item
                return False
            return len(l) < 50 and not re.search(r"[۔:؟)،]$", l)
        for k in range(1, len(lines)):
            if is_heading(lines[k]):
                lines = lines[:k]
                break
        body = "\n".join(lines)
        if n not in SIS_UR:
            SIS_UR[n] = (_clean(body), page)

def sis_en(n):
    return SIS_EN[n]

def sis_ur(n):
    return SIS_UR.get(n)

# ---------- Khamenei Q&A ----------
def _qa_index(path, qre, ans_re):
    lines = _read(os.path.join(HERE, path)).split("\n")
    out = {}
    for i, l in enumerate(lines):
        m = re.match(qre, l)
        if not m:
            continue
        n = int(m.group(1))
        q = l[m.end():].strip()
        a = re.sub(ans_re, "", lines[i + 1]).strip()
        k = i + 2
        while k < len(lines) and lines[k].strip() and not re.match(r"^(Q ?\d|س ?\d|\s)", lines[k]):
            a += "\n" + lines[k].strip()
            k += 1
        if n not in out:
            out[n] = (_clean(q), _clean(a))
    return out

KH_EN = _qa_index("kh_en_purity.txt", r"^Q ?(\d+)[:.]\s*", r"^A\s*:\s*")
KH_UR = _qa_index("kh_ur_purity.txt", r"^س ?(\d+)\s*:\s*", r"^ج\s*:\s*")

# ---------- Unnumbered "conditions" (e.g. conditions for the validity of wuḍūʾ) ----------
def condition_en(page, ordinal):
    """Verbatim 'The <ordinal> condition:' paragraph (up to the next condition/ruling) from an English page."""
    t = max(_read(os.path.join(HERE, "en", f"p{page}.txt")).split("\nالعربية\nفارسی"), key=len)
    m = re.search(rf"^The {ordinal} condition:(\*?)\s*", t, re.M)
    assert m, (page, ordinal)
    rest = t[m.end():]
    end = re.search(r"\n(?=The \w+ condition:|Ruling \d+\.)", rest)
    return _clean(rest[: end.start()] if end else rest), m.group(1) == "*"

def condition_ur(page, ordinal_ur):
    t = _read(os.path.join(HERE, "ur", f"u{page}.txt"))
    m = re.search(rf"\({ordinal_ur} شرط:\)\s*", t)
    assert m, (page, ordinal_ur)
    rest = t[m.end():]
    end = re.search(r"\n(?=\(\S+ شرط:\)|مسئلہ\s*\()", rest)
    return _clean(rest[: end.start()] if end else rest)

# ---------- Khamenei Q&A, prayer chapter (second-priority source for salat, R6) ----------
KH_EN_PRAYER = _qa_index("kh_en_prayer.txt", r"^Q ?(\d+)[:.]\s*", r"^A\s*:\s*")
KH_UR_PRAYER = _qa_index("kh_ur_prayer.txt", r"^س ?(\d+)\s*:\s*", r"^ج\s*:\s*")
# Fasting chapter (Phase 5): English Q 741-846 (sections sn 5292-5300, 5316), Urdu س 745-850 (sn 11424-11433). The pages hold the rest
# of the book too; only the fasting questions are indexed. Numbers do not collide with the prayer chapter.
KH_EN_PRAYER.update({n: v for n, v in _qa_index("kh_en_fasting.txt", r"^Q ?(\d+)[:.]\s*", r"^A\s*:\s*").items() if 741 <= n <= 846})
KH_UR_PRAYER.update({n: v for n, v in _qa_index("kh_ur_fasting.txt", r"^س ?(\d+)\s*:\s*", r"^ج\s*:\s*").items() if 745 <= n <= 850})
