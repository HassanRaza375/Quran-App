# Record a person's decision on mismatch rows (decision B1: restoring a hidden version must be a
# recorded decision, never a hand edit). Examples:
#   python scripts/wajibat/decide_mismatch.py --ruling doubtsvalid --marja sistani --status restored \
#       --reviewer "Name" --note "Urdu checked against the English: same"
#   python scripts/wajibat/decide_mismatch.py --key "rid|marja|text|en-ur" --status accepted --reviewer "Name"
# held-pending-review --hold refer: the ruling shows a pointer to his book until a person decides.
# Statuses: accepted (the versions say the same), restored (a hidden version is shown again),
# fix, withhold, decided. After recording, run `python scripts/wajibat/build.py` so the data follows.
import argparse, datetime, json, sys
from holds import DECISIONS

ap = argparse.ArgumentParser()
ap.add_argument("--key", action="append"); ap.add_argument("--hold", choices=["refer"]); ap.add_argument("--ruling"); ap.add_argument("--marja")
ap.add_argument("--status", required=True, choices=["accepted", "restored", "fix", "withhold", "decided", "held-pending-review"])
ap.add_argument("--reviewer", required=True); ap.add_argument("--note", default="")
a = ap.parse_args()
dec = json.load(open(DECISIONS, encoding="utf-8"))
keys = a.key if a.key else [k for k in dec if k.split("|")[0] == a.ruling and (not a.marja or k.split("|")[1] == a.marja)]
if not keys or any(k not in dec for k in keys):
    sys.exit("no matching mismatch row")
for k in keys:
    prev = dec[k]
    dec[k] = {"status": a.status, "note": a.note, "reviewer": a.reviewer, "date": datetime.date.today().isoformat(), "was": prev["status"]}
    if a.status == "held-pending-review":
        if not a.hold: sys.exit("held-pending-review needs --hold refer")
        dec[k]["hold"] = a.hold
json.dump(dec, open(DECISIONS, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1, sort_keys=True)
print(len(keys), "row(s) recorded as", a.status)
