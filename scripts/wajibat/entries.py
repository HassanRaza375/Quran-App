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
# Corrected 2026-10-07: leader.ir does have an official Urdu edition (book 197, numbered like the Persian original);
# matching it to these rulings is pending the user's decision (P18), so the English is shown alone until then.
RPF_NO_URDU = "The official Urdu edition of this book (نماز اور روزه کی احکام, leader.ir) has not yet been matched to this ruling, so only the English is shown for now (decision R1)."

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
    return _cut(_norm_ws(_read(os.path.join(HERE, "en", f"p{page}.txt"))), a, b, f"intro {page}")

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

# Rulings withheld from display, with the reason (recorded here so a regeneration can't bring them back).
# The marja's other entries in the same Ruling stay; his followers see "not added yet — refer to his risala".
HIDDEN_RPF = {
    465: "P15 (2026-10-07): the English reads 'prayer during such a travel is not shortened', contradicting "
         "Rules 452 and 462 (tourism is a permissible purpose). It is not about a specific trip: it sits under "
         "'Continuation of the Travel's Permissibility', and amusement hunting is ruled separately (469-471). "
         "The Persian original, رساله نماز و روزه مسأله 466 (leader.ir sn=30834), says the prayer is shortened (قصر). "
         "Mistranslation in the English edition, so hidden; our own translation is never shown.",
}

def K(n, *, cut=None, hukm=None, basis=None, note=None):
    """Khamenei entry from The Rules on Prayer & Fasting 2023 (English only, R1)."""
    if n in HIDDEN_RPF:
        return None
    t, sn = nfc(RPF[n]["text"]), RPF[n]["sn"]
    excerpt = False
    if cut:
        t = _cut(t, cut[0], cut[1], n); excerpt = True
    r = {"marjaId": "khamenei", "format": "issue", "text": {"en": t}}
    b = basis or infer_basis(t)
    if hukm: r["hukm"] = hukm
    r["basis"] = b
    if excerpt: r["excerpt"] = True
    r["source"] = {"title": KH_RPF_BOOK, "reference": f"{n}.", "url": RPF_URL.format(sn)}
    r["verification"] = "A"
    r["urduNote"] = RPF_NO_URDU
    notes = [x for x in [note, auto_note(t, b)] if x]
    if notes: r["note"] = " ".join(notes)
    return r

RULINGS = []
def R(id_, topic, subject, *entries, differs=False, sensitive=False, see_also=None):
    """see_also: {marjaId: rulingId} — for a marja' with no entry here whose book states this
    point inside that other ruling (same topic); the UI points there instead of "not added yet"."""
    r = {"id": id_, "topicId": topic, "subject": {"en": subject}, "rulings": [e for e in entries if e]}
    if differs: r["differsBetweenMaraji"] = True
    if sensitive: r["sensitive"] = True
    if see_also: r["seeAlso"] = [{"marjaId": m, "rulingId": rid} for m, rid in see_also.items()]
    RULINGS.append(r)



# ---- Shared output steps ----
ARABIC = re.compile(r"[\u0600-\u06FF]")
ORDER = ["marjaId", "format", "question", "text", "hukm", "basis", "excerpt", "source", "urSource", "verification", "arabicInSource", "urduNote", "urduEditionLag", "note"]

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
