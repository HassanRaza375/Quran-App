# Shared builders for Wajibat ruling entries: every text is looked up verbatim in the
# downloaded official sources (src.py, kh_rpf.py) — nothing is retyped. Used by
# gen_salat.py and gen_doubts.py, which each import RULINGS/R and add their own rulings.
import json, os, re, sys, unicodedata
from src import SIS_EN, SIS_UR, _read
from kh_rpf import RPF

sys.stdout.reconfigure(encoding="utf-8")
from paths import SRC as HERE  # downloaded sources (README.md)

SIS_EN_BOOK, SIS_UR_BOOK = "Islamic Laws (4th edition)", "توضیح المسائل"
KH_RPF_BOOK = "The Rules on Prayer & Fasting 2023"
SIS_EN_URL = "https://www.sistani.org/english/book/48/{}/"
SIS_UR_URL = "https://www.sistani.org/urdu/book/61/{}/"
RPF_URL = "https://www.leader.ir/en/book/241?sn={}"
LAG_NOTE = "Marked * (revised) in the 4th edition. The official Urdu توضیح المسائل still has the earlier wording, so only the revised English is shown (decision P6)."
MATCH_NOTE = "Marked * (revised) in the 4th edition. The Urdu text was compared and matches in substance."
# Decision R11: every Khamenei Rules entry is read against the Persian original and its official
# Urdu edition (leader.ir book 197); see rules_verdicts.py and align_rules.py.
UR_RPF_BOOK = "نماز اور روزه کی احکام"
FA_RPF_BOOK = "رساله نماز و روزه"
UR_RPF_URL = "https://www.leader.ir/ur/book/197/1?sn={}"
FA_RPF_URL = "https://www.leader.ir/fa/book/180/1?sn={}"
RPF_NO_URDU = "The official Urdu edition of this book has no counterpart to this ruling in the same section, so only the English is shown (decision R1)."
URDU_WITHHELD_NOTE = "The official Urdu edition differs from the Persian original in this ruling, so only the English, which matches the Persian, is shown (decision R11)."

def infer_basis(text):
    t = text.strip()
    if re.match(r"^(Based on obligatory precaution|The obligatory precaution is|According to the obligatory caution|By obligatory caution|By the obligatory caution|According to obligatory caution|It is an obligatory caution)", t):
        return "ihtiyat_wajib"
    if re.match(r"^(The recommended precaution is|Based on recommended precaution|According to mustaḥabb caution|It is a mustaḥabb caution)", t):
        return "ihtiyat_mustahab"
    if re.match(r"^(As per caution|It is based on caution|According to caution|Based on caution|As a caution|By caution|It is a caution)", t):
        return "ihtiyat_unspecified"
    return "fatwa"

def auto_note(text, basis):
    notes = []
    body = text if basis == "fatwa" else text[40:]
    if re.search(r"obligatory (precaution|caution)", body):
        notes.append("Part of this ruling is stated as an obligatory precaution; see the wording.")
    if re.search(r"recommended precaution|mustaḥabb caution", body):
        notes.append("Part of this ruling is stated as a recommended precaution; see the wording.")
    if re.search(r"\b(as per caution|according to caution|based on caution|as a caution|is a caution|by caution)\b", body, re.I):
        notes.append("Part of this text says 'caution' without stating whether it is obligatory or recommended (decision P5).")
    return " ".join(notes) or None

def nfc(s):
    """Canonical (NFC) form: e.g. h + U+0323 → ḥ. Same text, one encoding, so excerpts match."""
    return unicodedata.normalize("NFC", s) if s else s

def _cut(full, a, b, label):
    full, a, b = nfc(full), nfc(a), nfc(b)
    if b is None:  # to the end of the text
        i = full.find(a); assert i >= 0, (label, a[:40]); return full[i:]
    i = full.find(a); j = full.find(b, i)
    assert i >= 0 and j >= 0, (label, a[:40], b[:40])
    return full[i:j + len(b)]

def _norm_ws(s):
    return re.sub(r"[ \t]+", " ", s)

def intro_en(page, a, b):
    """Verbatim excerpt of an unnumbered section intro on an English page."""
    return _cut(_norm_ws(re.sub(r"\[\d+\]", "", _read(os.path.join(HERE, "en", f"p{page}.txt")))), a, b, f"intro {page}")   # footnote markers are not part of the text

def intro_ur(page, a, b):
    return _cut(_norm_ws(_read(os.path.join(HERE, "ur", f"u{page}.txt"))), a, b, f"intro ur {page}")

def S(n=None, *, intro=None, cut=None, urdu="auto", hukm=None, basis=None, note=None, urdu_note=None):
    """Sistani entry. intro=(en_page, en_a, en_b, ur_page, ur_a, ur_b, reference) for unnumbered intros."""
    if intro:
        ep, ea, eb, up, ua, ub, ref = intro
        en, starred = intro_en(ep, ea, eb), False
        url = SIS_EN_URL.format(ep)
        ur = intro_ur(up, ua, ub) if up else None
        ur_ref, ur_url = "(تمہید)", SIS_UR_URL.format(up) if up else None
    else:
        en, page, starred = SIS_EN[n]
        en = nfc(en)
        ref, url = f"Ruling {n}{'*' if starred else ''}", SIS_EN_URL.format(page)
        u = SIS_UR.get(n)
        ur = nfc(u[0]) if u else None
        ur_ref, ur_url = f"مسئلہ ({n})", SIS_UR_URL.format(u[1]) if u else None
    excerpt = False
    if cut:
        en = _cut(en, cut[0], cut[1], n); excerpt = True
        if urdu == "auto": ur = None
    if isinstance(urdu, tuple):
        ur = _cut(SIS_UR[n][0], urdu[1], urdu[2], n); urdu = "match"
    if starred and urdu == "auto":
        raise AssertionError(f"Ruling {n} is revised (*): set urdu='match' or 'lag' after comparing")
    lag = urdu == "lag"
    if urdu in ("lag", "none"):
        ur = None
    r = {"marjaId": "sistani", "format": "issue", "text": {"en": en, **({"ur": ur} if ur else {})}}
    b = basis or infer_basis(en)
    if hukm: r["hukm"] = hukm
    r["basis"] = b
    if excerpt: r["excerpt"] = True
    r["source"] = {"title": SIS_EN_BOOK, "reference": ref, "url": url}
    if ur: r["urSource"] = {"title": SIS_UR_BOOK, "reference": ur_ref, "url": ur_url}
    r["verification"] = "A"
    if lag:
        r["urduEditionLag"] = True
        r["urduNote"] = urdu_note or "The official Urdu edition has the pre-revision wording of this ruling."
    elif urdu_note:
        r["urduNote"] = urdu_note
    notes = [x for x in [note, (LAG_NOTE if lag else MATCH_NOTE) if starred else None, auto_note(en, b)] if x]
    if notes: r["note"] = " ".join(notes)
    return r

from align_rules import en_to_fa, en_to_persian, flat
from rules_verdicts import VERDICTS, MERGES
_FA, _UR, _FASEC = flat()

def _urdu_basis(ur):
    """Basis from the opening words of the official Urdu text (used where the English is withheld)."""
    t = ur.strip()
    if re.match(r"^(احتیاط واجب کی بنا\s?پر|احتیاط واجب یہ|احتیاط لازم)", t): return "ihtiyat_wajib"
    if re.match(r"^(احتیاط مستحب)", t): return "ihtiyat_mustahab"
    if re.match(r"^(احتیاط کی بنا\s?پر|احتیاط یہ)", t): return "ihtiyat_unspecified"
    return "fatwa"

def _urdu_notes(ur, basis):
    body = ur if basis == "fatwa" else ur[40:]
    notes = []
    if re.search(r"احتیاط\s+(واجب|لازم)", body): notes.append("Part of this ruling is stated as an obligatory precaution; see the wording.")
    if re.search(r"احتیاط\s+مستحب", body): notes.append("Part of this ruling is stated as a recommended precaution; see the wording.")
    if re.search(r"احتیاط(?!\s+(واجب|لازم|مستحب))", body): notes.append("Part of this text says 'caution' (احتیاط) without stating whether it is obligatory or recommended (decision P5).")
    return notes

def _rules_pair(n):
    """(persian numbers, urdu text, urdu citation, persian citation) for English ruling n, or None.
    The Urdu edition follows the English order; the Persian original differs in one place (align_rules.en_to_persian)."""
    nums = MERGES.get(n) or ([en_to_fa(n)] if en_to_fa(n) else [])
    if not nums or any(m not in _UR for m in nums): return None
    fnums = MERGES.get(n) or [en_to_persian(n)]
    assert all(m in _FA for m in fnums), (n, fnums)
    ur = chr(10).join(_UR[m][0] for m in nums)
    lab = "، ".join(str(m) for m in nums)
    flab = "، ".join(str(m) for m in fnums)
    return (nums, nfc(ur),
            {"title": UR_RPF_BOOK, "reference": f"مسئلہ {lab}", "url": UR_RPF_URL.format(_UR[nums[0]][1])},
            {"title": FA_RPF_BOOK, "reference": f"مسأله {flab}", "url": FA_RPF_URL.format(_FASEC[fnums[0]])})

def K(n, *, cut=None, hukm=None, basis=None, note=None):
    """Khamenei entry from The Rules on Prayer & Fasting 2023. The English is quoted from that book;
    the official Urdu (book 197) is attached where it agrees with the Persian original, and the
    English is withheld where it does not (decision R11, rules_verdicts.py)."""
    t, sn = nfc(RPF[n]["text"]), RPF[n]["sn"]
    verdict, reason = VERDICTS.get(n, (None, None))
    pair = _rules_pair(n)
    assert not (cut and verdict), n
    excerpt = False
    if cut:
        t = _cut(t, cut[0], cut[1], n); excerpt = True
    if verdict == "footnote-trim":
        main = t.split("\n* ")[0]
        assert main != t, ("no footnote to trim", n)
        t, excerpt = main, True
    r = {"marjaId": "khamenei", "format": "issue", "text": {"en": t}}
    b = basis or infer_basis(t)
    ur = None
    if pair and verdict != "urdu-withheld":
        ur = pair[1]
        r["text"]["ur"] = ur
    if verdict == "english-withheld":
        b = basis or _urdu_basis(ur)
    if hukm: r["hukm"] = hukm
    r["basis"] = b
    if excerpt: r["excerpt"] = True
    r["source"] = {"title": KH_RPF_BOOK, "reference": f"{n}.", "url": RPF_URL.format(sn)}
    if ur: r["urSource"] = pair[2]
    if pair: r["persianSource"] = pair[3]
    r["verification"] = "A"
    if verdict == "english-withheld": r["englishWithheld"] = reason
    if verdict == "urdu-withheld": r["urduNote"] = URDU_WITHHELD_NOTE
    elif not pair: r["urduNote"] = RPF_NO_URDU
    notes = [note] if note else []
    notes += (_urdu_notes(ur, b) if verdict == "english-withheld" else [x for x in [auto_note(t, b)] if x])
    if verdict == "footnote-trim":
        notes.append("The English edition's footnote differs from the Persian original and the official Urdu edition, so it is not shown here; the Urdu text carries the footnote.")
    if notes: r["note"] = " ".join(notes)
    return r

# ---- Khamenei, "The Rulings of Khums" (Phase 6): a Q&A book numbered 1-314 in the English (book 256),
# the official Urdu (245) and the Persian original (215); see kh_khums.py. The Persian decides (R11). ----
KUMS_BOOK, KUMS_UR_BOOK, KUMS_FA_BOOK = "The Rulings of Khums", "احکام خمس", "احکام خمس"
KUMS_URL = "https://www.leader.ir/en/book/261?sn={}"
KUMS_UR_URL = "https://www.leader.ir/ur/book/257?sn={}"
KUMS_FA_URL = "https://www.leader.ir/fa/book/238?sn={}"
KUMS_NO_URDU = "The official Urdu edition has no usable counterpart to this question, so only the English is shown (decision R1)."

def KK(n, *, note=None, basis=None):
    """Khamenei's question n of The Rulings of Khums, with the official Urdu (same number) and the Persian original."""
    import kh_khums as kk
    assert kk.usable(n) and n in kk.FA, ("question not usable", n)
    q, a = nfc(kk.unit("en", n, "question")), nfc(kk.unit("en", n, "text"))
    r = {"marjaId": "khamenei", "format": "qa", "question": {"en": q}, "text": {"en": a}}
    uq, ua = kk.unit("ur", n, "question"), kk.unit("ur", n, "text")
    has_ur = kk.usable(n, "ur")
    if has_ur:
        r["question"]["ur"], r["text"]["ur"] = nfc(uq), nfc(ua)
    b = basis or infer_basis(a)
    r["basis"] = b
    r["source"] = {"title": KUMS_BOOK, "reference": f"Q {n}", "url": KUMS_URL.format(kk.EN[n]["sn"])}
    if has_ur:
        r["urSource"] = {"title": KUMS_UR_BOOK, "reference": f"س {n}", "url": KUMS_UR_URL.format(kk.UR[n]["sn"])}
    r["persianSource"] = {"title": KUMS_FA_BOOK, "reference": f"سؤال {n}", "url": KUMS_FA_URL.format(kk.FA[n]["sn"])}
    r["verification"] = "A"
    if not has_ur:
        r["urduNote"] = KUMS_NO_URDU
    notes = ([note] if note else []) + ([x for x in [auto_note(a, b)] if x])
    if notes:
        r["note"] = " ".join(notes)
    return r

def KS(i):
    """One unnumbered statement of The Rulings of Khums (a rule the book's Q&A follow): the English, and the Urdu and
    Persian editions only where all three were lined up with each other (kh_stm.py). Cited by section and paragraph."""
    import kh_stm as ks
    e = ks.EN[i]
    a = nfc(e["text"])
    r = {"marjaId": "khamenei", "format": "issue", "text": {"en": a}}
    b = infer_basis(a)
    r["basis"] = b
    r["source"] = {"title": KUMS_BOOK, "reference": ks.ref("en", e), "url": KUMS_URL.format(e["sn"])}
    if i in ks.TRIPLE:
        u, f = ks.TRIPLE[i]
        r["text"]["ur"] = nfc(ks.UR[u]["text"])
        r["urSource"] = {"title": KUMS_UR_BOOK, "reference": ks.ref("ur", ks.UR[u]), "url": KUMS_UR_URL.format(ks.UR[u]["sn"])}
        r["persianSource"] = {"title": KUMS_FA_BOOK, "reference": ks.ref("fa", ks.FA[f]), "url": KUMS_FA_URL.format(ks.FA[f]["sn"])}
    else:
        r["urduNote"] = KUMS_STM_UNMATCHED
    r["verification"] = "A"
    n = auto_note(a, b)
    if n:
        r["note"] = n
    return r

KUMS_STM_UNMATCHED = "This paragraph is printed in the official Urdu and Persian editions too, but it could not be lined up with the English one with certainty, so only the English is shown (decision R1)."

RULINGS = []
def R(id_, topic, subject, *entries, differs=False, sensitive=False, see_also=None, audience=None):
    """see_also: {marjaId: rulingId} — for a marja' with no entry here whose book states this
    point inside that other ruling (same topic); the UI points there instead of "not added yet"."""
    r = {"id": id_, "topicId": topic, "subject": {"en": subject}, "rulings": [e for e in entries if e]}
    if differs: r["differsBetweenMaraji"] = True
    if sensitive: r["sensitive"] = True
    if audience: r["audience"] = audience
    if see_also: r["seeAlso"] = [{"marjaId": m, "rulingId": rid} for m, rid in see_also.items()]
    RULINGS.append(r)



# ---- Shared output steps ----
ARABIC = re.compile(r"[\u0600-\u06FF]")
ORDER = ["marjaId", "format", "question", "text", "hukm", "basis", "excerpt", "source", "urSource", "persianSource", "verification", "arabicInSource", "englishWithheld", "urduNote", "urduEditionLag", "note"]

def finalize(rulings):
    """Flags `arabicInSource` and fixes the field order. The generators only ever copy text from
    the cited English book, so Arabic script in text.en is that book's own printed Arabic
    (validator rule, decision P12); Arabic from any other book must be a Recitation instead."""
    for r in rulings:
        for e in r["rulings"]:
            if ARABIC.search(e["text"]["en"] + (e.get("question") or {}).get("en", "")):
                e["arabicInSource"] = True
        r["rulings"] = [{k: e[k] for k in ORDER if k in e} for e in r["rulings"]]

def ts(obj):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":', r"\1\2:", body, flags=re.M)
