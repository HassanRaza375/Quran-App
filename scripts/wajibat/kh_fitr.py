# Khamenei on zakāt al-fiṭrah: the "Zakat ul-Fitrah" chapter of the official English fasting-rulings Q&A book
# (leader.ir, 4 sections) and its official Urdu edition «فطرہ» (4 sections), questions 225-N, same numbers in both.
# No Persian original of this book was found, so these entries are compared English against Urdu only.
import html, json, os, re
from paths import SRC
TR = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")

def _clean(h):
    t = html.unescape(re.sub(r"<[^>]+>", "", re.sub(r"<br\s*/?>", "\n", h))).replace("\xa0", " ")
    return "\n".join(re.sub(r"[ \t]+", " ", ln).strip() for ln in t.split("\n")).strip()

def _parse(path, ans):
    out = {}
    for nd in json.load(open(os.path.join(SRC, path), encoding="utf-8")):
        body = nd["body"].translate(TR)
        for m in re.finditer(r'(?:^|<br\s*/?>)\s*(\d+)\s*[.:]\s*(.*?)<br\s*/?>\s*(?:&nbsp;\s*)*<span class="answer">(.*?)</span>', body, re.S):
            n = int(m.group(1))
            q, a = _clean(m.group(2)), _clean(m.group(3))
            a = re.sub(r"^\s*" + ans + r"\s*", "", a).strip()
            out[n] = {"n": n, "q": q, "a": a, "sn": nd["id"], "title": nd["title"]}
    return out

EN = _parse("fitr_en.json", r"A\s*:")
UR = _parse("ur_books/fitr_ur.json", r"ج\s*[۔.:]")

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    print(len(EN), sorted(EN)[:3], sorted(EN)[-3:], len(UR), sorted(UR)[:3], sorted(UR)[-3:])
    for n in sorted(EN):
        print(n, EN[n]["q"][:110].replace("\n", " "))
