import re, sys, difflib
import review_rules as r
from align_rules import en_to_fa, DIG
sys.stdout.reconfigure(encoding="utf-8")
EN_NUM = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split())}
EN_NUM.update({"thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "hundred": 100, "once": 1, "twice": 2, "half": 0.5})
FA_NUM = {"صفر": 0, "یک": 1, "یکبار": 1, "دو": 2, "سه": 3, "چهار": 4, "پنج": 5, "شش": 6, "هفت": 7, "هشت": 8, "نه": 9, "ده": 10, "یازده": 11, "دوازده": 12, "هفده": 17, "هجده": 18, "بیست": 20, "سی": 30, "چهل": 40, "پنجاه": 50, "شصت": 60, "صد": 100}
UR_NUM = {"ایک": 1, "دو": 2, "تین": 3, "چار": 4, "چہار": 4, "پانچ": 5, "چھ": 6, "سات": 7, "آٹھ": 8, "نو": 9, "دس": 10, "گیارہ": 11, "بارہ": 12, "سترہ": 17, "اٹھارہ": 18, "بیس": 20, "تیس": 30, "چالیس": 40, "پچاس": 50, "ساٹھ": 60, "سو": 100}
def nums(t, lang):
    t = t.translate(DIG); out = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", t)]
    table = {"en": EN_NUM, "fa": FA_NUM, "ur": UR_NUM}[lang]
    toks = re.findall(r"[\w\u0600-\u06FF]+", t.lower() if lang == "en" else t)
    out += [float(table[w]) for w in toks if w in table and not (lang == "fa" and w in ("نه", "ده") and False)]
    return sorted(out)
NEG = {"en": r"\b(?:not|no|never|nor|neither|without|cannot|n't)\b", "fa": r"(?:نیست|نباید|نمی|نه |بدون|هیچ|نشده|ندار|نکن|نشود|نخواند)", "ur": r"(?:نہیں|نہ |بغیر|بدون|ہرگز)"}
def neg(t, lang): return len(re.findall(NEG[lang], t))
NORM = str.maketrans({"ي": "ی", "ى": "ی", "ك": "ک", "ۃ": "ہ", "ة": "ه", "ہ": "ه", "ۀ": "ه", "ھ": "ه", "ۓ": "ی", "ے": "ی", "ً": "", "‌": " ", "ٔ": "", "أ": "ا", "إ": "ا", "آ": "ا", "ئ": "ی", "ؤ": "و"})
def toks(t): return re.findall(r"[\u0600-\u06FF]{3,}", re.sub(r"[\u064B-\u065F]", "", t).translate(NORM))
def sim(fa, ur):
    a, b = set(toks(fa)), set(toks(ur))
    return len(a & b) / max(1, len(a | b))
if __name__ == "__main__":
    for i, (rid, n, e) in enumerate(r.ENTRIES):
        m = en_to_fa(n); fa = r.F[m]; ur = r.U[m][0]; en = e["text"]["en"]
        body = lambda t: re.split(r"\n\* |\n\[1\]", t)[0]
        en_b, fa_b, ur_b = body(en), body(fa), body(ur)
        out = []
        ne, nf, nu = nums(en_b, "en"), nums(fa_b, "fa"), nums(ur_b, "ur")
        if not (ne == nf == nu): 
            if len({tuple(ne), tuple(nf), tuple(nu)}) > 1: out.append(f"nums en={ne} fa={nf} ur={nu}")
        ge, gf, gu = neg(en_b, "en"), neg(fa_b, "fa"), neg(ur_b, "ur")
        if max(ge, gf, gu) - min(ge, gf, gu) >= 2 or (ge == 0) != (gf == 0) or (gu == 0) != (gf == 0): out.append(f"neg en={ge} fa={gf} ur={gu}")
        s = sim(fa_b, ur_b)
        if s < 0.5: out.append(f"fa~ur sim={s:.2f}")
        if out: print(i, rid, "|", "; ".join(out))
