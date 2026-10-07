# Khamenei, "The Rules on Prayer & Fasting 2023" (leader.ir book 241): numbered
# rulings, assembled verbatim from each section's HTML body, as returned by the
# site's own tree endpoint (POST /ajax/book, crawled into rpf_tree.json). Each
# section id (sn) gives the citation URL https://www.leader.ir/en/book/241?sn=<sn>.
#
# Rulings and list items share the same <h5 class="matn"> markup. A "1. " block
# right after a ruling opens a list; list items continue while the numbering
# follows the list counter. Any block that could be read either way is recorded
# in AMBIGUOUS for manual review.
import html, json, os, re

from paths import SRC as HERE  # downloaded sources (README.md)
BLOCK_RE = re.compile(r'<h5 class="(matn|subTitle)"[^>]*>(.*?)</h5>', re.S)

def _text(b):
    t = html.unescape(re.sub(r"<br\s*/?>", "\n", b))
    t = re.sub(r"<[^>]+>", "", t).replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    return "\n".join(l.strip() for l in t.split("\n")).strip()

NODES = json.load(open(os.path.join(HERE, "rpf_tree.json"), encoding="utf-8"))
RPF = {}        # n -> {"text", "sn", "path"}
AMBIGUOUS = []

for node in NODES:
    sn, last, listn = node["id"], None, None
    for kind, raw in BLOCK_RE.findall(node["body"]):
        t = _text(raw)
        if not t or kind == "subTitle":
            continue
        # "141. ", "173, " and "767.If" all occur in the source
        m = re.match(r"^(\d+)\s*[.,\-]\s*(?=\D)", t)
        n = int(m.group(1)) if m else None
        as_list = n is not None and last is not None and ((listn is None and n == 1) or (listn is not None and n == listn + 1))
        as_ruling = n is not None and n not in RPF and (last is None or last < n <= last + 3)
        if as_list and as_ruling:
            AMBIGUOUS.append((sn, last, n, t[:90]))
        if as_ruling and not (as_list and listn is not None):
            last, listn = n, None
            RPF[n] = {"text": t[m.end():].strip(), "sn": sn, "path": node["path"]}
            continue
        if as_list:
            listn = n
        if last is not None:
            RPF[last]["text"] += "\n" + t

def rpf(n):
    r = RPF[n]
    return r["text"], r["sn"]
