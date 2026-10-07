# Automated mismatch check (decision A1, 2026-10-07): for every ruling with more than one language
# version, compare numbers, ordinal words and negation words, and report every difference. A person
# decides each one; nothing here changes the dataset.
#
#   python scripts/wajibat/mismatch.py            # writes tests/fixtures/wajibatMismatches.json and
#                                                 # wajibat_mismatch_report.md
#
# Pairs compared: English/Urdu for every dataset entry that has both; English/Persian and
# Urdu/Persian for Khamenei's Rules entries (the Persian text is read from the downloaded
# leader.ir pages, never stored in the app); the four Urdu treatise entries against the Persian
# Risala-yi Amuzishi. The TypeScript twin (app/utils/wajibatMismatch.ts) recomputes the
# English/Urdu pairs in the test run and must agree with this file. Word tables are shared:
# app/utils/wajibatMismatchWords.json.
import json, os, re, sys, unicodedata
sys.stdout.reconfigure(encoding="utf-8")
from paths import TMP, REPO, SRC

WORDS = json.load(open(os.path.join(REPO, "app", "utils", "wajibatMismatchWords.json"), encoding="utf-8"))
nfc = lambda s: unicodedata.normalize("NFC", s)
DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
TOKEN = re.compile(r"\d+(?:[.,/]\d+)?(?:st|nd|rd|th)?|[^\W\d_]+(?:[-’'][^\W\d_]+)*")
LIST_NO = re.compile(r"^\s*(?:\(?\d+[.)۔:]|\(?[a-zA-Z][.)])\s+", re.M)


def tokens(text, lang):
    t = nfc(text).translate(DIGITS).lower()
    t = LIST_NO.sub("", t)
    for a, b in WORDS["normalize"].items(): t = t.replace(a, b)
    t = re.sub(r"\[\d+\]", " ", t)
    t = re.sub(WORDS["referenceStrip"], " ", t, flags=re.I)
    t = t.replace("سی‌ام", "سیم").replace("‌", " ")
    return TOKEN.findall(t)


def signals(text, lang):
    """(cardinals, ordinals, negation count) in reading order."""
    card, ordn, neg = [], [], 0
    C, O, N = WORDS["cardinals"][lang], WORDS["ordinals"][lang], set(WORDS["negations"][lang])
    NP = WORDS["negationPrefixes"]
    for tok in tokens(text, lang):
        m = re.fullmatch(r"(\d+(?:[.,/]\d+)?)(st|nd|rd|th)?", tok)
        if m:
            v = m.group(1)
            if re.fullmatch(r"\d+", v): v = int(v)
            if m.group(2): ordn.append(v)
            else: card.append(v)
        elif tok in O: ordn.append(O[tok])
        elif tok in C: card.append(C[tok])
        if tok in N or (lang == "en" and re.search(r"n['’]t$", tok)) or (lang in NP and re.search(NP[lang], tok)): neg += 1
    return sorted(card, key=str), sorted(ordn, key=str), neg


def compare(a, la, b, lb):
    """Mismatch kinds between two versions of one text, each with a severity:
    "high" = a number/ordinal appears on only one side, or a negation appears on only one side
    (the kind of difference that changes a ruling); "low" = same values or same presence but a
    different count (usually translation style)."""
    ca, oa, na = signals(a, la)
    cb, ob, nb = signals(b, lb)
    out = []
    if ca != cb: out.append(("numbers", "high" if set(map(str, ca)) != set(map(str, cb)) else "low", ca, cb))
    if oa != ob: out.append(("ordinals", "high" if set(map(str, oa)) != set(map(str, ob)) else "low", oa, ob))
    if na != nb: out.append(("negation", "high" if (na == 0) != (nb == 0) else "low", na, nb))
    return out


def fmt(x): return json.dumps(x, ensure_ascii=False)


def main():
    data = json.load(open(os.path.join(TMP, "wdata.json"), encoding="utf-8"))
    compared = [0]
    rows = []   # {key, ruling, marja, pair, kind, a, b, ref}

    def add(rid, marja, field, pair, a, b, ref):
        compared[0] += 1
        found = compare(a[1], pair[0], b[1], pair[1])
        if found:
            rows.append({"key": f"{rid}|{marja}|{field}|{pair[0]}-{pair[1]}", "ruling": rid, "marja": marja, "field": field,
                         "pair": f"{pair[0]}-{pair[1]}", "ref": ref,
                         "severity": "high" if any(f[1] == "high" for f in found) else "low",
                         "kinds": [{"kind": k, "severity": sv, "left": x, "right": y} for k, sv, x, y in found]})

    # ---- English / Urdu, every dataset entry that has both ----
    for r in data["rulings"]:
        for e in r["rulings"]:
            for field in ("text", "question"):
                t = e.get(field) or {}
                if t.get("en") and t.get("ur") and not e.get("urduOnly"):
                    add(r["id"], e["marjaId"], field, ("en", "ur"), ("en", t["en"]), ("ur", t["ur"]), e["source"]["reference"])

    # ---- Persian: Khamenei's Rules (three editions) ----
    from align_rules import flat
    FA, UR, _ = flat()
    for r in data["rulings"]:
        for e in r["rulings"]:
            ps = e.get("persianSource")
            if not ps or e["marjaId"] != "khamenei" or not ps["reference"].startswith("مسأله"):
                continue
            nums = [int(x) for x in re.findall(r"\d+", ps["reference"].translate(DIGITS))]
            fa = "\n".join(FA[n] for n in nums)
            ur = "\n".join(UR[n][0] for n in nums)
            en = e["text"]["en"] if e.get("excerpt") is None else None
            if en:
                add(r["id"], "khamenei", "text", ("en", "fa"), ("en", en), ("fa", fa), e["source"]["reference"])
            add(r["id"], "khamenei", "text", ("ur", "fa"), ("ur", ur), ("fa", fa), ps["reference"])

    # ---- Persian treatise against the four Urdu treatise entries ----
    import treatise
    fa_nodes = {n["id"]: n for n in json.load(open(os.path.join(SRC, "fa", "risala_amuzeshi_fa_tahara.json"), encoding="utf-8"))}
    import html
    h2t = lambda b: html.unescape(re.sub(r"<[^>]+>", "", re.sub(r"</h5>|<br\s*/?>|</p>", "\n", b)))
    sec = nfc(h2t(fa_nodes[29552]["body"]))
    inv = nfc(h2t(fa_nodes[29551]["body"]))
    parts = {"invalidators": inv.split("توجه")[0], "unaware": sec.split("2. کسی")[0].split("1.", 1)[1],
             "excessive": sec.split("2. کسی", 1)[1].split("3. شک")[0], "doubtperformed": sec.split("3. شک در وضو:", 1)[1].split("ب. در بطلان")[0]}
    for key, (ref, text) in treatise.units().items():
        add({"invalidators": "wuduinvalidators", "unaware": "wuduunaware", "excessive": "wuduexcessive", "doubtperformed": "wududoubtperformed"}[key],
            "khamenei", "text", ("ur", "fa"), ("ur", text), ("fa", parts[key]), ref)

    json.dump({"mismatches": rows}, open(os.path.join(REPO, "tests", "fixtures", "wajibatMismatches.json"), "w", encoding="utf-8", newline="\n"),
              ensure_ascii=False, indent=1, sort_keys=True)
    # ---- decisions: a person decides each mismatch (statuses below); new ones start "pending" ----
    dec_path = os.path.join(REPO, "tests", "fixtures", "wajibatMismatchDecisions.json")
    dec = json.load(open(dec_path, encoding="utf-8")) if os.path.exists(dec_path) else {}
    from rules_verdicts import VERDICTS
    withheld = set()   # rulings already decided under R11 (English or Urdu withheld, footnote trims) and logged in rules_verdicts.py
    for r in data["rulings"]:
        for e in r["rulings"]:
            m = re.fullmatch(r"(\d+)\.", e["source"]["reference"]) if e["marjaId"] == "khamenei" and e["source"]["title"].startswith("The Rules on Prayer") else None
            if m and int(m.group(1)) in VERDICTS: withheld.add(r["id"])
    for row in rows:
        if row["key"] not in dec:
            dec[row["key"]] = {"status": "pending", "note": ""}
            if row["ruling"] in withheld:
                dec[row["key"]] = {"status": "decided", "note": "Known: this ruling's English or Urdu version was checked against the Persian original and withheld or trimmed (decision R11, rules_verdicts.py)."}
    keys = {r["key"] for r in rows}
    dec = {k: v for k, v in dec.items() if k in keys}   # drop decisions for mismatches that no longer exist
    json.dump(dec, open(dec_path, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1, sort_keys=True)
    write_report(rows, dec, compared[0])
    print(len(rows), "mismatches;", sum(1 for v in dec.values() if v["status"] == "pending"), "pending")
    return rows


def write_report(rows, dec, compared):
    pend = [r for r in rows if dec[r["key"]]["status"] == "pending"]
    hi = [r for r in pend if r["severity"] == "high"]
    lo = [r for r in pend if r["severity"] == "low"]
    L = ["# Wajibat: automated mismatch report", "",
         "Generated by `scripts/wajibat/mismatch.py` (decision A1). For every ruling with more than one language version, the numbers, ordinal words and negation words of the versions were compared. **Every difference is listed; a person decides each** (statuses in `tests/fixtures/wajibatMismatchDecisions.json`: `pending`, `accepted` = the versions say the same, `fix`, `withhold`, `decided`).", "",
         "**What this check can and cannot see.** It sees a number or negation that appears on one side only, or a different count. It does **not** see a changed meaning with the same numbers and negations: the leisure-travel mistranslation (English 465, 'is not shortened') passes it, because the Urdu also contains one negation. Treat it as a net for slips, not as proof that the other pairs agree.", "",
         f"- Pairs compared: **{compared}** pairs of versions (every English/Urdu pair in the dataset, plus English/Persian and Urdu/Persian for Khamenei's *Rules on Prayer & Fasting* entries and the four Urdu treatise entries against the Persian *Risāla-yi Āmūzishī*).",
         f"- Flagged: **{len(rows)}** ({sum(1 for r in rows if r['severity']=='high')} high, {sum(1 for r in rows if r['severity']=='low')} low). Already decided: {len(rows)-len(pend)}. **Pending: {len(pend)}** ({len(hi)} high, {len(lo)} low).",
         "- **High** = a number or ordinal appears on one side only, or a negation appears on one side only. **Low** = the same values, or negation present on both sides, but a different count (usually translation style).",
         "- Left out on purpose (too ambiguous): 'one'/ایک, 'first'/پہلا/اول, 'second'/دوسرا/دوسری ('the other'). Tables: `app/utils/wajibatMismatchWords.json`.", ""]
    from collections import Counter
    L += ["## Counts", "", "| Pair | High | Low |", "|---|---|---|"]
    c = Counter((r["pair"], r["severity"]) for r in pend)
    for pr in ("en-ur", "en-fa", "ur-fa"):
        L.append(f"| {pr} | {c[(pr,'high')]} | {c[(pr,'low')]} |")
    L.append("")
    def table(rs):
        out = ["| Ruling | Marja' | Pair | Where | Differences (left vs right) | Decision |", "|---|---|---|---|---|---|"]
        for r in sorted(rs, key=lambda r: (r["pair"], r["marja"], r["ruling"])):
            diff = "; ".join(f"{k['kind']}{' **!**' if k['severity']=='high' else ''}: {fmt(k['left'])} vs {fmt(k['right'])}" for k in r["kinds"])
            out.append(f"| `{r['ruling']}` | {r['marja']} | {r['pair']} | {r['ref']} ({r['field']}) | {diff} | ☐ |")
        return out
    L += ["## High", ""] + table(hi) + ["", "## Low", ""] + table(lo) + [""]
    open(os.path.join(REPO, "wajibat_mismatch_report.md"), "w", encoding="utf-8", newline="\n").write("\n".join(L))


if __name__ == "__main__":
    main()
