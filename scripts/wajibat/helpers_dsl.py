# A small DSL for the decision helpers (Phase 4b). Trees are authored here as data; every quote is
# cut verbatim from the marja's own entry in the dataset (the generator fails if a start/end phrase
# isn't found), and every option names the ruling + exact phrase it rests on (P17). Nothing in a
# tree is a ruling written by the app: questions only describe the user's situation.
import json, os, re, sys, unicodedata
from paths import TMP

sys.stdout.reconfigure(encoding="utf-8")
nfc = lambda s: unicodedata.normalize("NFC", s)
_D = json.load(open(os.path.join(TMP, "wdata.json"), encoding="utf-8"))
RULING = {r["id"]: r for r in _D["rulings"]}
ERRS = []   # authoring errors are collected so one run reports them all


def bad(msg):
    ERRS.append(msg)


def entry(rid, marja):
    es = [e for e in RULING[rid]["rulings"] if e["marjaId"] == marja]
    assert es, f"no {marja} entry in ruling {rid}"
    return es[0]


def text_of(rid, marja, lang="en"):
    return nfc(entry(rid, marja)["text"].get(lang) or "")


def cut(text, start, end):
    """Verbatim excerpt from the first `start` through the end of the first `end` after it.
    start == 'FULL' takes the whole text; end None runs to the end of the text."""
    if start == "FULL":
        return text
    i = text.find(nfc(start))
    if i < 0:
        bad(f"start phrase not found: {start[:70]!r}"); return ""
    if end is None:
        return text[i:]
    j = text.find(nfc(end), i)
    if j < 0:
        bad(f"end phrase not found: {end[:70]!r} (start {start[:30]!r})"); return ""
    return text[i : j + len(nfc(end))]


class Tree:
    def __init__(self, id_, topic, marja, title, intro, risala, root):
        self.d = {"id": id_, "topicId": topic, "marjaId": marja, "title": {"en": title},
                  "intro": {"kind": "explanation", "text": {"en": intro}}, "rootId": root, "risala": risala, "nodes": []}
        self.marja, self.ids = marja, set()

    def q(self, rid, start, end=None, lang="en"):
        """A quote: a verbatim part of this marja's entry in ruling `rid`."""
        return {"rulingId": rid, "text": cut(text_of(rid, self.marja, lang), start, end), "lang": lang}

    def _phrase_ok(self, rid, phrase, lang):
        if nfc(phrase) not in text_of(rid, self.marja, lang):
            bad(f"basedOn phrase not in {rid}: {phrase[:70]!r}")

    def Q(self, id_, text, options, not_sure=None):
        """options: [(label, nextId, [(rulingId, phrase) | (rulingId, phrase, lang), ...]), ...]"""
        assert id_ not in self.ids, id_
        self.ids.add(id_)
        opts = []
        for k, (label, nxt, based) in enumerate(options, 1):
            assert based, f"{id_}/{label}: every option needs the ruling it rests on (P17b)"
            bo = []
            for b in based:
                rid, phrase, lang = (b + ("en",))[:3] if len(b) == 2 else b
                self._phrase_ok(rid, phrase, lang)
                bo.append({"rulingId": rid, "phrase": nfc(phrase)})
            opts.append({"id": f"{id_}o{k}", "label": {"en": label}, "nextId": nxt, "basedOn": bo})
        node = {"id": id_, "question": {"kind": "explanation", "text": {"en": text}}, "options": opts}
        if not_sure:
            node["notSureId"] = not_sure
        self.d["nodes"].append(node)

    def OUT(self, id_, quotes, verdict, see=()):
        assert id_ not in self.ids, id_
        self.ids.add(id_)
        joined = "\n".join(q["text"] for q in quotes)
        for v in verdict:
            if nfc(v) not in joined:
                bad(f"{id_}: verdict phrase not in the quotes: {v[:70]!r}")
        out = {"kind": "ruling", "quotes": quotes, "verdictPhrases": [nfc(v) for v in verdict]}
        if see:
            for rid in see:
                entry(rid, self.marja)
            out["seeRulingIds"] = list(see)
        self.d["nodes"].append({"id": id_, "outcome": out})

    def REFER(self, id_, reason):
        assert id_ not in self.ids, id_
        self.ids.add(id_)
        self.d["nodes"].append({"id": id_, "outcome": {"kind": "refer", "reason": {"kind": "explanation", "text": {"en": reason}}}})

    def build(self):
        ids = {n["id"] for n in self.d["nodes"]}
        assert self.d["rootId"] in ids, "root missing"
        for n in self.d["nodes"]:
            for o in n.get("options", []):
                assert o["nextId"] in ids, f"{n['id']}: unknown next {o['nextId']}"
            if n.get("notSureId"):
                assert n["notSureId"] in ids, f"{n['id']}: unknown notSureId"
        return self.d


def ts(obj):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return re.sub(r'^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":', r"\1\2:", body, flags=re.M)
