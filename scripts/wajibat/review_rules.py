# Prints, for each Khamenei entry quoted from The Rules on Prayer & Fasting 2023, the English text
# next to the Persian original and the official Urdu, with automatic flags, so every pair can be
# read and given a verdict (R11: the Persian decides). Usage:
#   python review_rules.py <first> <last> [width]     entries by index
#   python review_rules.py --flags                    only the automatic flags, all entries
import json, os, re, sys
from align_rules import en_to_fa, flat
from paths import TMP

sys.stdout.reconfigure(encoding="utf-8")
data = json.load(open(os.path.join(TMP, "wdata.json"), encoding="utf-8"))
F, U, _ = flat()

ENTRIES = []
for r in data["rulings"]:
    for e in r["rulings"]:
        if e["marjaId"] == "khamenei" and e["source"]["title"] == "The Rules on Prayer & Fasting 2023":
            ENTRIES.append((r["id"], int(e["source"]["reference"].rstrip(".")), e))
ENTRIES.sort(key=lambda x: x[1])

DIG = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


def signals(t, lang):
    t = t.translate(DIG)
    if lang == "en":
        return {"oblig": len(re.findall(r"obligatory (?:caution|precaution)", t, re.I)),
                "must": len(re.findall(r"(?:mustaḥabb|recommended) (?:caution|precaution)", t, re.I)),
                "caut": len(re.findall(r"caution|precaution", t, re.I)),
                "void": len(re.findall(r"invalid|void|null", t, re.I)),
                "digits": sorted(re.findall(r"\d+", t))}
    return {"oblig": len(re.findall(r"احتیاط\s+(?:واجب|لازم)", t)),
            "must": len(re.findall(r"احتیاط\s+مستحب", t)),
            "caut": len(re.findall(r"احتیاط", t)),
            "void": len(re.findall(r"باطل", t)),
            "digits": sorted(re.findall(r"\d+", t))}


def flags(en, fa, ur):
    out = []
    se, sf, su = signals(en, "en"), signals(fa, "fa"), signals(ur, "ur")
    for k in ("oblig", "must", "caut", "void"):
        if len({se[k], sf[k], su[k]}) > 1:
            out.append(f"{k}: en={se[k]} fa={sf[k]} ur={su[k]}")
    return out


if __name__ == "__main__":
    if sys.argv[1] == "--flags":
        for i, (rid, n, e) in enumerate(ENTRIES):
            m = en_to_fa(n)
            fl = flags(e["text"]["en"], F.get(m, ""), U.get(m, ("",))[0]) if m else ["no mapping"]
            if fl:
                print(i, rid, "en", n, "fa", m, fl)
        sys.exit()
    a, b = int(sys.argv[1]), int(sys.argv[2])
    w = int(sys.argv[3]) if len(sys.argv) > 3 else 420
    for i, (rid, n, e) in enumerate(ENTRIES[a:b], a):
        m = en_to_fa(n)
        en = e["text"]["en"].replace("\n", " | ")
        fa = F.get(m, "—").replace("\n", " | ")
        ur = U.get(m, ("—",))[0].replace("\n", " | ")
        print(f"#{i} [{rid}] EN {n} ↔ FA/UR {m}{'  (excerpt)' if e.get('excerpt') else ''}  flags={flags(e['text']['en'], F.get(m, ''), U.get(m, ('',))[0])}")
        print("  EN:", en[:w])
        if "--fa" in sys.argv or flags(e["text"]["en"], F.get(m, ""), U.get(m, ("",))[0]):
            print("  FA:", fa[:w])
        print("  UR:", ur[:w]); print()
