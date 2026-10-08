# Checks every supplementary Q&A entry (decision P13 / rule R7) word for word against the
# leader.ir section page it cites, in both languages. Reads the dataset dump written by
# build.py and the cached section pages (.cache/live/, re-created by fetch_sources.py).
#   python verify_live_qa.py            check all entries
#   python verify_live_qa.py khqa428    show where an entry diverges from the page
import html, json, os, re, sys, unicodedata
from paths import SRC, TMP

sys.stdout.reconfigure(encoding="utf-8")


def norm(t):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", t).replace("\xa0", " ")).strip()


def page_text(url):
    lang = "ur" if "/ur/" in url else "en"
    sn = re.search(r"sn=(\d+)", url).group(1)
    t = open(os.path.join(SRC, "live", f"{lang}_sn_{sn}.html"), encoding="utf-8", errors="replace").read()
    # a parenthesised marker "(1)" between two words ("دن<sup>(1)</sup>کے") is a word break, not part of either word
    t = re.sub(r"(?<=[^\W\d_])<sup>\s*\(\d+\)\s*</sup>(?=[^\W\d_])", " ", t)
    t = re.sub(r"<sup>.*?</sup>", "", t)                              # footnote markers
    t = re.sub(r"</?(span|strong|b|i|em|a|small|u)\b[^>]*>", "", t)  # inline tags: no space
    t = re.sub(r"<br\s*/?>", "\n", t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s*\[\d+\]", "", html.unescape(t))                 # "[1]" markers (Urdu)
    return norm(t)


data = json.load(open(os.path.join(TMP, "wdata.json"), encoding="utf-8"))
supp = [r for r in data["rulings"] if r.get("supplementary")]
bad = 0
for r in supp:
    e = r["rulings"][0]
    for lang, src in (("en", e["source"]), ("ur", e.get("urSource"))):
        if not src:
            continue
        P = page_text(src["url"])
        for f in ("question", "text"):
            t = norm(e[f][lang])
            if t not in P:
                bad += 1
                print("MISMATCH", r["id"], lang, f, t[:80])
                if r["id"] in sys.argv[1:]:
                    k = 10
                    while k < len(t) and t[:k] in P:
                        k += 5
                    i = P.find(t[: k - 5])
                    print("  data:", t[k - 30 : k + 60]); print("  page:", P[i + k - 30 : i + k + 60])
print(f"checked {len(supp)} supplementary entries against the live pages: {bad} mismatches")
sys.exit(1 if bad else 0)
