# Places Khamenei's supplementary Q&A ids (gen_kqa.py → TMP/kqa_meta.json) in their topic's
# `rulingIds` in app/data/wajibat/topics.ts, directly after the Rules on Prayer & Fasting
# ruling they were compared with (or at the end when that ruling isn't in the topic).
# Idempotent: re-running leaves an already-placed id where it is. Touches nothing else in
# topics.ts, which is otherwise authored content (summaries, explanations).
import json, os, re, sys
from paths import DATA, TMP

sys.stdout.reconfigure(encoding="utf-8")
meta = json.load(open(os.path.join(TMP, "kqa_meta.json"), encoding="utf-8"))
sal = "".join(open(os.path.join(DATA, "rulings", f), encoding="utf-8").read() for f in ("salat.ts", "doubts.ts", "sawm.ts"))

# Khamenei Rules number -> the salat ruling id that quotes it
num2id = {}
for m in re.finditer(r'\n    id: "(\w+)",.*?(?=\n  \},?\n|\n\];)', sal, re.S):
    for k in re.finditer(r'title: "The Rules on Prayer & Fasting 2023",\s*reference: "(\d+)\."', m.group(0)):
        num2id.setdefault(k.group(1), m.group(1))

p = os.path.join(DATA, "topics.ts")
s = open(p, encoding="utf-8").read()
added = 0
for rid, (topic, refs) in meta["ids"].items():
    m = re.search(r'(id: "%s",.*?rulingIds: \[)([^\]]*)\]' % topic, s, re.S)
    assert m, topic
    ids = [x.strip().strip('"') for x in m.group(2).split(",") if x.strip()]
    if rid in ids:
        continue
    anchors = [num2id.get(r.rstrip(".")) for r in refs]
    anchors = [a for a in anchors if a in ids]
    if anchors:
        i = ids.index(anchors[0]) + 1
        while i < len(ids) and ids[i] in meta["ids"]:  # after supplementary entries already placed there
            i += 1
        ids.insert(i, rid)
    else:
        ids.append(rid)
    s = s[:m.start(2)] + ", ".join(f'"{x}"' for x in ids) + s[m.end(2):]
    added += 1
# A removed Q&A id left in rulingIds is caught by the dataset validator ("unknown ruling").
open(p, "w", encoding="utf-8", newline="\n").write(s)
print("Q&A ids placed:", added, "of", len(meta["ids"]))
