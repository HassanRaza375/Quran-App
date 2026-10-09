# Khamenei, "The Rulings of Khums" (احکام خمس): a question-and-answer book numbered 1-314 in all three official
# editions on leader.ir, read through the site's own contents endpoint (crawl_book.py):
#   English  book 256 (catid 261)  khums_en.json        Urdu  book 245 (catid 257)  ur_books/khums_ur.json
#   Persian  book 215 (catid 238)  fa/khums_fa.json     (the original; used only to decide show/hide, never displayed)
# Question numbers are the same in the three editions (checked by test and by the mismatch check), so
# the editions pair by number. Nothing here is typed by hand.
import html, json, os, re
from paths import SRC

TR = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")

def _txt(r):
    t = html.unescape(re.sub(r"<[^>]+>", "", re.sub(r"<br\s*/?>", "\n", r))).replace("\xa0", " ")
    return "\n".join(re.sub(r"[ \t]+", " ", ln).strip() for ln in t.split("\n")).strip()

def _h5(path, qre):
    """English / Urdu: <h5 class="matn"> question, <h5 class="answer"> answer. A numbered line inside an
    answer (a list item) is not a question: a question is the next number in sequence."""
    out, last, cur = {}, 0, None
    for nd in json.load(open(os.path.join(SRC, path), encoding="utf-8")):
        for kind, raw in re.findall(r'<h5 class="(matn|answer|note|subTitle)"[^>]*>(.*?)</h5>', nd["body"], re.S):
            t = _txt(raw)
            if not t or kind in ("note", "subTitle"):
                continue
            m = re.match(qre, t.translate(TR)) if kind == "matn" else None
            if m and last < int(m.group(1)) <= last + 4:
                last = int(m.group(1))
                cur = {"n": last, "q": t[m.end():].strip(), "a": "", "sn": nd["id"], "section": nd["path"]}
                out[last] = cur
            elif cur is not None:
                if kind == "answer":
                    cur["a"] = (cur["a"] + "\n" + t).strip()
                elif not cur["a"]:
                    cur["q"] += "\n" + t       # the question continues over several blocks
                # a block of text after the answer that is not a numbered question is one of the book's
                # unnumbered statements: not part of this answer
    return out

def _fa(path):
    """Persian: <ol start="n"><li>question</li></ol> followed by <p> answer paragraphs."""
    out, cur, last = {}, None, 0
    for nd in json.load(open(os.path.join(SRC, path), encoding="utf-8")):
        if nd["id"] < 32280:      # the three introductory sections hold lists (the merits of khums, the seven items), no questions
            continue
        for m in re.finditer(r'<ol([^>]*)>(.*?)</ol>|<p([^>]*)>(.*?)</p>', nd["body"], re.S):
            if m.group(2) is not None:
                st = re.search(r'start="(\d+)"', m.group(1))
                items = re.findall(r"<li[^>]*>(.*?)</li>", m.group(2), re.S)
                n0 = int(st.group(1)) if st else last + 1
                if last < n0 <= last + 4 and items:
                    last = n0
                    cur = {"n": n0, "q": _txt(items[0]), "a": "", "sn": nd["id"], "section": nd["path"]}
                    out[n0] = cur
                elif cur is not None:      # a numbered list inside an answer
                    cur["a"] += "\n" + "\n".join(_txt(i) for i in items)
            else:
                t = _txt(m.group(4))
                if not t:
                    continue
                q = re.match(r"^(\d+)\.\s+", t.translate(TR))      # "224. question" (a list item in an intro is "1-")
                if q and last < int(q.group(1)) <= last + 4:     # later sections number questions as plain paragraphs
                    last = int(q.group(1))
                    cur = {"n": last, "q": t[q.end():].strip(), "a": "", "sn": nd["id"], "section": nd["path"]}
                    out[last] = cur
                elif cur is not None:
                    cur["a"] = (cur["a"] + "\n" + t).strip()
    return out

EN = _h5("khums_en.json", r"^Q?\s*(\d+)\s*[:.]\s*")
UR = _h5("ur_books/khums_ur.json", r"^(\d+)\s*[:.]\s*")
FA = _fa("fa/khums_fa.json")

def _strip(a, lang):
    """The answer without its label ("A:" / "جواب:"); a multi-part answer keeps its own "A1:" labels."""
    if lang == "en":
        return re.sub(r"^(?:Answer|A)\s*[:.]\s*", "", a).strip()
    return re.sub(r"^جواب\s*[:۔]?\s*", "", a).strip()

def unit(lang, n, field):
    """The official question or answer text of Q n in `lang` ("en" / "ur"), exactly as quoted in the dataset."""
    e = {"en": EN, "ur": UR}[lang].get(n)
    if not e:
        return None
    return e["q"] if field == "question" else _strip(e["a"], lang)

def usable(n, lang="en"):
    """A question the parse read cleanly: both fields present and no other question's text mixed into the answer.
    The three editions occasionally print an answer out of order; such questions are left out and listed."""
    q, a = unit(lang, n, "question"), unit(lang, n, "text")
    return bool(q and a) and not re.search(r"(?m)^Q ?\d+\s*[:.]", a) and len(a) < 6000

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    for name, d in (("en", EN), ("ur", UR), ("fa", FA)):
        miss = [i for i in range(1, 315) if i not in d]
        print(name, len(d), max(d), "missing", miss[:20], "noanswer", [n for n, v in d.items() if not v["a"]][:10])
