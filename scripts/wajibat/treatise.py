# Khamenei's practical treatise, *Risāla-yi Āmūzishī* — the official Urdu translation «احکام آموزشی»
# (leader.ir book 201). It is his only treatise text for what invalidates wuḍūʾ: his English books
# and his Q&A have no such list. No official English translation exists (decision P19), so these
# entries are Urdu-only: shown in every language mode with a "no official English translation"
# label, and never translated by the app. Units are cut from the lesson's own blocks.
import json, os, re, unicodedata
from paths import SRC
from align_rules import block_text

BOOK = "احکام آموزشی"
LESSON16_SN = 32120
URL = "https://www.leader.ir/ur/book/201/1?sn={}"
_BL = re.compile(r'<h5 class="([^"]*)"[^>]*>(.*?)</h5>', re.S)
nfc = lambda s: unicodedata.normalize("NFC", s)


def lesson_blocks(sn=LESSON16_SN):
    nodes = json.load(open(os.path.join(SRC, "ur_books", "ahkam_amuzeshi_ur.json"), encoding="utf-8"))
    nd = next(n for n in nodes if n["id"] == sn)
    return [(k, block_text(r)) for k, r in _BL.findall(nd["body"].partition("<hr")[0]) if block_text(r)]


def lesson_text(sn=LESSON16_SN):
    """The whole lesson as plain text: the source passage the snapshot checks every quote against."""
    return nfc("\n".join(t for _k, t in lesson_blocks(sn)))


def _between(blocks, start_prefix, count):
    i = next(j for j, (_k, t) in enumerate(blocks) if t.startswith(start_prefix))
    return "\n".join(t for _k, t in blocks[i:i + count])


def units():
    b = lesson_blocks()
    return {
        # «6۔ مبطلات وضو»: the seven things that invalidate wuḍūʾ
        "invalidators": ("سبق 16 — مبطلات وضو", _between(b, "1۔ پیشاب نکلنا", 7)),
        # «7۔ وضو کے احکام» item 1: finding out afterwards that one's wuḍūʾ was invalid
        "unaware": ("سبق 16 — وضو کے احکام، 1", _between(b, "1۔ جو شخص اپنا وضو باطل ہونے", 1)),
        # item 2: the person who doubts excessively about the acts and conditions of wuḍūʾ
        "excessive": ("سبق 16 — وضو کے احکام، 2", _between(b, "2۔ جو شخص وضو کے افعال", 1)),
        # «وضو میں شک»: doubt whether one performed wuḍūʾ at all (before / during / after the prayer)
        "doubtperformed": ("سبق 16 — وضو میں شک (اصل وضو)", _between(b, "اصل وضو میں شک", 4)),
    }


# The Persian original, رساله آموزشی (leader.ir book 137), read against each Urdu unit (decision A2,
# 2026-10-07): all four agree item by item. Metadata only; the Persian is never displayed.
FA_BOOK = "رساله آموزشی"
FA_URL = "https://www.leader.ir/fa/book/137/1?sn={}"
PERSIAN = {
    "invalidators": ("درس 16 — مبطلات وضو", 29551),
    "unaware": ("درس 16 — احکام وضو، 1", 29552),
    "excessive": ("درس 16 — احکام وضو، 2", 29552),
    "doubtperformed": ("درس 16 — احکام وضو، 3 (الف)", 29552),
}


def KT(key, note=None):
    """Khamenei's entry from the treatise: Urdu only (P19). `note` is shown under the ruling."""
    ref, text = units()[key]
    cite = {"title": BOOK, "reference": ref, "url": URL.format(LESSON16_SN)}
    r = {"marjaId": "khamenei", "format": "issue", "text": {"en": "", "ur": nfc(text)}, "basis": "fatwa",
         "source": cite, "urSource": dict(cite), "verification": "A", "urduOnly": True,
         "persianSource": {"title": FA_BOOK, "reference": PERSIAN[key][0], "url": FA_URL.format(PERSIAN[key][1])}}
    if note:
        r["note"] = note
    return r
