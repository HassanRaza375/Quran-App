import sys, review_rules as r
from align_rules import en_to_fa
w = int(sys.argv[1])
for i in map(int, sys.argv[2:]):
    rid, n, e = r.ENTRIES[i]; m = en_to_fa(n)
    print(f"#{i} [{rid}] EN {n} ↔ {m}")
    print("  EN:", e["text"]["en"].replace("\n", " | ")[:w]); print("  FA:", r.F[m].replace("\n", " | ")[:w]); print("  UR:", r.U[m][0].replace("\n", " | ")[:w]); print()
