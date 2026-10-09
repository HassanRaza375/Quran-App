# Regenerates every generated Wajibat data file and the source-snapshot fixture from the
# downloaded official sources in .cache/ (fill it first with fetch_sources.py).
# Usage (from the repo root):  python scripts/wajibat/build.py
# Then run `npm test` — the dataset validator and the source-snapshot check must both pass.
import os, subprocess, sys
from paths import DATA, FIXTURE, HERE, REPO, TMP

PY = sys.executable
R, P = os.path.join(DATA, "rulings"), os.path.join(DATA, "procedures")
STEPS = [
    ["gen_foundations.py", os.path.join(R, "foundations.ts")],
    ["gen_taharat.py", os.path.join(R, "taharat.ts"), os.path.join(P, "taharat.ts")],
    ["gen_salat.py", os.path.join(R, "salat.ts"), os.path.join(P, "salat.ts")],
    ["gen_kqa.py", os.path.join(R, "salatQa.ts"), os.path.join(R, "sawmQa.ts")],
    ["gen_doubts.py", os.path.join(R, "doubts.ts")],
    ["gen_sawm.py", os.path.join(R, "sawm.ts")],
    ["gen_glossary.py", os.path.join(DATA, "glossary.ts")],
    ["place_qa_ids.py"],
]

def run(cmd, **kw):
    print("$", " ".join(os.path.relpath(c, REPO) if os.path.isabs(c) else c for c in cmd), flush=True)
    subprocess.run(cmd, check=True, cwd=HERE, **kw)

env = dict(os.environ, PYTHONIOENCODING="utf-8")
def generate(holds):
    """Run every generator. holds="0" writes the full data (every language version, no display
    holds); holds="1" applies the display holds from the mismatch triage (holds.py, decision B1)."""
    for script, *outs in STEPS:
        if not os.path.exists(os.path.join(HERE, script)):
            continue
        run([PY, script, *outs], env=dict(env, WAJIBAT_HOLDS=holds))

# Dump the dataset to JSON (the decision helpers and the snapshot read it).
bundle = os.path.join(TMP, "wdata.mjs")
npx = "npx.cmd" if os.name == "nt" else "npx"

def dump():
    run([npx, "esbuild", os.path.join(DATA, "index.ts"), "--bundle", "--format=esm", "--platform=node",
         "--alias:~=" + os.path.join(REPO, "app"), "--outfile=" + bundle, "--log-level=warning"])
    run(["node", "dump_dataset.mjs", bundle, os.path.join(TMP, "wdata.json")])

# Pass 1: the full data, so the mismatch check sees every language version, and the triage
# (triage_mismatch.py) turns its High rows into display holds. Pass 2: the data as displayed.
generate("0")
dump()
# Automated mismatch check over every language version (decision A1) and its safe-default triage (B1):
# refreshes tests/fixtures/wajibatMismatches.json (the test requires it to match the TypeScript twin),
# adds/updates rows in wajibatMismatchDecisions.json (human decisions are never touched) and rewrites
# wajibat_mismatch_report.md and wajibat_needs_human.md.
run([PY, "mismatch.py"], env=env)
generate("1")
dump()
# Phase 4b decision helpers: authored in tree_*.py, quotes cut verbatim from the dump above, then
# written to decisionTrees.ts; dump again so the snapshot and tests see the trees too.
run([PY, "gen_helpers.py"], env=env)
dump()
# Snapshot of every quote's source unit, read from the downloaded pages (never from the dataset).
run([PY, "snapshot.py", FIXTURE], env=env)
# One-line index of every ruling for search and links (the app loads ruling text per category).
run([PY, "gen_index.py"], env=env)
print("done — now run `npm test`")
