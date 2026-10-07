# Aligns The Rules on Prayer & Fasting across its three official editions on leader.ir:
# Persian original (book 180), official Urdu (book 197), English (book 241 / 214).
# The English and Urdu are translations of the Persian (decision R11: the Persian decides when
# they disagree). Numbering drifts: English 1-1003, Persian/Urdu 1-1011.
import html, json, os, re, sys
from paths import SRC

sys.stdout.reconfigure(encoding="utf-8")
FIXED = []   # (file, wrong number, number read) — typos in the source's own numbering

DIG = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
RULING_FA = re.compile(r"\s*مس[أائ]ل[هة]\s*(\d+)\s*[\)\-:]?\s*")        # «مسأله 466) …» (also مساله / مسئله)
RULING_UR = re.compile(r"\s*مس[ئٔ]ل[ہه]?\s*(\d+)\s*[۔\.\)\-:]?\s*")      # «مسئلہ466۔ …»
BLOCK_RE = re.compile(r'<h5 class="(matn|subTitle)"[^>]*>(.*?)</h5>', re.S)       # Urdu / English books
P_RE = re.compile(r"<p([^>]*)>(.*?)</p>", re.S)                                     # Persian book
MARKER = re.compile(r"\s*\[\d+\]")


def block_text(raw):
    t = html.unescape(re.sub(r"<br\s*/?>", "\n", raw))
    t = re.sub(r"<[^>]+>", " ", t).replace("\xa0", " ")
    return "\n".join(re.sub(r"[ \t]+", " ", ln).strip() for ln in t.split("\n")).strip()


def blocks(body, persian):
    """(kind, text) blocks: kind is 'subTitle' for headings, else 'matn'. Persian paragraphs have no
    class, so a centred paragraph or one that is wholly bold («اول: خون زخم») counts as a heading."""
    if not persian or BLOCK_RE.search(body):   # some Persian sections use the same h5 classes as the others
        return BLOCK_RE.findall(body)
    out = []
    for attrs, raw in P_RE.findall(body):
        inner = raw.strip()
        bold = re.fullmatch(r"(?:<br\s*/?>|\s|&nbsp;)*<strong>.*</strong>(?:<br\s*/?>|\s|&nbsp;)*", inner, re.S) is not None
        out.append(("subTitle" if ("center" in attrs or bold) else "matn", raw))
    return out


def parse(path, rx):
    """Sections with their numbered rulings, read block by block like kh_rpf.py does for the English:
    a 'subTitle' block (a heading such as «اول: خون زخم» or a section name) is never part of a ruling
    and ends the one before it; 'matn' blocks continue the ruling they follow. A number that breaks
    the running sequence by a typo in the source ('5929', '8003') is read as the next number in
    sequence (logged in FIXED). The footnote block (after the section's <hr>) is attached to the
    rulings carrying its markers as '* …' lines, the English edition's own style; the markers
    themselves are dropped."""
    nodes = json.load(open(os.path.join(SRC, path), encoding="utf-8"))
    out, prev = [], 0
    for nd in nodes:
        persian = "/fa/" in path or path.startswith("fa/")
        main, _, foot = nd["body"].partition("<hr")
        rl, cur = {}, None
        for kind, raw in blocks(main, persian):
            t = block_text(raw)
            if not t:
                continue
            if kind == "subTitle" and not (persian and rx.match(t)):   # a bold ruling is still a ruling
                cur = None
                continue
            # one paragraph can hold several rulings separated by blank lines (<br /> <br />)
            for piece in re.split(r"\n\s*\n(?=\s*مس[أائ]ل[هة]?\s*\d)", t):
                m = rx.match(piece)
                if m:
                    n = int(m.group(1).translate(DIG))
                    if n != prev + 1 and n > 1011:
                        FIXED.append((path, n, prev + 1))
                        n = prev + 1
                    prev, cur = n, n
                    rl[n] = piece[m.end():].strip()
                elif cur is not None:
                    rl[cur] += "\n" + piece
        notes = {}
        for _kind, raw in blocks(foot, persian):
            mm = re.match(r"\[(\d+)\]\s*(.*)", block_text(raw), re.S)
            if mm:
                notes[int(mm.group(1))] = mm.group(2).strip()
        for k, v in list(rl.items()):
            for mk in [int(x) for x in re.findall(r"\[(\d+)\]", v)]:
                if mk in notes:
                    rl[k] = re.sub(r"\s*\[%d\]" % mk, "", rl[k], count=1).strip() + "\n* " + notes[mk]
            rl[k] = MARKER.sub("", rl[k]).strip()
        out.append({"id": nd["id"], "path": nd["path"], "rulings": rl})
    return out


def sections():
    return (parse("fa/rules_prayer_fasting_fa.json", RULING_FA),
            parse("ur_books/namaz_roza_ur.json", RULING_UR))


def flat():
    fa, ur = sections()
    return ({n: t for s in fa for n, t in s["rulings"].items()},
            {n: (t, s["id"]) for s in ur for n, t in s["rulings"].items()},
            {n: s["id"] for s in fa for n in s["rulings"]})


# ---- English number -> Persian/Urdu number (same ruling, three editions) ----
# Section by section the three editions list the same rulings in the same order. The English
# edition lacks four Persian rulings in the prayer chapter (52 on ignorance of the covering
# rule, 495 on visiting relatives, and 777-780 on the Friday sermon), so the offset grows:
# +1 after 52, +2 after 495. Every pair is then checked by content (review_rules.py) — the
# numbering is never trusted on its own.
def en_to_fa(n):
    if n <= 51:
        return n
    if n <= 493:
        return n + 1
    if n <= 785:
        return n + 2
    return None   # fasting chapter: no entry uses it yet


if __name__ == "__main__":
    F, U, _ = flat()
    print("persian", len(F), "urdu", len(U), "typo fixes", FIXED)
    print("missing (persian):", [n for n in range(1, 1012) if n not in F], "(urdu):", [n for n in range(1, 1012) if n not in U])
    print(U[65][0]); print("---"); print(F[65]); print("---"); print(U[44][0][-260:])
