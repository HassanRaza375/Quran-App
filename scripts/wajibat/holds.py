# Display holds from the mismatch triage (decision B1, 2026-10-08). A hold decides only what is
# DISPLAYED until a person reviews the mismatch; it accepts nothing. Holds are read from the
# decisions file (tests/fixtures/wajibatMismatchDecisions.json), where each row carries
# status + hold. Restoring a version is a recorded decision there (status "restored"), never a hand
# edit of generated data. Generators call apply_holds()/apply_holds_procs() just before writing.
# Set WAJIBAT_HOLDS=0 to generate the full data (build.py does this for the mismatch comparison).
import json, os
from paths import REPO

DECISIONS = os.path.join(REPO, "tests", "fixtures", "wajibatMismatchDecisions.json")
HOLD_STATUSES = {"hidden-pending-review", "persian-decided-pending-review"}
HELD_UR_NOTE = "The Urdu text of this ruling is held back until a person has checked it against the English (the automated comparison found a difference in numbers or negation)."
HELD_EN_REASON = "Held for review: the automated comparison found a difference in numbers or negation between the English and the Persian original; the Urdu, which matches the Persian, is shown until a person has checked it."


def load_holds():
    """{(ruling id, marja'): "hide-ur" | "hide-en"}"""
    if os.environ.get("WAJIBAT_HOLDS", "1") == "0" or not os.path.exists(DECISIONS):
        return {}
    out = {}
    for key, rec in json.load(open(DECISIONS, encoding="utf-8")).items():
        if rec.get("status") in HOLD_STATUSES and rec.get("hold"):
            rid, marja = key.split("|")[:2]
            assert out.setdefault((rid, marja), rec["hold"]) == rec["hold"], ("conflicting holds", key)
    return out


def apply_holds(rulings):
    holds = load_holds()
    n = 0
    for r in rulings:
        for e in r["rulings"]:
            h = holds.get((r["id"], e["marjaId"]))
            if not h:
                continue
            if h == "hide-ur":
                e["text"].pop("ur", None)
                (e.get("question") or {}).pop("ur", None)
                e.pop("urSource", None)
                e["urduNote"] = HELD_UR_NOTE
            elif h == "hide-en":
                assert e["text"].get("ur"), ("cannot hold the English of a ruling that has no Urdu", r["id"])
                e["englishWithheld"] = HELD_EN_REASON
            n += 1
    return n


def apply_holds_procs(procs):
    """A step may not carry Urdu from a held Urdu text; English holds must never touch a step (the triage guarantees it)."""
    holds = load_holds()
    for p in procs:
        for s in p["steps"]:
            h = holds.get((s["rulingId"], p["marjaId"]))
            if h == "hide-ur":
                s["instruction"].pop("ur", None)
            assert h != "hide-en", ("English hold on a ruling used by a guided prayer step", s["rulingId"])
