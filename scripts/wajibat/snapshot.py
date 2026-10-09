# Builds tests/fixtures/wajibatSourceSnapshot.json: for every quoted MarjaRuling text/question
# and Recitation in the dataset, the official source unit it was extracted from, read from the
# downloaded official pages (never from the dataset). validateSourceSnapshot() then requires the
# quote to equal its numbered unit (or be a verbatim part of it when marked `excerpt`, or when
# the source is an unnumbered passage).
import json, os, re, sys, unicodedata, glob
sys.stdout.reconfigure(encoding="utf-8")
from src import SIS_EN, SIS_UR, KH_EN, KH_UR, KH_EN_PRAYER, KH_UR_PRAYER, _qa_index, _read, HERE
from kh_rpf import RPF
from gen_kqa import qa_unit
from align_rules import flat
import treatise
_FA, U_RULES, _FASEC = flat()   # official Urdu Rules (book 197) by ruling number
nfc = lambda s: unicodedata.normalize("NFC", s) if s else s
TR = str.maketrans("۰۱۲۳۴۵۶۷۸۹", "0123456789")
KH_EN_T = _qa_index("kh_en_taqlid.txt", r"^Q ?(\d+)[:.]\s*", r"^A\s*:\s*")
KH_UR_F = _qa_index("kh_ur_full.txt", r"^س ?(\d+)\s*:\s*", r"^ج\s*:\s*")

def clean(s):  # same normalisation the generators apply to every quote
    s = re.sub(r"\[\d+\]", "", s); s = re.sub(r"[ \t]+", " ", s)
    return nfc("\n".join(l.strip() for l in s.split("\n")))
CORPUS = {os.path.relpath(p, HERE): clean(_read(p)) for p in glob.glob(os.path.join(HERE, "**", "*.txt"), recursive=True)
          if not re.search(r"shots|rpf_list|spot3|_build|[\/]live[\/]", p)}
HEAD = re.compile(r"\n(?=Ruling \d+\.|مسئلہ\s*\(|Q ?\d+[:.]|س ?\d+\s*:|The \w+ condition:|\(\S+ شرط:\))")

def num(ref):
    m = re.search(r"[0-9۰-۹]+", ref); return int(m.group(0).translate(TR)) if m else None

def numbered_unit(r, e, lang, field):
    src = e["source"] if lang == "en" else e.get("urSource")
    n, t = num(src["reference"]), src["title"]
    if t in ("The Rulings of Khums", "احکام خمس") and e["marjaId"] == "khamenei":     # Khamenei's Rulings of Khums (Phase 6)
        import kh_khums
        return nfc(kh_khums.unit(lang, n, field))
    if t == "نماز اور روزه کی احکام":   # Khamenei's official Urdu Rules: «مسئلہ 466» or a merge «مسئلہ 508، 509»
        nums = [int(x.translate(TR)) for x in re.findall(r"[0-9۰-۹]+", src["reference"])]
        return nfc("\n".join(U_RULES[m][0] for m in nums)) if all(m in U_RULES for m in nums) else None
    if n is None or not re.match(r"^(Ruling \d+\*?|مسئلہ \(\d+\)|\d+\.|Q \d+|س \d+)$", src["reference"]): return None
    if e["marjaId"] == "sistani":
        u = (SIS_EN if lang == "en" else SIS_UR).get(n)
        return nfc(u[0]) if u else None
    if t.startswith("The Rules on Prayer"):
        return nfc(RPF[n]["text"]) if n in RPF else None
    if r.get("supplementary"):
        qa = qa_unit(n, lang)
    else:
        idxs = (KH_EN, KH_EN_PRAYER, KH_EN_T) if lang == "en" else (KH_UR, KH_UR_PRAYER, KH_UR_F)
        qa = next(((nfc(i[n][0]), nfc(i[n][1])) for i in idxs if n in i and nfc(e[field][lang]) in (nfc(i[n][0]), nfc(i[n][1]))), None)
        if qa is None:
            qa = next(((nfc(i[n][0]), nfc(i[n][1])) for i in idxs if n in i), None)
    if not qa: return None
    return qa[0] if field == "question" else qa[1]

def passage(text):
    """Unnumbered passage: the downloaded page text between the headings around the quote."""
    text = nfc(text)
    for k, v in CORPUS.items():
        i = v.find(text)
        if i >= 0:
            starts = [m.start() for m in HEAD.finditer(v, 0, i + 1)]
            a = starts[-1] + 1 if starts else max(0, i - 2000)
            m = HEAD.search(v, i + len(text)); b = m.start() if m else min(len(v), i + len(text) + 2000)
            return v[a:b], k
    return None, None

from paths import TMP
data = json.load(open(os.path.join(TMP, "wdata.json"), encoding="utf-8"))
snap, report, missing = {}, {}, []
def put(key, unit, numbered, how):
    snap[key] = {"unit": unit, "numbered": numbered}; report[how] = report.get(how, 0) + 1
for r in data["rulings"]:
    for e in r["rulings"]:
        for lang in ("en", "ur"):
            for field in ("text", "question"):
                txt = (e.get(field) or {}).get(lang)
                if not txt: continue
                key = f'{r["id"]}|{e["marjaId"]}|{lang}|{field}'
                if (e.get("urSource") or {}).get("title") == "احکام آموزشی" and lang == "ur":
                    # Khamenei's Urdu treatise: an unnumbered passage; the whole lesson is the source unit
                    lt = treatise.lesson_text()
                    if nfc(txt) in lt: put(key, lt, False, "treatise-passage"); continue
                u = numbered_unit(r, e, lang, field)
                if u is not None and (nfc(txt) == u or (e.get("excerpt") and nfc(txt) in u)):
                    put(key, u, True, "numbered-exact" if nfc(txt) == u else "numbered-excerpt"); continue
                p, k = passage(txt)
                if p is not None:
                    put(key, p, False, "passage" + (" (numbered unit mismatch!)" if u is not None else "")); 
                    if u is not None: missing.append((key, "numbered unit != text; found as passage in " + k))
                    continue
                missing.append((key, "NOT FOUND in any downloaded source"))
for rc in data["recitations"]:
    n = num(rc["source"]["reference"]); u = SIS_UR.get(n)
    if u and nfc(rc["arabic"]) in nfc(u[0]): put(f'recitation|{rc["id"]}', nfc(u[0]), True, "recitation-in-numbered")
    else: missing.append((rc["id"], "recitation not in its cited unit"))
print(report); print(len(missing), "problems"); [print(" ", m) for m in missing[:40]]
if len(sys.argv) > 1:
    json.dump(snap, open(sys.argv[1], "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1, sort_keys=True)
