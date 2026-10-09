# Safe-default triage of the mismatch report (decision B1, 2026-10-08). It decides only what is
# DISPLAYED until a person reviews each mismatch; no row is "accepted" by it.
#
#   Sistani, High rows (English/Urdu): hide the Urdu, show the English with the Urdu notice.
#       -> status hidden-pending-review, hold hide-ur
#   Khamenei, High rows: compare each version's numbers and negations with the Persian original.
#       Show the version that matches, hide the other -> persian-decided-pending-review, hold hide-ur / hide-en.
#       Both or neither match, no Persian to compare with, or the hold would break a guided-prayer step
#       or a helper quote -> needs-human.
#   Low rows: keep the current display -> low-pending-review.
#
# Human decisions in the decisions file (accepted, fix, withhold, decided, restored) are never touched:
# only rows whose status is automatic (below) are recomputed on each run.
import re
from collections import Counter, defaultdict

AUTO = {"pending", "hidden-pending-review", "persian-decided-pending-review", "needs-human", "low-pending-review"}


def triage(rows, dec, data, trees):
    entry = {}
    for r in data["rulings"]:
        for e in r["rulings"]:
            entry[(r["id"], e["marjaId"])] = e
    step_use = {(s["rulingId"], p["marjaId"]) for p in data["procedures"] for s in p["steps"]}
    tree_en = {(q["rulingId"], t["marjaId"]) for t in trees for n in t["nodes"]
               if n.get("outcome", {}).get("kind") == "ruling" for q in n["outcome"]["quotes"] if q["lang"] == "en"}
    groups = defaultdict(list)
    for row in rows:
        groups[(row["ruling"], row["marja"])].append(row)

    def put(row, status, hold=None, note=""):
        if dec[row["key"]]["status"] not in AUTO:
            return
        rec = {"status": status, "note": note}
        if hold: rec["hold"] = hold
        dec[row["key"]] = rec

    for (rid, marja), rs in groups.items():
        high = [r for r in rs if r["severity"] == "high"]
        for r in rs:
            if r["severity"] == "low":
                put(r, "low-pending-review", note="Same values or same presence of negation, different count; shown as is until reviewed.")
        if not high:
            continue
        if marja == "sistani":
            for r in high:
                put(r, "hidden-pending-review", "hide-ur", "Sistani: the English 4th edition wins (P6); the Urdu is hidden until a person checks it.")
            continue
        e = entry.get((rid, marja), {})
        ps = e.get("persianSource") or {}
        has_fa = ps.get("reference", "").startswith(("مسأله", "سؤال", "بند"))   # the Rules of prayer & fasting; the Rulings of Khums
        verdict, note, hold = "needs-human", "", None
        if not has_fa:
            note = "No Persian original to decide with (Q&A answer, or the Urdu-only treatise)."
        elif e.get("excerpt"):
            note = "The English is a verbatim excerpt (footnote trimmed), so it was not compared with the Persian."
        else:
            en_bad = any(r["pair"] == "en-fa" for r in high)
            ur_bad = any(r["pair"] == "ur-fa" for r in high)
            if ur_bad and not en_bad:
                verdict, hold, note = "persian-decided-pending-review", "hide-ur", "The English matches the Persian in numbers and negation; the Urdu does not, so the Urdu is hidden."
            elif en_bad and not ur_bad and not (e.get("text") or {}).get("ur"):
                note = "The English does not match the Persian, but there is no official Urdu to show instead, so the English was not hidden automatically."
            elif en_bad and not ur_bad:
                from holds import HELD_EN_STEP_CUTS, HELD_EN_TREE_URDU
                if ((rid, marja) in step_use and rid not in HELD_EN_STEP_CUTS) or ((rid, marja) in tree_en and rid not in HELD_EN_TREE_URDU):
                    note = "The Urdu matches the Persian and the English does not, but the English is quoted by a guided-prayer step or a helper answer that has no Urdu counterpart yet, so it was not hidden automatically."
                else:
                    verdict, hold, note = "persian-decided-pending-review", "hide-en", "The Urdu matches the Persian in numbers and negation; the English does not, so the English is hidden."
            elif en_bad and ur_bad:
                note = "Neither the English nor the Urdu matches the Persian."
            else:
                note = "Both versions match the Persian; they differ only from each other."
        for r in high:
            put(r, verdict, hold, note)


def summarise(rows, dec, data):
    topic_of = {rid: t["id"] for t in data["topics"] for rid in t["rulingIds"]}
    status = Counter(dec[r["key"]]["status"] for r in rows)
    hid = defaultdict(set)   # (marja, kind) -> {(ruling)}
    for r in rows:
        d = dec[r["key"]]
        if d.get("hold") and d["status"] in {"hidden-pending-review", "persian-decided-pending-review", "held-pending-review"}:
            hid[(r["marja"], d["hold"])].add(r["ruling"])
    per_topic = defaultdict(Counter)
    for (marja, hold), rids in hid.items():
        for rid in rids:
            per_topic[topic_of.get(rid, "?")][(marja, hold)] += 1
    return status, hid, per_topic
